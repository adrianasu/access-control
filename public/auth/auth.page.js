let STATE = {};
// modules defined in public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP_USER = window.HTTP_USER_MODULE;
const CACHE = window.CACHE_MODULE;

const ACCESS_OVERVIEW = 10;

function handleSignUp(event) {
    event.preventDefault();
    $('.js-start-loader').show();

    const userData = {
        name: $('#js-name').val(),
        email: $('#js-email').val(),
        username: $('#js-username').val(),
        password: $('#js-password').val()
    };
    $('#js-username, #js-password, #js-name, #js-email').val("");

    HTTP_USER.userSignup({
        userData,
        onSuccess: user => {
            console.log('Succesful Sign up');
            $('.js-start-loader').hide();
            window.open('/login.html', '_self');
        },
        onError: err => {
            handleError(err);
        }
    })
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
    event.preventDefault();
    $('.js-start-loader').show();

    const userData = {
        username: $('#js-username').val(),
        password: $('#js-password').val()
    };
    $('#js-username, #js-password').val("");

    HTTP_USER.userLogin({
        userData,
        onSuccess: res => {
            const authenticatedUser = res.user;
            authenticatedUser.jwToken = res.jwToken;
            CACHE.saveAuthenticatedUserIntoCache(authenticatedUser);
            console.log('Succesful Login');
            $('.js-start-loader').hide();
            if (authenticatedUser.accessLevel > ACCESS_OVERVIEW) {
                window.open('/employee/options', '_self');
            }
            else {
                window.open('/overview/search', '_self');
            }
        },
        onError: err => {
            handleError(err);
        }
    })
}

function watchSubmitButton() {
    $('.js-login-form').on('submit', handleLogIn);
    $('.js-signup-form').on('submit', handleSignUp);
}

function showLogInPage() {
    $('.js-login-form').show();
}

function main() {
    showLogInPage();
    watchSubmitButton();
}

$(main);