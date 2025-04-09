$(document).ready(function () {
  $("#country").on("input", async function () {
    let keyword = $(this).val().trim().toLowerCase();
    const request = {
      type: "GET",
      url: "../json/country-code.json",
    };

    const lsResponse = setClientLs();
    if (lsResponse.isExists) {
      const countries = lsResponse.data;
      for (let country of countries) {
        if (country.name.toLowerCase().indexOf(keyword) != -1) {
          $("#country-code").html(country.dial_code);
        }
      }
    } else {
      const response = await ajax(request);
      const cData = JSON.stringify(response);
      localStorage.setItem("countryCode", cData);
    }
  });
});

$(document).ready(function () {
  $(".add-client-button").click(function () {
    $("#clientForm").addClass("add-client-form");
    $("#clientForm").removeClass("update-client-form");
    $(".add-client-submit").removeClass("btn-danger px-3");
    $(".add-client-submit").addClass("btn-primary");
    $(".add-client-submit").html("Submit");
    $("#clientModal").modal("show");
    addClient();
  });
});

//Add Client
function addClient() {
  $(".add-client-form").submit(async function (e) {
    e.preventDefault();
    const token = getCookies("authToken");
    const formData = new FormData(this);
    formData.append("token", token);
    const request = {
      type: "POST",
      url: "/allClient",
      data: formData,
      isLoader: true,
      commonBtn: ".add-client-submit",
      loaderBtn: ".add-client-loader",
    };

    try {
      const response = await ajax(request);

      //prevent from multiple submit
      $(".add-client-form").unbind();

      $(".add-client-form")[0].reset();

      $("#clientModal").modal("hide");
      const tr = dynamicTr(response.data);
      $("table").append(tr);
      clientAction();
    } catch (error) {
      //   console.log(error);
      $(".add-client-submit").removeClass("d-none");
      $(".add-client-loader").addClass("d-none");
      $("#addClientEmail").addClass(
        "animate__animated animate__shakeX text-danger"
      );
      $("#addClientEmail").click(function () {
        $("#addClientEmail").removeClass(
          "animate__animated animate__shakeX text-danger"
        );
        $("#addClientEmail").val("");
      });
    }
  });
}

//Update Client
function updateClient(oldTr) {
  $(".update-client-form").submit(async function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const token = getCookies("authToken");
    const formData = new FormData(this);
    formData.append("created_at", new Date());
    formData.append("token", token);
    const request = {
      type: "PUT",
      url: "/allClient/" + id,
      data: formData,
      isLoader: true,
      commonBtn: ".add-client-submit",
      loaderBtn: ".add-client-loader",
    };

    const response = await ajax(request);
    const client = response.data;
    const tr = dynamicTr(client);
    const updateTd = $(tr).html();
    $(oldTr).html(updateTd);
    $("#clientModal").modal("hide");
    clientAction();
  });
}

//show client
$(document).ready(async function () {
  let from = 0;
  let to = 5;
  await showClient(from, to);
  await pagination();
});

async function showClient(from, to) {
  $("table").html(
    `<tr>
            <th class="py-2 ps-2">Client</th>
            <th class="py-2">Email</th>
            <th class="py-2">Mobile</th>
            <th class="py-2">Status</th>
            <th class="py-2">Update Date</th>
            <th class="py-2">Actions</th>
        </tr>`
  );
  const request = {
    type: "GET",
    url: `/allClient/${from}/${to}`,
    isLoader: true,
    commonBtn: ".tmp",
    loaderBtn: ".client-skeleton",
  };

  const response = await ajax(request);
  if (response.data.length > 0) {
    sessionStorage.setItem("client-data", JSON.stringify(response.data));

    for (let client of response.data) {
      const tr = dynamicTr(client);
      $("table").append(tr);
    }

    await clientAction();
  } else {
    console.log("Client not found");
  }
}

