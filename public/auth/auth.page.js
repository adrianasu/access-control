
const ACCESS_OVERVIEW = 10;

function logInSuccess(user) {
    console.log('Succesful Login');
    $('#username, #password').val("");
    clearScreen();
    if (user.accessLevel > ACCESS_OVERVIEW) {
        renderSearchBar();
    } else {
        renderSearchEmployeeOverview();
    }
    doConfirm(user.name, "welcome");
    return user;
}

function doLogin(userData) {
    return userLogin({ userData })
        .then(res => {
            const authenticatedUser = res.user;
            authenticatedUser.jwToken = res.jwToken;
            saveAuthenticatedUserIntoCache(authenticatedUser);
            return logInSuccess(authenticatedUser);
        })
}

function handleSignUp(event) {
    event.preventDefault();
    $('.js-loader').show();
    const userData = {
        name: $('#name').val(),
        email: $('#email').val(),
        username: $('#username').val(),
        password: $('#password').val()
    };
    return userSignup({ userData })
        .then(user => {
            $('#username, #password, #name, #email').val("");
            console.log('Succesful Sign Up');
            return doLogin(userData);
         })
}

function handleLogIn(event) {
    event.preventDefault();
    $('.js-loader').show();
    const userData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    doLogin(userData);
}



function handleLogOut() {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        deleteAuthenticatedUserFromCache();
        renderLoginForm();
    }
}

