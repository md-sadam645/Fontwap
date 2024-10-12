$(document).ready(function () {
  $(".sidebarToggle").click(function () {
    const state = $(".sidenav").hasClass("sidenav-open");
    if (state) {
      $(".sidenav").removeClass("sidenav-open");
      $(".sidenav").addClass("sidenav-close");

      $(".section").addClass("section-open");
      $(".section").removeClass("section-close");
    } else {
      $(".sidenav").removeClass("sidenav-close");
      $(".sidenav").addClass("sidenav-open");

      $(".section").addClass("section-close");
      $(".section").removeClass("section-open");
    }
  });
});

//show company info
$(document).ready(function () {
  const token = getCookies("authToken");
  let company = decodeToken(token).data.companyInfo;
  $(".company-name").html(company.c_name);
  $(".company-email").html(company.email);
  $(".company-mobile").html(company.mobile);
});

//upload company logo
$(document).ready(function () {
  $(".logo-box").click(function () {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async function () {
      let file = input.files[0];
      let ext = ["image/jpg", "image/png", "image/jpeg", "image/webp"];

      if (ext.indexOf(file.type) != -1) {
        await companyUpdate(file);
      } else {
        alert("Please Select Valid Image!");
      }
    };
  });
});

async function companyUpdate(file) {
  const token = getCookies("authToken");
  const dToken = decodeToken(token);
  const id = dToken.data.companyInfo._id;

  let formData = new FormData();
  // formData.append("image",file);
  formData.append("token", token);
  formData.append("id", id);

  const request = {
    type: "get",
    url: "/api/private/company/5555",
  };

  try {
    const response = await ajax(request);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
