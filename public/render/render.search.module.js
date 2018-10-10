const screens = {
    overview: {
        show: false,
        render: renderSearchEmployeeOverview,
        URL: '/api/employee/overview' 
    },
    search: {
        show: false,
        render: renderSearchBar,
        URL: '/api/search',
    },
    employeeForm: {
        show: false,
        render: renderEmployeeForm,
        URL: '/api/employee' // if !create add id
    },
    trainingForm: {
        show: false,
        render: renderTrainingForm,
        URL: '/api/training' // if !create add id
    },
    employerForm: {
        show: false,
        render: renderEmployerForm,
        URL: '/api/employer' // if !create add id
    },
    departmentForm: {
        show: false,
        render: renderDepartmentForm,
        URL: '/api/department' // if !create add id
    },
    list: {
        show: false,
        render: renderList,
        URL: '/api/' // add what list
    },
    employeeInfo: {
        show: false,
        render: renderSearchEmployeeById,
        URL: '/api/employee' // add employeeId
    },
    login: {
        show: true,
        render: renderLoginForm,
        URL: '/index.html'
    },
    userForm: {
        show: false,
        render: renderSignUpForm,
        URL: '/api/user' // if !create add id
    },
    logout: {
        show: false,
        render: handleLogOut,
        URL: '/api/logout'
    },
    createMenu: {
        show: false,
        render: renderCreateMenu,
        URL: '/api/menu'
    },
    searchMenu: {
        show: false,
        render: renderSearchMenu,
        URL: '/api/menu'
    }

}

function clearScreen() {
    $('.js-results').hide();
    $('.js-form').hide();
    $('.js-loader').hide();
    $('.js-message').hide();
    $('.js-nav-bar').hide();
}

function pushSiteState(currentScreen, addToUrl=null) {
    let previousScreen = Object.keys(screens).filter(screen => 
        (screens[screen].show === true));

    screens[previousScreen[0]].show = false;
    screens[currentScreen].show = true;
    let url = screens[currentScreen].URL;
    if (addToUrl) {
        url = url + `/${addToUrl}`;
    }
    console.log(url);
    history.pushState(null, currentScreen, url);
    clearScreen();
}



function renderSearchBar() {

    let navBarString = `<nav class="site-nav">
        <ul>
            <li><a href="" data-value="overview">Employee Overview</a></li>
            <li><a href="" data-value="searchMenu">Search</a></li>
            <li><a href="" data-value="createMenu">Create</a></li>
            <li><a href="" data-value="logout">Log out</a></li>
        </ul>
    </nav>
    <div class="menu-toggle">
        <div class="hamburguer"></div>
    </div>`;

    $('.js-nav-bar').html(navBarString).show();

}

function generateOptions(menu, output) {
    let optionsString = [];
    optionsString.push(`<label for="${menu}">${menu}</label>
    <select name="${menu}" class="${menu}">`);
        
    if (menu ==="search") {
        optionsString.push(`<option data-value="employeeById" selected>Employee</option>
        <option data-value="employeesList">All Employees</option>`);
    } else {
        optionsString.push(`<option data-value="employeeForm" selected>Employee</option>`);
    }
    optionsString.push(`<option data-value="trainings${output}">Trainings</option>
    <option data-value="departments${output}">Departments</option>
    <option data-value="employers${output}">Employers</option>
    <option data-value="users${output}">Users</option></select>
    <button role="button" name="menu" class="menu">${menu}</button>`);
        $('.js-form').html(optionsString.join("")).show();
}

function renderCreateMenu() {
    generateOptions("create", "Form");
    renderSearchBar();
}

function renderSearchMenu() {
    generateOptions("search", "List");
    renderSearchBar();
}


function generateSearchForm(searchFor) {
    return `<form class="js-${searchFor}Search-form">
    <legend>Search</legend>
    <label for="employeeId">Employee Id</label>
    <input type="text" name="employeeId" id="employeeId" autofocus>
    <button role="button" type="submit">Search</button>
    </form>`;
}

