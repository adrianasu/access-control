let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;
const HTTP_USER = window.HTTP_USER_MODULE;
const CACHE = window.CACHE_MODULE;

const overviewAccessLevel = 10;

function generateHeader(data) {
    let table = [];
    table.push('<tr>');
    Object.keys(data.employeeData[0]).forEach(item => {
        if (item === 'training') {
            let columns = 2 * data.employeeData[0][item].length;
            table.push(`<th colspan = "${columns}">${item}</th>`);
        }
        else {
            table.push(`<th>${item}</th>`);
        }
    });
    table.push('</tr>');
    return table.join("");
}

function generateTrainingStrings(training) {
    let table = [];
    for (let i = 0; i < training.length; i++) {
        if (training[i].trainDate === null) {
            training[i].trainDate = "N/A";
        }
        table.push(`<td>${training[i].title}</td><td>${training[i].trainDate}</td>`);
    }
    return table.join("");
}

function generateRows(data) {
    let table = [];
    data.employeeData.forEach(employee => {
        table.push('<tr>');
        Object.keys(employee).forEach(key => {
            if (key === 'photo') {
                table.push(`<td><img src="${employee[key]}" alt=""></td>`)
            }
            else if (key === 'training') {
                table.push(generateTrainingStrings(employee[key]));
            }
            else {
                table.push(`<td>${employee[key]}</td>`);
        }
        });
        table.push('</tr>');
    })
    return table.join("");
}

function displayData(data) {
    let table = [];
    table.push(generateHeader(data));
    table.push(generateRows(data));
    table.join("");
    $('.js-results').html(table).show();
}

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
        window.open('auth/login', '_self');
    }
}

function main() {
    updateAuthenticatedUI();
    watchButtons();
}

$(main);