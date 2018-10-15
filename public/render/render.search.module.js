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
    employee: {
        endpoint: "employee",
        headers: {"Employee Id": "employeeId", "First Name": "firstName", "Last Name": "lastName", "Employer": "employer", "Department": "department", "License Plates": "licensePlates", "Employment Date": "employmentDate","Allow Vehicle": "allowVehicle", "Trainings": "trainings"},
        onSuccess: renderList, ///maybe window
        requestFunction: createOne,
        show: false,
        render: renderEmployeeForm,
        fill: fillEmployeeForm,
        getDataFrom: getDataFromEmployeeForm,
        URL: '/api/employee', // if !create add id
    },
    training: {
        endpoint: "training",
        headers: {"Title": "title", "Expiration Time": "expirationTime"},
        onSuccess: renderList, ///maybe window
        requestFunction: createOne,
        show: false,
        render: renderTrainingForm,
        fill: fillTrainingForm,
        getDataFrom: getDataFromTrainingForm,
        URL: '/api/training' // if !create add id
    },
    employer: {
        show: false,
        endpoint: "employer",
        headers: {"Employer Name": "employerName", "Departments": "departments"},
        onSuccess: renderList, 
        requestFunction: createOne,
        render: renderEmployerForm,
        fill: fillEmployerForm,
        getDataFrom: getDataFromEmployerForm,
        URL: '/api/employer' // if !create add id
    },
    department: {
        endpoint: "department",
        headers: {"Department Name": "departmentName"},
        onSuccess: renderList, 
        requestFunction: createOne,
        show: false,
        render: renderDepartmentForm,
        fill: fillDepartmentForm,
        getDataFrom: getDataFromDepartmentForm,
        URL: '/api/department' // if !create add id
    },
    list: {
        onSuccess: renderList,
        requestFunction: getAll,
        show: false,
        render: renderList,
        URL: '/api' // add what list
    },
    employeeById: {   
        endpoint: "employee", // add employeeId
        onSuccess: renderSearchEmployeeById,
        requestFunction: getById,
        show: false,
        render: renderSearchEmployeeById,
        URL: '/api/employee' // add employeeId
    },
    deleteAtById: { 
        onSuccess: renderSearchEmployeeById,
        requestFunction: deleteOne,
        show: false,
        render: renderSearchEmployeeById,
        URL: '/api' // add option + id
    },
    deleteAtList: { 
        onSuccess: getAll,
        requestFunction: deleteOne,
        show: false,
        render: renderList,
        URL: '/api' // add what list
    },
    login: {
        show: true,
        render: renderLoginForm,
        URL: '/index.html'
    },
    user: {
        show: false,
        headers: {"Name": "name", "username": "username", "email": "email", "Access Level": "accessLevel"},
        render: renderSignUpForm,
        fill: fillUserForm,
        getDataFrom: getDataFromUserForm,
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
    //history.pushState(data, event.target.textContent, url);
    clearScreen();
}

function renderSearchBar() {

    let navBarString = `<nav class="site-nav">
        <ul><li><a href="" data-value="overview">Employee Overview</a></li>
            <li><a href="" data-value="searchMenu">Search</a></li>
            <li><a href="" data-value="createMenu">Create</a></li>
            <li><a href="" data-value="logout">Log out</a></li>
        </ul></nav><div class="menu-toggle">
        <div class="hamburguer"></div></div>`;

    $('.js-nav-bar').html(navBarString).show();
}

function generateOptions(menu, output) {
    let optionsString = [];
    optionsString.push(`<label for="${menu}">${menu}</label>
    <select name="${menu}" class="${menu}">`);
        
    if (menu ==="search") {
        optionsString.push(`<option data-value="employeeById" selected>Employee</option>
        <option data-value="employee">All Employees</option>
        <option data-value="user">Users</option>`);
    } else {
        optionsString.push(`<option data-value="employee" selected>Employee</option>`);
    }
    optionsString.push(`<option data-value="training">Trainings</option>
    <option data-value="department">Departments</option>
    <option data-value="employer">Employers</option></select>
    <button role="button" type="button" name="menu" class="${menu}-menu">${menu}</button>`);
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
    <legend>Search</legend><label for="employeeId">Employee Id</label>
    <input type="text" name="employeeId" id="employeeId" autofocus>
    <button role="button" type="submit">Search</button>
    </form>`;
}

function displayTrainingData(missingRequirements) {
    if (missingRequirements.length > 0) {
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
    data-id="${employee.employeeId}" data-name="employee" data-origin="byId">Edit</button>
    <button type="button" role="button" class="js-delete-btn" 
    data-id="${employee.employeeId}" data-name="employee" data-origin="byId">Delete</button>`);
    return result.join("");
}

function convertNullToString (data) {
    Object.keys(data).forEach(key => {
        if(data[key] === null) {
            data[key] = "NA";
        }
    })
    return data;
}

