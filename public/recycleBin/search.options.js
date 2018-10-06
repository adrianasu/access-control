let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_EMPLOYEE_MODULE;
const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;
const HTTP_USER = window.HTTP_USER_MODULE;
const CACHE = window.CACHE_MODULE;

const overviewAccessLevel = 10;



function getAllEmployees() {
  HTTP_EMPLOYEE.employeesGetAll({
      jwToken: STATE.authUser.jwToken,
      onSuccess: RENDER.renderEmployeesList,
      onError: HTTP_EMPLOYEE.handleError
  })
}

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function handleSearchOptions() {
    let searchBy = $('#search-by').val();
    if(searchBy === "all") getAllEmployees();
    if(searchBy === "employee-id") searchEmployeeId();
    ///////////////////////////////////////////////////////////
    ////// I AM HERE
    //if(searchBy === )

}

function watchButtons() {
    $('.js-search-button').on('submit', handleSearchOptions);
    $('.js-overview-search').on('submit', handleOverviewSearch);
}

function updateAuthenticatedUI() {
    const authUser = CACHE.getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
        if (authUser.accessLevel &&
            authUser.accessLevel > overviewAccessLevel) {
                // show search options
                $('.js-search-options').show();
        }    
        else {
             // search employee by Id (overview)
              $('.js-overview-search').show();
        }
    }
    else {
        // log in
        renderLoginForm();
    }
}

function watchHamburguer() {
    $('.menu-toggle').click(function () {
        $('.site-nav').toggleClass('site-nav--open', 500);
        $(this).toggleClass('open');
    })
}

function main() {
    updateAuthenticatedUI();
    watchButtons();
    watchHamburguer();
}

$(main);