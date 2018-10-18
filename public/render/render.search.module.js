 const screens = {
    employees: {
        request: {
            basic: getEmployeeKioskOverview,
            overview: getEmployeeDeskOverview,
            public: getById,
            admin:  getById
        },
        render:{
            basic: renderEmployeeOverview,
            overview: renderEmployeeOverview,
            public: renderEmployeeById,
            admin: renderEmployeeById
        }
    },
    employee: {
     
        headers: {"Employee Id": "employeeId", "First Name": "firstName", "Last Name": "lastName", "Employer": "employer", "Department": "department", "License Plates": "licensePlates", "Employment Date": "employmentDate","Allow Vehicle": "allowVehicle", "Trainings": "trainings"},
        onSuccess: renderList,
        requestFunction: createOne,
    
        render: renderEmployeeForm,
        fill: fillEmployeeForm,
        getDataFrom: getDataFromEmployeeForm,
        
    },
    training: {
        endpoint: "training",
        headers: {"Title": "title", "Expiration Time": "expirationTime"},
        onSuccess: renderList, ///maybe window
        requestFunction: createOne,
       
        render: renderTrainingForm,
        fill: fillTrainingForm,
        getDataFrom: getDataFromTrainingForm,
     
    },
    employer: {
      
        endpoint: "employer",
        headers: {"Employer Name": "employerName", "Departments": "departments"},
        onSuccess: renderList, 
        requestFunction: createOne,
        render: renderEmployerForm,
        fill: fillEmployerForm,
        getDataFrom: getDataFromEmployerForm,
      
    },
    department: {
        endpoint: "department",
        headers: {"Department Name": "departmentName"},
        onSuccess: renderList, 
        requestFunction: createOne,
        render: renderDepartmentForm,
        fill: fillDepartmentForm,
        getDataFrom: getDataFromDepartmentForm,
    },
    "employee/desk" : {
        onSuccess: renderList,
    },
   
    // employeeById: {   
    //     endpoint: "employee", // add employeeId
    //     requestFunction: getById,
       
    // },
    deleteAtById: { 
        requestFunction: deleteOne,
      
    },
    deleteAtList: { 
        onSuccess: getAll,
        requestFunction: deleteOne,
        render: renderList,
    },
    login: {
        show: true,
        render: renderLoginForm,
        URL: '/index.html'
    },
    signup: {
        show: true,
        render: renderUserForm,
        URL: '/index.html'
    },
    user: {
        onSuccess: renderList,
        headers: {"Name": "name", "Access Level": "accessLevel"},
        render: renderUserForm,
        fill: fillUserForm,
        getDataFrom: getDataFromUserForm,
       
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
    },
    home:{
        basic: renderWelcome,
        overview: renderSearchMenu,
        public: renderSearchMenu,
        admin: renderSearchMenu
    }
    

}

const ACCESS = {
    BASIC: 0,  // access to kiosk overview only
    OVERVIEW: 10, // access to kiosk and desk overview, access to employee/id list
    PUBLIC: 20, // access to all lists, create employees
    ADMIN: 30  // access to create, delete, update and all lists
};

function getUserLevel() {
    updateAuthenticatedUI();
    let authUser = STATE.authUser;

   if (authUser && authUser.accessLevel === ACCESS.OVERVIEW) {
        return "overview";
    } else if (authUser && authUser.accessLevel === ACCESS.PUBLIC) {
        return "public";
    } else if (authUser && authUser.accessLevel >= ACCESS.ADMIN) {
        return "admin";
    } else {
        return "basic";
    }
}

function clearScreen() {
    $('.js-results, .js-intro, .js-form, .js-loader, .js-message, .js-nav-bar').hide();

}


// function renderSearchBar() {
//     let accessLevel = ACCESS.BASIC;
//     // check if user is logged in to give him/her access to more info
//     updateAuthenticatedUI();
//     let authUser = STATE.authUser;
//     if (authUser) {
//         accessLevel = authUser.accessLevel;
//     }
//     let navBarString = [];
  
//     if (accessLevel === ACCESS.BASIC) {
//         navBarString.push(`<nav class="site-nav"><ul>
//             <li><a href="" data-value="home">Home</a></li><li>
//             <a href="" data-value="signup">Sign Up</a></li>
//             <li><a href="" data-value="login">Log In</a></li></ul></nav>
//             <div class="menu-toggle"><div class="hamburguer"></div></div>`);
//     } else if (accessLevel >= ACCESS.PUBLIC) {
//         navBarString.push(`<nav class="site-nav"><ul>
//             <li><a href="" data-value="home">Home</a></li>
//             <li><a href="" data-value="employee">Employees</a></li>
//             <li><a href="" data-value="training">Trainings</a></li>
//             <li><a href="" data-value="department">Departments</a></li>
//             <li><a href="" data-value="employer">Employers</a></li>
//             <li><a href="" data-value="user">Users</a></li>`);
//     }
//     if (accessLevel >= ACCESS.OVERVIEW) {
//         navBarString.push(`<li><a href="" data-value="back">Back</a></li>
//             <li><a href="" data-value="logout">Log out</a></li></ul></nav><div class="menu-toggle">
//         <div class="hamburguer"></div></div>`);
//     }