function renderSearchEmployeeOverview(employee) {
    if (employee) {
        let employeeC = convertNullToString(employee);
        pushSiteState("overview", employee.employeeId);
        $('.js-results').html(generateResultsStrings(employeeC)).show();
        let missing = checkForMissingRequirements(employeeC);
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
    return employee;
}

function renderSearchEmployeeById() {
    clearScreen();
    renderSearchBar();
    $('.js-form').html(generateSearchForm("byId")).show();
}

function renderEmployeeById(employee) {
    let employeeC = convertNullToString(employee); 
    renderSearchEmployeeById();
    $('.js-results').html(generateResultsByIdStrings(employeeC)).show();
    return employee;
}

function calculateMaxNumber(arr) {
    let max = 0;
    if (arr && arr.length > 0) {
        arr.forEach(item => {
            if (item.departments.length > max) {
                max = item.departments.length;
            }
        })
    }
    return max;
}

function generateHeader(data, dataName, options) {
    let table = [];
    table.push(`<tr>`);
    Object.keys(screens[dataName].headers).forEach(item => {
        if (item === 'Trainings') {
            let columns = 2 * options.trainings.length;
            table.push(`<th colspan = "${columns}">${item}</th>`);
        } else if (item === 'Departments') {
            let columns = calculateMaxNumber(options.employers);
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
        let expTime = new Date(trainings[i].trainingDate).toLocaleDateString("en-US");
        table.push(`<td>${trainings[i].trainingInfo.title}</td><td>${expTime}</td>`);
    }
    return table.join("");
}

function generateRows(data, dataName, options) {
    let table = [];
    data.forEach(item => {
        table.push('<tr>');
        Object.keys(item).forEach(key => {
            if (item[key] === null || item[key === ""]) {
                table.push(`<td>NA</td>`);
            } else if (key === 'photo') {
                table.push(`<td><img src="${item[key]}" alt=""></td>`)
            } else if (key === 'trainings') {
                table.push(generateTrainingStrings(item[key]));
            } else if (key === 'employer') {
                table.push(`<td>${item[key].employerName}</td>`);
            } else if (key === 'employmentDate') {
                let eDate = new Date(item[key]).toLocaleDateString("en-US");
                table.push(`<td>${eDate}</td>`);
            } else if (key === "expirationTime") {
                let eDate = new Date(item[key]).getTime() / (1000 * 60 * 60 * 24);
                table.push(`<td>${eDate}</td>`);
            } else if (key === "department") {
                table.push(`<td>${item[key].departmentName}</td>`);
            } else if (key === "departments") {
                for (let x = 0; x < item[key].length; x++) {
                    table.push(`<td>${item[key][x].departmentName}</td>`);
                }
            } else if (key === "allowVehicle") {
                let allow = (item[key]) ? "Yes" : "No";
                table.push(`<td>${allow}</td>`);
            } else if (key === "id" || key === "levels") {}
            else {
                table.push(`<td>${item[key]}</td>`);
            }
        });
        let id;
        if (dataName === "employee") {
            id = item[`${dataName}Id`];
        } else {
            id = item.id;
        }

        table.push(`<td><button type="button" role="button" class="js-goto-edit" 
        data-name="${dataName}" data-id="${id}" data-origin="list">Edit</button></td>
        <td><button type="button" role="button" class="js-delete-btn" 
        data-name="${dataName}" data-id="${id}" data-origin="list">Delete</button></td></tr>`);
    })
    return table.join("");
}

function getOptions() {
    let options = getOptionsFromCache();
    if (options !== undefined) {
        return options;
    } else {
        return optionsDataHttpRequest()
            .then(options => {
                return options;
            })
            .catch(err => {
                console.log(err);
                $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })
    }
}


function renderList(data, dataName) {
    renderSearchBar();
    let options = getOptions();
  
    if (data.length === 0) {
        $('.js-results').html(`<h1>${dataName}s</h1><p>No ${dataName}s found.</p>`).show();
        renderSearchMenu();
        return data;
    }
    let table = [];
    table.push(`<h1>${dataName}s</h1>`);
    table.push(generateHeader(data, dataName, options));
    table.push(generateRows(data, dataName, options));
    table.join("");
    $('.js-results').html(table).show();
    renderSearchMenu();
    return data;
    }
//modal window
function doConfirm(dataName, action) {
    let windowString =[];
    windowString.push(`<div class="info">`);
    if (action !== "delete") {
        windowString.push(`<button role="button" type="button" class="close js-close"
            aria-label="Close" aria-pressed="false">X</button>`);
    }
    windowString.push(`<p>${dataName} was ${action}.</p>`);
    if (action === "delete") {
        windowString.push(`<button role="button" type="button"
        class="close js-window-cancel" aria-label="Cancel" aria-pressed="false">Cancel</button>
        <button role="button" type="button" class="close js-window-delete" aria-label="Delete" aria-pressed="false">
        Delete</button>`);
    }
    windowString.push(`</div>`);

    $('.js-info-window').html(windowString.join("")).show();
   return dataName;
}



