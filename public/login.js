const token;
const userId;

const { ACCESS_OVERVIEW, ACCESS_PUBLIC, ACCESS_ADMIN } = require('../user/user.model');

function getToken(username, password) {
  let settings = {
      data: {
          username: username,
          password: password
      },
      type: "POST",
      dataType: "json"
  };
  return $.ajax(settings);
} 

function handleError(error) {
    $('.js-start-loader').hide();
    $('.js-error-message').html(`<p>${error}</p>`).show();
}

function handleLogIn(event) {
    let user, jwToken;
    event.preventDefault();
    $('.js-start-loader').show();
    const usernameInput = $('#js-username');
    const passwordInput = $('#js-password');
    const username = usernameInput.val();
    const password = passwordInput.val();
    usernameInput = "";
    passwordInput = "";
    return getToken(username, password)
        .then(jsonResponse => {
            jwToken = jsonResponse.jwToken;
            user = jsonResponse.user;
            $('.js-start-loader').hide();
           
            if (user.accessLevel > ACCESS_OVERVIEW) {
                
            }
        })
        .catch(error => handleError)
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