//     $('.js-nav-bar').html(navBarString).show();
// }

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
//yes
function renderSearchBar() {
    const options = {
        basic: ["Home", "LogIn", "SignUp"],
        overview: ["Home", "List Employees", "LogOut"],
        public: ["Home", "Employees", "Trainings", "Departments", "Employers", "Users", "LogOut"],
        admin: ["Home", "Employees", "Trainings", "Departments", "Employers", "Users", "LogOut"]
    }
    
    // check if user is logged in and his accessLevel to give him/her access to more info
    let userLevel = getUserLevel(); // returns a string
    let navBarString = [];
    navBarString.push(`<nav class="site-nav"><ul>`);
    
    options[userLevel].forEach(option => {
        navBarString.push(`<li><button role="button" type="button" class="js-list">
        ${option}</button></li>`);
    })

    navBarString.push(`</ul></nav><div class="menu-toggle">
    <div class="hamburguer"></div></div>`);
    
    $('.js-nav-bar').html(navBarString).show();
}


///yes
function generateSearchForm() {
    return `<form class="js-search-form"><label for="employeeId">Employee Id</label>
    <input type="text" name="employeeId" id="employeeId" autofocus>
    <button role="button" type="submit">Search</button></form>`;
}
//yes
function generateSearchMenu() { 
    let searchString = []; 

    searchString.push(generateSearchForm());
    // searchString.push(`<p>For a list of all employees click here:</p><button role="button" type="button" class="js-list">
    // List Employees</button>`);
        
    return  searchString;
}
//yes
function renderSearchMenu() {
     let status = {origin: "searchMenu", data: null , render: renderSearchMenu};
     saveSiteStatus(status);
     updateAuthenticatedUI();
     let accessLevel = STATE.authUser.accessLevel;
     $('.js-intro').html(`<p>Enter an employee ID to verify if that person
        complies with the requirements to enter the work premises.</p><p>To get a 
        list of all employees click on the "List Employees" button above.</p>`).show();
    $('.js-form').html(generateSearchMenu(accessLevel)).show();
    renderSearchBar();
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

function generateResultsStrings(employee, userLevel) {
    let resultString = [];
    resultString.push(`<div class="js-results box green" aria-live="assertive" hidden>
    <p></p>
    <p></p>
    </div>
    <table aria-live="assertive">
    <tr><td>Employee ID</td><td>${employee.employeeId}</td></tr>
    <tr><th>${employee.firstName} ${employee.lastName}</th></tr></table>`);
    if (userLevel === "overview") {
        let vehicle = (employee.allowVehicle) ? "Yes" : "No";
        resultString.push(`<tr><td>Employer</td><td>${employee.employer.employerName}</td></tr>
        <tr><td>Department</td><td>${employee.department.departmentName}</td></tr>
        <tr><td>Allow Vehicle</td><td>${vehicle}</td></tr>
        <tr><td>License Plates</td><td>${employee.licensePlates}</td></tr></table>`);
     }
 
    return resultString;
}

function generateResultsByIdStrings(employee) {
    let vehicle = (employee.allowVehicle) ? "Yes" : "No";
    let result = [];
    result.push(`<div class="box" aria-live="assertive" hidden>
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
    data-id="${employee.employeeId}" data-name="employee" data-origin="byId"><i class="fas fa-trash-alt"></i></button>`);
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
///yes
function renderEmployeeOverview(employee, userLevel) {
    updateSiteStatus();
    
    clearScreen();
    // render the search form at the top to keep searching
    $('.js-form').html(generateSearchForm()).show();
    
    
    // render results
    if (employee) {
        let employeeC = convertNullToString(employee);
        $('.js-results').html(generateResultsStrings(employeeC, userLevel)).show();
        let missing = checkForMissingRequirements(employeeC);
        displayTrainingData(missing);  
    } 
    let status = {origin: "home", data: employee, render: renderWelcome};
    saveSiteStatus(status);
    renderSearchBar();
    return employee;
}

// function renderSearchEmployeeById() {
//     clearScreen();
//     renderSearchBar();
//     $('.js-form').html(generateSearchForm()).show();
// }

function renderEmployeeById(employee) {
    let employeeC = convertNullToString(employee); 
    clearScreen();
    renderSearchBar();
    $('.js-form').html(generateSearchForm()).show();
    ///renderSearchEmployeeById();
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
    let userLevel = getUserLevel();
  
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
        data-name="${dataName}" data-id="${id}" data-origin="list"><i class="fas fa-trash-alt"></i></button></td></tr>`);
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

// yes
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
    return data;
    }










//modal window
function doConfirm(dataName, action, data) {
    let windowString =[];
    let stringOne = "";
    
    if (dataName === "employee" && action !== "delete") {
        stringOne = `${data.firstName} ${data.lastName}`;
    } else if (dataName === "department" && action !== "delete") {
        stringOne = data.departmentName;
    } else if (dataName === "training" && action !== "delete") {
        stringOne = data.title;
    } else if (dataName === "employer" && action !== "delete") {
        stringOne = data.employerName;
    } else if (dataName === "user" && action !== "delete") {
        stringOne = data.name;
    }

    windowString.push(`<div class="info">`);
   
    windowString.push(`<button role="button" type="button" class="close js-close"
            aria-label="Close" aria-pressed="false">X</button>`);
   
    windowString.push(`<p>${dataName} ${stringOne} was ${action}.</p>`);
  
    windowString.push(`</div>`);

    $('.js-info-window').html(windowString.join(""));
   return dataName;
}



