//request login modal
$(document).ready(() => {
  $("#request-login-modal").click(() => {
    $("#signup-modal").modal("hide");
    $("#signin-modal").modal("show");
  });
});

//request register modal
$(document).ready(() => {
  $("#request-register-modal").click(() => {
    $("#signin-modal").modal("hide");
    $("#signup-modal").modal("show");
  });
});

//company register
$(document).ready(() => {
  $("#signup-form").submit((e) => {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "api/signup",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: () => {
        $(".signup-btn").addClass("d-none");
        $(".before-send").removeClass("d-none");
      },
      success: (response) => {
        $(".signup-btn").removeClass("d-none");
        $(".before-send").addClass("d-none");
        if (response.isUserCreated) {
          window.location = "/allClient";
        }
      },
      error: (err) => {
        $(".signup-btn").removeClass("d-none");
        $(".before-send").addClass("d-none");
        // console.log(err.responseJSON.data);
        if (err.status == 409) {
          const field = "." + err.responseJSON.data.field;
          const label = err.responseJSON.data.label;
          $(field).addClass("border-danger");
          $(field + "-error").html(label);
          setTimeout(() => formValidator(field), 3000);
        } else {
          alert("Internal server error");
        }
      },
    });
  });
});

// if user already login
if (document.cookie.indexOf("authToken") != -1) {
  window.location = "/allClient";
}

//company login
$(document).ready(() => {
  $("#login-form").submit((e) => {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "api/login",
      data: new FormData(e.target),
      processData: false,
      contentType: false,
      beforeSend: () => {
        $(".login-btn").addClass("d-none");
        $(".before-send").removeClass("d-none");
      },
      success: (response) => {
        $(".login-btn").removeClass("d-none");
        $(".before-send").addClass("d-none");
        if (response.isLogged) {
          window.location = "/allClient";
        } else {
          $(".password").addClass("border border-danger");
          $(".password-error").html(err.responseJSON.msg);
        }
      },
      error: (err) => {
        $(".login-btn").removeClass("d-none");
        $(".before-send").addClass("d-none");
        $(".username").removeClass("border border-danger");
        $(".password").removeClass("border border-danger");
        $(".password-error").html("");
        $(".username-error").html("");

        if (err.status == 401) {
          $(".password").addClass("border border-danger");
          $(".password-error").html(err.responseJSON.msg);
        }
        if (err.status == 404) {
          $(".username").addClass("border border-danger");
          $(".username-error").html(err.responseJSON.msg);
        }
        if (err.status == 406) {
          // $('.password').addClass('border border-danger');
          $(".password-error").html(err.responseJSON.msg);
        } else {
          console.log("internal error");
        }
      },
    });
  });
});

function formValidator(field) {
  $(field).removeClass("border-danger");
  $(field + "-error").html("");
}
