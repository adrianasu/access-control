
function getToken(username, password) {
  let settings = {
      type: "POST",
      url: "/auth/login",
      contentType: "application/json",
      dataType: "json",
      user: {
          user: {
              password: password,
              username: username
          }
      },
  };
  return $.ajax(settings);
} 

function handleError(xhr) {
    let message = "Something went wrong, please try again.";
    if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.description) {
        message = xhr.responseJSON.error.description;
    }
    $('.js-start-loader').hide();
    $('.js-error-message').html(`<p>${message}</p>`).show();
}

function handleLogIn(event) {
    let user, jwToken;
    event.preventDefault();
    $('.js-start-loader').show();
    let usernameInput = $('#js-username');
    let passwordInput = $('#js-password');
    let username = usernameInput.val();
    let password = passwordInput.val();
    usernameInput = "";
    passwordInput = "";
    return getToken(username, password)
        .then(jsonResponse => {
            jwToken = jsonResponse.jwToken;
            user = jsonResponse.user;
            $('.js-start-loader').hide();
            let ACCESS_OVERVIEW = 10;
            if (user.accessLevel > ACCESS_OVERVIEW) {
                console.log("Yay");

            }
        })
        .catch(handleError)
}

function watchSubmitButton() {
    $('.js-login-form').on('submit', handleLogIn);
}

function showLogInPage() {
    $('.js-login-form').show();
}

function main() {
    showLogInPage();
    watchSubmitButton();
}

$(main);