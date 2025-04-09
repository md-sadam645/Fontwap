function ajax(request) {
  return new Promise(function (resolve, reject) {
    const options = {
      type: request.type,
      url: request.url,
      beforeSend: function () {
        if (request.isLoader == true) {
          $(request.commonBtn).addClass("d-none");
          $(request.loaderBtn).removeClass("d-none");
        }
      },
      success: function (response) {
        if (request.isLoader == true) {
          $(request.commonBtn).removeClass("d-none");
          $(request.loaderBtn).addClass("d-none");
        }
        resolve(response);
      },
      error: function (error) {
        if (request.isLoader == true) {
          $(request.commonBtn).addClass("d-none");
          $(request.loaderBtn).removeClass("d-none");
        }
        reject(error);
      },
    };

    if (request.type == "POST" || request.type == "PUT") {
      options["data"] = request.data;
      options["processData"] = false;
      options["contentType"] = false;
    }

    if (request.type == "DELETE") {
      options["data"] = request.data;
    }

    $.ajax(options);
  });
}

function getCookies(cookieName) {
  const allCookie = document.cookie;
  const cookies = allCookie.split(";");
  let token = "";
  for (let cookie of cookies) {
    let currentCookie = cookie.split("=");
    if (currentCookie[0] == cookieName) {
      token = currentCookie[1];
      break;
    }
  }
  return token;
}

function dateFormate(dateTime) {
  const date = new Date(dateTime);
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  let time = date.toLocaleTimeString();
  return day + "-" + month + "-" + year + " " + time;
}

function decodeToken(token) {
  let payload = token.split(".")[1];
  let string = atob(payload);
  return JSON.parse(string);
}

$(document).ready(function () {
  $(".mbl-error").hide();
  $(".email-error").hide();

  $("#clientMbl").on("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, "");
    if (this.value.length !== 10) {
      $(".mbl-error").show();
      $(".add-client-submit").prop("disabled", true);
    } else {
      $(".mbl-error").hide();
      $(".add-client-submit").prop("disabled", false);
    }
  });

  $("#addClientEmail").on("input", function (e) {
    // Regular expression for email validation
    var reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    var email = $(this).val();

    if (reg.test(email)) {
      $(".email-error").hide();
      $(".add-client-submit").prop("disabled", false);
    } else {
      $(".email-error").show();
      $(".add-client-submit").prop("disabled", true);
    }
  });
});

async function ajaxDownloader(req) {
  return $.ajax({
    type: req.type,
    url: req.url,
    xhr: function () {
      const xml = new XMLHttpRequest();
      xml.responseType = "blob";
      return xml;
    },
  }).promise();
}