async function pagination() {
  const request = {
    type: "GET",
    url: "/allClient/count-all",
  };

  const response = await ajax(request);
  const client = response.data;
  let clientCount = client / 5;
  let i;
  let skipData = 0;
  if (clientCount.toString().indexOf(".") != -1) {
    clientCount = clientCount + 1;
  }
  for (i = 1; i <= clientCount; i++) {
    const button = `
            <button class="btn border paginate-btn ${
              i == 1 ? "active" : ""
            }" data-skip="${skipData}">
               ${i}
            </button>
        `;
    skipData = skipData + 5;
    $("#clientPagination").append(button);
  }
  await getPaginationData();
}

function clientAction() {
  //Delete Client
  $(document).ready(function () {
    $(".client-delete").each(function () {
      $(this).click(async function () {
        const id = $(this).data("id");
        const tr = this.parentElement.parentElement.parentElement;
        const token = getCookies("authToken");
        const request = {
          type: "DELETE",
          url: "allClient/" + id,
          data: { token: token },
        };

        await ajax(request);
        $(tr).removeClass("animate__animated animate__fadeIn");
        $(tr).addClass("animate__animated animate__fadeOut");
        setTimeout(function () {
          $(tr).remove();
        }, 4000);
      });
    });
  });

  //Edit Client
  $(document).ready(function () {
    $(".client-edit").each(function () {
      $(this).click(function () {
        let id = $(this).data("id");
        let tr = this.parentElement.parentElement.parentElement;
        const clientString = $(this).data("client");
        const clientData = clientString.replace(/'/g, '"');
        const client = JSON.parse(clientData);
        for (let key in client) {
          const value = client[key];
          $(`[name=${key}]`, "#clientForm").val(value);
        }
        $("#clientForm").attr("data-id", id);
        $("#clientForm").addClass("update-client-form");
        $("#clientForm").removeClass("add-client-form");
        $(".add-client-submit").removeClass("btn-primary");
        $(".add-client-submit").addClass("btn-danger px-3");
        $(".add-client-submit").html("Save");
        $("#clientModal").modal("show");
        updateClient(tr);
      });
    });
  });

  //Share Link
  $(document).ready(function () {
    $(".client-share").each(function () {
      $(this).click(async function () {
        let id = $(this).data("id");
        $("#shareModal").modal("show");

        const token = getCookies("authToken");
        const formData = new FormData();
        formData.append("data", JSON.stringify({ id: id }));
        formData.append("token", token);

        const request = {
          type: "POST",
          url: "/get-token/172800",
          data: formData,
        };

        const res = await ajax(request);
        const resToken = res.data.token;

        $(".link").val(`${window.location}/invitation/${resToken}`);
        $(".link").on("keydown", function () {
          return false;
        });

        $(".copy-link").click(function () {
          var data = document.querySelector(".link");
          data.select();
          document.execCommand("copy");
          $("i", this).removeClass("fa fa-copy");
          $("i", this).addClass("fa fa-check");
          setTimeout(() => {
            $("i", this).removeClass("fa fa-check");
            $("i", this).addClass("fa fa-copy");
          }, 2000);
        });

        $(".share-on-email").click(function () {
          var data = document.querySelector(".link");
        });
      });
    });
  });
}

function setClientLs() {
  if (localStorage.getItem("countryCode") != null) {
    const data = localStorage.getItem("countryCode");
    const response = {
      isExists: true,
      data: JSON.parse(data),
    };
    return response;
  } else {
    const response = {
      isExists: false,
    };
    return response;
  }
}

function dynamicTr(client) {
  const clientString = JSON.stringify(client);
  let clientData = clientString.replace(/"/g, "'");
  const tr = `
    <tr class="animate__animated animate__fadeIn animate__slow">
        <td>
            <div class="d-flex align-items-center">
                <i class="fa fa-user-circle me-3" style="font-size:45px;"></i>
                <div>
                    <p class="p-0 m-0 text-capitalize client-name">${
                      client.name
                    }</p>
                    <small class="text-capitalize">${client.country}</small>
                </div>
            </div>
        </td>
        <td class="client-email">${client.email}</td>
        <td>${client.mobile}</td>
        <td><span class="badge badge-danger text-white">Offline</span></td>
        <td>${dateFormate(client.created_at)}</td>
        <td>
            <div class="d-flex">
            <button class="icon-btn-primary me-3 client-edit" data-client="${clientData}" data-id="${
    client._id
  }">
                <i class="fa fa-edit"></i>
            </button>
            <button class="icon-btn-danger me-3 client-delete" data-id="${
              client._id
            }">
                <i class="fa fa-trash"></i>
            </button>
            <button class="icon-btn-info client-share" data-id="${client._id}">
                <i class="fa fa-share-alt"></i>
            </button>
            </div>
        </td>
    </tr>
    `;

  return tr;
}

// function ajax(request){
//     return new Promise(function(resolve,reject){
//         const options = {
//             type: request.type,
//             url : request.url,
//             beforeSend : function(){
//                 if(request.isLoader == true)
//                 {
//                     $(request.commonBtn).addClass('d-none');
//                     $(request.loaderBtn).removeClass('d-none');
//                 }
//             },
//             success : function(response){
//                 if(request.isLoader == true)
//                 {
//                     $(request.commonBtn).removeClass('d-none');
//                     $(request.loaderBtn).addClass('d-none');
//                 }
//                 resolve(response);
//             },
//             error: function(error){
//                 if(request.isLoader == true)
//                 {
//                     $(request.commonBtn).addClass('d-none');
//                     $(request.loaderBtn).removeClass('d-none');
//                 }
//                 reject(error);
//             }
//         };

//         if(request.type == "POST" || request.type == "PUT")
//         {
//             options['data'] = request.data;
//             options['processData'] = false;
//             options['contentType'] = false;
//         }

//         if(request.type == "DELETE")
//         {
//             options['data'] = request.data;
//         }

//         $.ajax(options);
//     });
// }

// function getCookies(cookieName){
//     const allCookie = document.cookie;
//     const cookies = allCookie.split(";");
//     let token = "";
//     for(let cookie of cookies)
//     {
//         let currentCookie = cookie.split("=");
//         if(currentCookie[0] == cookieName)
//         {
//             token = currentCookie[1];
//             break;
//         }
//     }
//     return token;
// }

// function dateFormate(dateTime)
// {
//     const date = new Date(dateTime);
//     let day = date.getDate();
//     if(day < 10)
//     {
//         day = "0"+day;
//     }
//     let month = date.getMonth()+1;
//     if(month < 10)
//     {
//         month = "0"+month;
//     }
//     let year = date.getFullYear();
//     let time = date.toLocaleTimeString();
//     return day+"-"+month+"-"+year+" "+time;
// }

function getPaginationData() {
  $(document).ready(function () {
    $(".paginate-btn").each(function (index) {
      $(this).click(function () {
        controlPrevAndNext(index);
        removeClasses("active");
        $(this).addClass("active");
        let skip = $(this).data("skip");
        showClient(skip, 5);
      });
    });
  });
}

function removeClasses(className) {
  // alert();
  $("." + className).each(function () {
    $(this).removeClass(className);
  });
}

//Next Button Control
$(document).ready(function () {
  $("#next").click(function () {
    let currentIndex = 0;
    $(".paginate-btn").each(function () {
      if ($(this).hasClass("active")) {
        currentIndex = currentIndex + $(this).index();
      }
    });

    $(".paginate-btn")
      .eq(currentIndex + 1)
      .click();
    controlPrevAndNext(currentIndex + 1);
  });
});

//Prev Button Control
$(document).ready(function () {
  $("#prev").click(function () {
    let currentIndex = 0;
    $(".paginate-btn").each(function () {
      if ($(this).hasClass("active")) {
        currentIndex = currentIndex + $(this).index();
      }
    });

    $(".paginate-btn")
      .eq(currentIndex - 1)
      .click();
    controlPrevAndNext(currentIndex - 1);
  });
});

function controlPrevAndNext(currentIndex) {
  const totalCount = $(".paginate-btn").length;
  if (totalCount == currentIndex) {
    $("#next").prop("disabled", true);
  } else if (currentIndex > 0) {
    $("#prev").prop("disabled", false);
  } else {
    $("#prev").prop("disabled", true);
    $("#next").prop("disabled", false);
  }
}

$(document).ready(function () {
  filterByName();
  $(".filter-btn").click(function () {
    if ($(".filter").hasClass("filter-by-name")) {
      $(".filter").removeClass("filter-by-name");
      $(".filter").addClass("filter-by-email");
      $(".filter").attr("placeholder", "Search by email");
      filterByEmail();
    } else {
      $(".filter").removeClass("filter-by-email");
      $(".filter").addClass("filter-by-name");
      $(".filter").attr("placeholder", "Search by name");
    }
  });
});

//Filter By Name
function filterByName() {
  $(".filter-by-name").on("input", function () {
    let keyword = $(this).val().trim().toLowerCase();
    $(".client-name").each(function () {
      let tr = "";
      const value = $(this).html().toLowerCase();
      if (value.indexOf(keyword) == -1) {
        tr = $(this).parent().parent().parent().parent();
        $(tr).addClass("d-none");
      } else {
        tr = $(this).parent().parent().parent().parent();
        $(tr).removeClass("d-none");
      }
    });
  });
}

//Filter By Email
function filterByEmail() {
  $(".filter-by-email").on("input", function () {
    let keyword = $(this).val().trim().toLowerCase();
    $(".client-email").each(function () {
      let tr = "";
      const value = $(this).html().toLowerCase();
      if (value.indexOf(keyword) == -1) {
        tr = $(this).parent();
        $(tr).addClass("d-none");
      } else {
        tr = $(this).parent();
        $(tr).removeClass("d-none");
      }
    });
  });
}

//Exports to pdf
$(document).ready(function () {
  $("#current").click(async function () {
    const clientData = sessionStorage.getItem("client-data");
    if (clientData !== null) {
      const token = getCookies("authToken");
      const formData = new FormData();
      formData.append("data", clientData);
      formData.append("token", token);

      const request = {
        type: "POST",
        url: "exports-to-pdf",
        data: formData,
      };

      try {
        const response = await ajax(request);
        if (response.status === 1) {
          const fileRequest = {
            type: "GET",
            url: "/exports/" + response.filename,
          };

          const pdfFile = await ajaxDownloader(fileRequest);
          const fileUrl = URL.createObjectURL(pdfFile);
          const a = document.createElement("a");
          a.href = fileUrl;
          a.download = response.filename;
          a.click();
          a.remove();

          deletePdf(response.filename);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Client Not Found");
    }
  });
});

//Exports to pdf all clients records
$(document).ready(function () {
  $("#all").click(async function () {
    const request = {
      type: "GET",
      url: "/allClient/all",
    };

    try {
      const response = await ajax(request);
      console.log(response.data);
      const token = getCookies("authToken");
      const formData = new FormData();
      formData.append("data", JSON.stringify(response.data));
      formData.append("token", token);

      const dataRequest = {
        type: "POST",
        url: "exports-to-pdf",
        data: formData,
      };
      const dataResponse = await ajax(dataRequest);
      if (dataResponse.status === 1) {
        const fileRequest = {
          type: "GET",
          url: "/exports/" + dataResponse.filename,
        };

        const pdfFile = await ajaxDownloader(fileRequest);
        const fileUrl = URL.createObjectURL(pdfFile);
        const a = document.createElement("a");
        a.href = fileUrl;
        a.download = dataResponse.filename;
        a.click();
        a.remove();

        deletePdf(dataResponse.filename);
      }
    } catch (error) {
      console.log(error);
    }
  });
});

async function deletePdf(filename) {
  const token = getCookies("authToken");
  const request = {
    type: "DELETE",
    url: "/exports-to-pdf/delete/" + filename,
    data: {
      token: token,
    },
  };

  const response = await ajax(request);
}
