// window.AUTH_MODULE = {
//     handleSignUp,
//     handleLogIn,
//     handleLogOut
// };


// //let STATE = {};
// // modules defined in public/utilities
// const RENDER_EMPLOYEE = window.RENDER_EMPLOYEE_MODULE;
// const RENDER_OTHER = window.RENDER_OTHER_MODULE;
// const HTTP_USER = window.HTTP_USER_MODULE;
// const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;
// const CACHE = window.CACHE_MODULE;

const ACCESS_OVERVIEW = 10;

function handleSignUp(event) {
    event.preventDefault();
    $('.js-loader').show();

    const userData = {
        name: $('#js-name').val(),
        email: $('#js-email').val(),
        username: $('#js-username').val(),
        password: $('#js-password').val()
    };
    
    userSignup({
        userData,
        onSuccess: user => {
            $('#js-username, #js-password, #js-name, #js-email').val("");
            console.log('Succesful Sign up');
          
            renderLoginForm();
        }
    })
}

function handleLogIn(event) {
    event.preventDefault();
    $('.js-loader').show();

    const userData = {
        username: $('#js-username').val(),
        password: $('#js-password').val()
    };
    
    HTTP_USER.userLogin({
        userData,
        onSuccess: res => {
            const authenticatedUser = res.user;
            authenticatedUser.jwToken = res.jwToken;
            CACHE.saveAuthenticatedUserIntoCache(authenticatedUser);
            console.log('Succesful Login');
            $('#js-username, #js-password').val("");
      
            if (authenticatedUser.accessLevel > ACCESS_OVERVIEW) {
                // render search options
                RENDER_OTHER.renderSearchBar();
            }
            else {
                // render overview search
                 RENDER_EMPLOYEE.renderEmployeeOverview();
            }
        }
    })
}

function handleLogOut(event) {
    const confirmation = confirm('Are you sure you want lo logout?');
    if (confirmation) {
        CACHE.deleteAuthenticatedUserFromCache();
        RENDER_OTHER.renderLoginForm();
    }
}

