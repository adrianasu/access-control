let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;
const CACHE = window.CACHE_MODULE;

function handleSearch(event) {
    event.preventDefault();
    $('.js-loader').show();
    const employeeId = $('#employeeId').val();
    STATE.employeeId = employeeId;
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    window.open(`/overview/overview.html?employeeId=${STATE.employeeId}`, '_self');

    HTTP_EMPLOYEE.employeeOverviewById({
        employeeId: STATE.employeeId,
        onSuccess: RENDER.renderEmployeeOverview,
        onError: err => {
            HTTP_EMPLOYEE.handleError(err);
        }
    })
}

function watchButtons() {
    $('.js-search-form').on('submit', handleSearch);
    // ADD sign out button
}

function main() {
    watchButtons();
}
 
$(main);