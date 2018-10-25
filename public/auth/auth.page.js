
const ACCESS_OVERVIEW = 10;

function logInSuccess(user) {
    console.log('Succesful Login');
    $('#username, #password').val("");
    clearScreen();
    renderSearchMenu(user);
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
    const userData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    
    return doLogin(userData);
}

function handleLogOut() {
        reset();
}

