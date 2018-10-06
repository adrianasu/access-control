window.RENDER_SEARCH = {
    renderSearchBar,
    renderSearchEmployeeOverview
}

const HISTORY = window.HISTORY_MODULE;
const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;


function renderSearchBar() {
    HISTORY.changeSiteState("search");
    let navBarString = `<nav class="site-nav">
            <ul>
                <li><a href="" data-value="overview">Employee Overview</a></li>
                <li><a href="" data-value="search">Search</a></li>
                <li><a href="" data-value="create">Create</a></li>
                <li><a href="" data-value="update">Edit</a></li>
                <li><a href="" data-value="delete">Delete</a></li>
                <li><a href="" data-value="logout">Log out</a></li>
            </ul>
        </nav>
        <div class="menu-toggle">
            <div class="hamburguer"></div>
        </div>`;

    $('.js-nav-bar').html(navBarString).show();

}

function generateOverviewForm() {
    return `<button role="button" type="button" class="js-logout">Log out</button>
    <form class="js-search-form">
    <legend>Search</legend>
    <label for="employeeId">Employee Id</label>
    <input type="text" name="employeeId" id="employeeId">
    <button role="button" type="submit">Search</button>
    </form>`;
}

function displayTrainingData(missingRequirements) {
    if (missingRequirements.length > 0) {
        $('.box').addClass('red').removeClass('green');
        $('.box p:nth-child(2)').text("Do Not Enter");
        $('.box p:nth-child(3)').text(`${missingRequirements.join(", ")} training required`);
    } else {
        $('.box').addClass('green').removeClass('red');
    }
}

// in this case our requirements are trainings and
// its validation is included in the ready2work property
function checkForMissingRequirements(employee) {
    return employee.ready2work.map(requirement => !requirement.title);
}

function generateResultsStrings(employee) {
    let vehicle = (employee.allowVehicle) ? "Yes" : "No";
    return `<div class="js-results box green" aria-live="assertive" hidden>
    <img src="${employee.photo}" alt="${employee.firstName} ${employee.lastName}">
    <p></p>
    <p></p>
    </div>
    <table aria-live="assertive">
    <tr><th>${employee.firstName} ${employee.lastName}</th></tr>
    <tr><td>Allow Vehicle</td><td>${vehicle}</td></tr>
    <tr><td>License Plates</td><td>${employee.licensePlates}</td></tr>
    <tr><td>Employee ID</td><td>${employee.employeeId}</td></tr>
    <tr><td>Employer</td><td>${employee.employer.employerName}</td></tr>
    <tr><td>Department</td><td>${employee.department.departmentName}</td></tr>
    </table >`;
}


function renderSearchEmployeeOverview(employee) {

    HISTORY.changeSiteState("overview");
    renderSearchBar();
    $('.js-form').html(generateOverviewForm()).show();

    if (employee) {
        $('.js-results').html(generateResultsStrings(employee)).show();
        let missing = checkForMissingRequirements(employee);
        displayTrainingData(missing);
    }
}