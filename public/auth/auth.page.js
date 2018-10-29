
const ACCESS_OVERVIEW = 10;

function logInSuccess(user) {
    console.log('Succesful Login');
    $('#username, #password').val("");
    clearScreen();
    renderWelcome(user);
    return user;
}


// log in and save user in cache
function logInAndSaveUser(userData) {
    return userLogin({
        userData
    })
    .then(res => {
        const authenticatedUser = res.user;
        authenticatedUser.jwToken = res.jwToken;
        saveAuthenticatedUserIntoCache(authenticatedUser);
        return authenticatedUser;
    })
    
}
// log in, save user in cache and go to home page
function doLogin(userData) {
    return logInAndSaveUser(userData)
        .then(user => {
            return logInSuccess(user);
        })
}

function handleSignUp(event) {
    event.preventDefault();
     event.stopPropagation();
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
    event.stopPropagation();
    const userData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    
    return doLogin(userData);
}

function handleLogOut() {
        reset();
}

