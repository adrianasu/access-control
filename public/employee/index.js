
let STATE = {}; 

function updateAuthenticatedUI() {
    const authUser = getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
    } 
}

// function handleSearchOptions(event) {
//     event.stopImmediatePropagation();
//     const selectedOption = $(event.currentTarget)
//                             .closest()
//                             .val();
//     console.log(selectedOption);
//     updateAuthenticatedUI();
//     if (STATE.authUser) {
//         if (selectedOption === "overview") {
//             HISTORY.screens.overview.render;
//         }
//         else {
//             // get all (selectedOption)
//             HISTORY.screens.list.render
//         }
//     }
// }

function handleSearchEmployeeOverview(event) {
    event.preventDefault();
    $('.js-loader').show();
    const employeeId = { employeeId: $('#employeeId').val() };
    STATE.authUser = getAuthenticatedUserFromCache();
    const jwToken = STATE.authUser.jwToken;

    overviewById({
        employeeId,
        jwToken,
        onSuccess: res => {
            $('#employeeId').val("");
            renderSearchEmployeeOverview(res);
        }
    })
}

function watchButtons() {
    $('.js-form').on('submit', '.js-login-form', handleLogIn);
    $('.js-form').on('click', '.js-signup-link', renderSignUpForm);
    $('.js-form').on('click', '.js-logout', handleLogOut);
    $('.js-form').on('submit', '.js-signup-form', handleSignUp);
    $('.js-form').on('click', '.js-login-link', renderLoginForm);
    $('.js-form').on('submit', '.js-search-form', handleSearchEmployeeOverview)
    $('.js-nav-bar').on('click', 'li a', handleOptions)
}

function main() {
    renderLoginForm();
    watchButtons();
    
}

$(main);