function displayTrainingData(missingRequirements) {
    if (missingRequirements.length > 0) {
        console.log(missingRequirements);
        $('.box').addClass('red').removeClass('green');
        $('.js-message').html(`<p>Do Not Enter</p>
        <p>Training required: ${missingRequirements.join(", ")}</p>`).show();
    } else {
        $('.box').addClass('green').removeClass('red');
    }
}

// in this case our requirements are trainings and
// its validation is included in the ready2work property
function checkForMissingRequirements(employee) {
    let missingTrainingTitles = [];
    let missing = employee.ready2work.filter(item => item.isValid === false);
    missing.forEach(training => {
        missingTrainingTitles.push(training.trainingTitle);
    })
    return missingTrainingTitles;
    
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

function generateResultsByIdStrings(employee) {
    let vehicle = (employee.allowVehicle) ? "Yes" : "No";
    let result = [];
    result.push(`<div class="box" aria-live="assertive" hidden>
    <img src="${employee.photo}" alt="${employee.firstName} ${employee.lastName}">
    </div>
    <table aria-live="assertive">
    <tr><th>${employee.firstName} ${employee.lastName}</th></tr>
    <tr><td>Employee ID</td><td>${employee.employeeId}</td></tr>
    <tr><td>Employer</td><td>${employee.employer.employerName}</td></tr>
    <tr><td>Department</td><td>${employee.department.departmentName}</td></tr>
    <tr><td>Allow Vehicle</td><td>${vehicle}</td></tr>
    <tr><td>License Plates</td><td>${employee.licensePlates}</td></tr>
    <tr><td>Trainings</td></tr>`);
    for(let x=0; x < employee.trainings.length; x++) {
        result.push(`<tr><td>${employee.trainings[x].trainingInfo.title}</td>
            <td>${employee.trainings[x].trainingDate}</td></tr>`);
    }
    result.push(`</table>
    <button type="button" role="button" class="js-goto-edit" 
    data-employeeId="${employee.employeeId}" data-origin="byId">Edit</button>
    <button type="button" role="button" class="js-delete-btn" 
    data-employeeId="${employee.employeeId}" data-origin="byId">Delete</button>`);
    return result.join("");
}

function renderSearchEmployeeOverview(employee) {
   
    if (employee) {
        pushSiteState("overview", employee.employeeId);
        $('.js-results').html(generateResultsStrings(employee)).show();
        let missing = checkForMissingRequirements(employee);
        displayTrainingData(missing);
    } 
    $('.js-form').html(generateSearchForm("overview")).show();
    let authUser = getAuthenticatedUserFromCache();
    if (authUser.accessLevel > ACCESS_OVERVIEW) {
        renderSearchBar();
    }
    else{
        $('.js-nav-bar').html(`<button role="button" class="js-logout">Log out</button>`).show();
    }
}

function renderSearchEmployeeById() {
    $('.js-form').html(generateSearchForm("byId")).show();
}

function renderEmployeeById(employee) {
    $('.js-results').html(generateResultsByIdStrings(employee)).show();
    renderSearchBar();
    renderSearchEmployeeById();
}

function renderSignUpForm(event) {
    event.preventDefault();
    pushSiteState("userForm");
    let signUpString = `<form class="js-signup-form">
    <legend>Sign up</legend>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" autofocus required>
    <label for="email">e-mail</label>
    <input type="email" name="email" id="email" required>
    <label for="username">username</label>
    <input type="text" name="username" id="username" required>
    <label for="password">password</label>
    <input type="password" name="password" id="password" required>
    <button role="button" type="submit">Create Account</button>
    </form>
    <a href="" class="js-login-link">Already have an account?</a>`;

    $('.js-form').html(signUpString).show();
}



function renderLoginForm() {
    pushSiteState("login");
    let logInString = `<form class="js-login-form">
    <legend>Log In</legend>
    <label for="username">username</label>
    <input type="text" name="username" id="username" autofocus>
    <label for="password">password</label>
    <input type="password" name="password" id="password">
    <button role="button" type="submit">Log In</button>
    </form>
    <a href="" class="js-signup-link">Create an account</a>`;

    $('.js-form').html(logInString).show();

}

function generateHeader(data) {
    let table = [];
    table.push('<tr>');
    Object.keys(data[0]).forEach(item => {
        if (item === 'trainings') {
            let columns = 2 * data[0][item].length;
            table.push(`<th colspan = "${columns}">${item}</th>`);
        } else if (item === 'departments') {
            let columns = data[0][item].length;
            table.push(`<th colspan = "${columns}">${item}</th>`);
        }
        else {
            table.push(`<th>${item}</th>`);
        }
    });
    table.push('<th></th><th></th></tr>');
    return table.join("");
}

function generateTrainingStrings(trainings) {
    let table = [];
    for (let i = 0; i < trainings.length; i++) {
        if (trainings[i].trainingDate === null) {
            trainings[i].trainingDate = "N/A";
        }
        table.push(`<td>${trainings[i].trainingInfo.title}</td><td>${trainings[i].trainingDate}</td>`);
    }
    return table.join("");
}


function generateRows(data) {
    let table = [];
    data.forEach(item => {
        table.push('<tr>');
        Object.keys(item).forEach(key => {
            
            if (key === 'photo') {
                table.push(`<td><img src="${item[key]}" alt=""></td>`)
            } else if (key === 'trainings') {
                table.push(generateTrainingStrings(item[key]));
            } else if (key === 'employer') {
                table.push(`<td>${item[key].employerName}</td>`);
            } else if (key === "department") {
                table.push(`<td>${item[key].departmentName}</td>`);
            } else if (key === "departments") {
                for (let x=0; x< item[key].length; x++) {
                    table.push(`<td>${item[key][x].departmentName}</td>`);
                }
            } else if (key === "allowVehicle") {
                 let allow = (item[key]) ? "Yes" : "No";
                 table.push(`<td>${allow}</td>`);
            } else {
                table.push(`<td>${item[key]}</td>`);
            }
        });
        table.push(`<td><button type="button" role="button" class="js-goto-edit" 
        data-employeeId="${item.employeeId}" data-origin="list">Edit</button></td>
        <td><button type="button" role="button" class="js-delete-btn" 
        data-employeeId="${item.employeeId}" data-origin="list">Delete</button></td></tr>`);
    })
    return table.join("");
}

function renderList(data) {
 
    let table = [];
    table.push(generateHeader(data));
    table.push(generateRows(data));
    table.join("");
    $('.js-results').html(table).show();
}

function renderTrainingForm(data, id) {
  
    let trainingString = `<form class="js-training-form">
            <label for="training-title">Training Title</label>
            <input type="text" name="training-title" id="training-title" autofocus required>
            <label for="expiration-time">Expiration Time (in days)</label>
            <input type="number" name="expiration-time" id="expiration-time" required>

            <button role="button" type="submit">Submit</button>
            </form>`;

    $('.js-form').html(trainingString).show();
    renderSearchBar();

}

function renderEmployerForm(data, id) {
    //pushSiteState("employerForm", id);
    let employerString = `<form class="js-employer-form">
            <label for="emp-name">Employer Name</label>
            <input type="text" name="emp-name" id="emp-name" autofocus required>
            <button role="button" type="submit">Submit</button>
            </form>`;

    $('.js-form').html(employerString).show();
    renderSearchBar();

}

function renderDepartmentForm(data, id) {
    //pushSiteState("departmentForm", id);
    let departmentString = `<form class="js-department-form">
        <label for="dep-name">Department Name</label>
        <input type="text" name="dep-name" id="dep-name" autofocus required>
        <button role="button" type="submit">Submit</button>
        </form>`;

    $('.js-form').html(departmentString).show();
    renderSearchBar();

}


