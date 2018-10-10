
const ACCESS_OVERVIEW = 10;

function handleSignUp(event) {
    event.preventDefault();
    $('.js-loader').show();

    const userData = {
        name: $('#name').val(),
        email: $('#email').val(),
        username: $('#username').val(),
        password: $('#password').val()
    };

    console.log(userData);
     
    userSignup({
        userData,
        onSuccess: user => {
            $('#username, #password, #name, #email').val("");
            console.log('Succesful Sign Up');
            renderLoginForm();
        }
    })
}

function handleLogIn(event) {
    event.preventDefault();
    $('.js-loader').show();

    const userData = {
        username: $('#username').val(),
        password: $('#password').val()
    };
    
   userLogin({
        userData,
        onSuccess: res => {
            const authenticatedUser = res.user;
            authenticatedUser.jwToken = res.jwToken;
            saveAuthenticatedUserIntoCache(authenticatedUser);
            console.log('Succesful Login');
            $('#username, #password').val("");
      
            if (authenticatedUser.accessLevel > ACCESS_OVERVIEW) {
                // render search options
                pushSiteState("search");
                renderSearchBar();
            }
            else {
                // render overview search
                 pushSiteState("overview");
                 renderSearchEmployeeOverview();
            }
        }
    })
}

function handleLogOut(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        deleteAuthenticatedUserFromCache();
        renderLoginForm();
    }
}

