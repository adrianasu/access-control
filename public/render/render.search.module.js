 const screens = {
     employees: {
         request: {
             basic: getEmployeeKioskOverview,
             overview: getEmployeeDeskOverview,
             public: getById,
             admin: getById
         },
         render: {
             basic: renderEmployeeBasicInfo,
             overview: renderEmployeeOverview,
             public: renderEmployeeById,
             admin: renderEmployeeById
         }
     },
     employee: {
         headers: {
             "Employee Id": "employeeId",
             "First Name": "firstName",
             "Last Name": "lastName",
             "Employer": "employer",
             "Department": "department",
             "License Plates": "licensePlates",
             "Employment Date": "employmentDate",
             "Allow Vehicle": "allowVehicle",
             "Trainings": "trainings"
         },
         onSuccess: renderList,
         render: renderEmployeeForm,
         fill: fillEmployeeForm,
         getDataFrom: getDataFromEmployeeForm,
     },
     training: {
         endpoint: "training",
         headers: {
             "Title": "title",
            //  "Expiration Time": "expirationTime"
         },
         onSuccess: renderList, ///maybe window
         render: renderTrainingForm,
         fill: fillTrainingForm,
         getDataFrom: getDataFromTrainingForm,
     },
     employer: {
         endpoint: "employer",
         headers: {
             "Employer Name": "employerName",
            //  "Departments": "departments"
         },
         onSuccess: renderList,
         render: renderEmployerForm,
         fill: fillEmployerForm,
         getDataFrom: getDataFromEmployerForm,
     },
     department: {
         endpoint: "department",
         headers: {
             "Department Name": "departmentName"
         },
         onSuccess: renderList,

         render: renderDepartmentForm,
         fill: fillDepartmentForm,
         getDataFrom: getDataFromDepartmentForm,
     },
     login: {
         render: renderLoginForm,
     },
     signup: {
         render: renderUserForm,
     },
     user: {
         onSuccess: renderList,
         headers: {
             "Name": "name",
             "Access Level": "accessLevel"
         },
         render: renderUserForm,
         fill: fillUserForm,
         getDataFrom: getDataFromUserForm,
     },
     logout: {

         render: handleLogOut,
     },
     home: {
         basic: renderWelcome,
         overview: renderSearchMenu,
         public: renderSearchMenu,
         admin: renderSearchMenu
     }
 }

 const ACCESS = {
     BASIC: 0, // access to kiosk overview only
     OVERVIEW: 10, // access to kiosk and desk overview, access to employee/id list
     PUBLIC: 20, // access to all lists, create employees
     ADMIN: 30 // access to create, delete, update and all lists
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
     $('.js-results, .js-intro, .js-form, .js-message, .js-footer, .js-help, .js-list-results').addClass('hide-it');

 }

 function generateOptions(menu, output) {
     let optionsString = [];
     optionsString.push(`<label for="${menu}">${menu}</label>
    <select name="${menu}" class="${menu}">`);

     if (menu === "search") {
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
     $('.js-form').html(optionsString.join("")).removeClass('hide-it');
 }

 //yes
 function renderSearchBar(fromInstructions) {
     const options = {
         instructions: ["Basic", "Overview", "Public", "Admin"],
         basic: ["Home", "LogIn", "SignUp", "Help"],
         overview: ["Home", "List Employees", "LogOut", "Help"],
         public: ["Home", "Employees", "Trainings", "Departments", "Employers", "Users", "LogOut", "Help"],
         admin: ["Home", "Employees", "Trainings", "Departments", "Employers", "Users", "LogOut", "Help"]
     }
     let userLevel;
     let navBarString = [];
     if (fromInstructions) {
         userLevel = "instructions";
       
     } else {
         // check if user is logged in and his accessLevel to give him/her access to more info
         userLevel = getUserLevel(); // returns a string
     
     }
     navBarString.push(`<ul>`);

     options[userLevel].forEach(option => {
         navBarString.push(`<li><button role="button" type="button" class="js-list">
        ${option}</button></li>`);
     })

     navBarString.push(`</ul>`);

     return $('.js-site-nav').html(navBarString.join(""));
 }


 ///yes
 function generateSearchForm() {
     return `<form class="js-search-form search-form"><label for="employeeId" title="Enter an employee ID to verify if that person
        complies with the requirements to access the work premises.">Employee Id</label>
    <input type="text" name="employeeId" id="employeeId" autofocus>
    <button role="button" type="submit">Search</button></form>`;
 }
 //yes
 function generateSearchMenu() {
     let searchString = [];
     searchString.push(generateSearchForm());
     return searchString;
 }

 function renderFooter(accessLevel) {
     if (accessLevel) {
         $('.js-footer').html(`<p>Please, talk to an <a href="" class="js-user-list"> admin </a> 
        if you'd like to increase your permissions.</p>`).removeClass('hide-it');
     } else {
         $('.js-footer').html(`<p>Please, <a href="" class="js-signup-link">sign up </a> to enable more options.</p>`).removeClass('hide-it');
     }
 }

 //yes
 function renderSearchMenu() {
     updateAuthenticatedUI();
     let accessLevel = STATE.authUser.accessLevel;
     $('.js-form').html(generateSearchMenu(accessLevel)).removeClass('hide-it');
     $('.js-search-form').removeClass('welcome-form');
     renderFooter(accessLevel);
     renderSearchBar();
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

 function generateMissingRequirementsString(employee) {
     let missingRequirements = checkForMissingRequirements(employee);
     if (missingRequirements.length > 0) {
      
         let message = [];
         message.push(`<h2 class="warn">Do Not Enter  <i class="fas fa-hand-paper"></i></h2><p>Training required:</p><ul>`);
         missingRequirements.forEach(requirement => {
             message.push(`<li>${requirement}</li>`);
         })
         message.push(`</ul>`);
         return message.join("");
     } else {
       
         message.push(`<h2 class="enter">Please Enter  <i class="fas fa-check-circle"></i></h2>`);
         return message.join("");
     }
 }


 function generateResultsStrings(employee, userLevel, origin) {
     let resultString = [];
     resultString.push(`<button role="button" type="button" class="clear js-clear"
    aria-label="Close" aria-pressed="false" data-origin="${origin}" autofocus><i class="far fa-times-circle">
    </i></button>
    <h1>${employee.firstName} ${employee.lastName}</h1>
    <p>Employee ID: ${employee.employeeId}</p><table aria-live="assertive">`);
     if (userLevel === "overview") {
         let vehicle = (employee.allowVehicle) ? "Yes" : "No";
         resultString.push(`<tr><td>Employer: </td><td>${employee.employer.employerName}</td></tr>
        <tr><td>Department: </td><td>${employee.department.departmentName}</td></tr>
        <tr><td>Allow Vehicle: </td><td>${vehicle}</td></tr>
        <tr><td>License Plates: </td><td>${employee.licensePlates}</td></tr>`);
     }
     resultString.push(`</table>`);
     resultString.push(generateMissingRequirementsString(employee));

     return resultString.join("");
 }
 //yes
 function generateResultsByIdStrings(employee, origin) {
     let vehicle = (employee.allowVehicle) ? "Yes" : "No";
     let result = [];
     result.push(`<button role="button" type="button" class="clear js-clear"
    aria-label="Close" aria-pressed="false" data-origin="${origin}" autofocus><i class="far fa-times-circle">
    </i></button>
    <div class="box" aria-live="assertive" hidden></div>
    <table aria-live="assertive">
    <tr><td>${employee.firstName}</td><td>${employee.lastName}</td></tr>
    <tr><td>Employee ID: </td><td>${employee.employeeId}</td></tr>
    <tr><td>Employer: </td><td>${employee.employer.employerName}</td></tr>
    <tr><td>Department: </td><td>${employee.department.departmentName}</td></tr>
    <tr><td>Allow Vehicle: </td><td>${vehicle}</td></tr>
    <tr><td>License Plates: </td><td>${employee.licensePlates}</td></tr>
    <tr colspan="2"><td>Trainings: </td></tr>`);
     for (let x = 0; x < employee.trainings.length; x++) {
         let trainDate = new Date(employee.trainings[x].trainingDate).toLocaleDateString("en-US")
         result.push(`<tr><td>${employee.trainings[x].trainingInfo.title}</td>
            <td>${trainDate}</td></tr>`);
     }
     result.push(`</table>
    <button type="button" role="button" class="js-goto-edit goto-edit" 
    data-id="${employee.employeeId}" data-name="employee" data-origin="thumbnail">Edit</button>
    <button type="button" role="button" class="js-delete-btn delete-btn" 
    data-id="${employee.employeeId}" data-name="employee" data-origin="thumbnail"><i class="fas fa-trash-alt"></i></button>`);
     return result.join("");
 }

 function convertNullToString(data) {
     Object.keys(data).forEach(key => {
         if (data[key] === null) {
             data[key] = "NA";
         }
     })
     return data;
 }
 // for basic level
 function renderEmployeeBasicInfo(employee, userLevel, origin) {
     clearScreen();
     // render search form at the top to keep searching
     $('.js-form').html(generateSearchForm()).removeClass('hide-it');
     $('.js-search-form').removeClass('welcome-form');
     // render results
     if (employee) {
         let employeeC = convertNullToString(employee);
         $('.js-results').html(generateResultsStrings(employeeC, userLevel, origin))
             .addClass('results').removeClass('list').removeClass('hide-it');

     }
     renderSearchBar();
     return employee;
 }

// for overview level
function renderEmployeeOverview(employee, userLevel, origin) {
    if (employee) {
        let employeeC = convertNullToString(employee);
        $('.js-results').html(generateResultsStrings(employeeC, userLevel, origin)).addClass('results onTop').removeClass('list').removeClass('hide-it');
        $('.js-list-results').addClass('hide-it');
    }
    return employee;
}


 // for public and admin level
 function renderEmployeeById(employee, userLevel, origin) {
     let employeeC = convertNullToString(employee);
     $('.js-results').html(generateResultsByIdStrings(employeeC, origin))
         .addClass('results onTop').removeClass('list').removeClass('hide-it');
    $('.js-list-results').addClass('hide-it');
     return employee;
 }

 function calculateMaxNumber(arr, key) {
     let max = 0;
     if (arr && arr.length > 0) {
         arr.forEach(item => {
             if (item[key].length > max) {
                 max = item[key].length;
             }
         })
     }
     return max;
 }

 function generateHeader(dataName, options) {
     let userLevel = getUserLevel();

     let table = [];
     table.push(`<tr>`);
     Object.keys(screens[dataName].headers).forEach(item => {

         if (item === "Trainings") {
             let columns = 2 * options.trainings.length;
             table.push(`<th colspan = "${columns}">${item}</th>`);
         } else if (item === "Departments") {
             // let columns = calculateMaxNumber(options.employers, "departments");
             // table.push(`<th colspan = "${columns}">${item}</th>`);
         } else if (item === "Access Level") {
             table.push(`<th class="tooltip">${item}<i class="fas fa-question-circle">
            <span class="tooltiptext"><p>OVERVIEW: read employees' overview.</p>
            <p>PUBLIC: read complete info, create employees, edit.</p>
            <p>ADMIN: read, create, edit and delete.</p>
            </span></i></th>`);
         } else {
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

 function generateRows(data, dataName) {
     let table = [];
     let maxNumOfDepInOneEmployer;
     // if (dataName === "employer") {
     //     maxNumOfDepInOneEmployer = calculateMaxNumber(data, "departments");
     // }    
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
                //  let eDate = new Date(item[key]).getTime() / (1000 * 60 * 60 * 24);
                //  table.push(`<td>${eDate}</td>`);
             } else if (key === "department") {
                 table.push(`<td>${item[key].departmentName}</td>`);
             } else if (key === "departments") {
                 // for (let x = 0; x < maxNumOfDepInOneEmployer; x++) {
                 //     if (item[key][x]) {
                 //         table.push(`<td>${item[key][x].departmentName}</td>`);
                 //     }
                 //     else {
                 //         table.push(`<td></td>`);
                 //     }
                 // }
             } else if (key === "allowVehicle") {
                 let allow = (item[key]) ? "Yes" : "No";
                 table.push(`<td>${allow}</td>`);
             } else if (key === "accessLevel") {
                 let levelString;
                 Object.keys(ACCESS).forEach(level => {
                     if (ACCESS[level] === item[key]) {
                         levelString = level;
                     }

                 })

                 table.push(`<td>${levelString}</td>`);

             } else if (key === "id" || key === "levels" || key === "email") {} else {
                 table.push(`<td>${item[key]}</td>`);
             }
         });
         let id;
         if (dataName === "employee") {
             id = item[`${dataName}Id`];
         } else {
             id = item.id;
         }

         table.push(`<td><button type="button" role="button" class="js-goto-edit goto-edit" 
        data-name="${dataName}" data-id="${id}" data-origin="list">Edit</button></td>
        <td><button type="button" role="button" class="js-delete-btn delete-btn" 
        data-name="${dataName}" data-id="${id}" data-origin="list"><i class="fas fa-trash-alt"></i></button></td></tr>`);
     })
   
     return table.join("");
 }

 function getOptions() {
     let options = getOptionsFromCache();

     if (options !== undefined) {
         return options;
     } else {
         return requestAndSaveOptions()
             .then(options => {
                 return options;
             })
             .catch(err => {
                 console.log(err);
                 $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
             })
     }
 }


 // thumbnails that include employeeId, full name and missing trainings
 function generateEmployeeThumbnails(employees) {
     let thumbnails = [];
     thumbnails.push(`<div class="grid-container">`)
     employees.forEach(employee => {
         let missingRequirements = checkForMissingRequirements(employee);
         if (missingRequirements.length > 0) {
             thumbnails.push(`<div class="grid-item red js-thumbnail" 
            data-value="${employee.employeeId}"><table>
            <tr><td>ID: ${employee.employeeId}</td></tr>
            <tr><td>${employee.firstName} ${employee.lastName}</td></tr>
            <tr><td>Missing training: <i class="fas fa-hand-paper warn"></i><ul>`);
             missingRequirements.forEach(requirement => {
                 thumbnails.push(`<li>${requirement}</li>`);
             })
             thumbnails.push(`</ul></td></tr></table></div>`);
         } else {
             thumbnails.push(`<div class="grid-item js-thumbnail" 
            data-value="${employee.employeeId}"><table><tr><td>ID: ${employee.employeeId}</td></tr>
            <tr><td>${employee.firstName} ${employee.lastName} </td><td class="enter"><i class="fas fa-check-circle"></i></td></tr></table></div>`);
         }
     })
     return thumbnails.join("");
 }


 // yes
 function renderList(data, dataName) {
     renderSearchBar();
     let options;
     if (dataName !== "employee" || dataName !== "user") {
         options = getOptions();
     }
     updateAuthenticatedUI();
     const accessLevel = STATE.authUser.accessLevel;

     if (dataName !== "employee") {
         $('.js-list-results').removeClass('no-border');;
    } else {
            $('.js-list-results').addClass('no-border');
     }

     if (data.length === 0 && accessLevel >= ACCESS.PUBLIC) {
         $('.js-list-results').html(`<h1>${dataName}s</h1><button role="button" 
        type="button" class="js-goto-create goto-create" data-value="${dataName}">New <i class="fas fa-plus"></i></button>
        <p>No ${dataName}s found.</p>`).removeClass('hide-it');

         renderSearchMenu();
         return data;
     } else if (data.length === 0 && accessLevel < ACCESS.PUBLIC) {
         $('.js-list-results').html(`<h1>${dataName}s</h1><p>No ${dataName}s found.</p>`).removeClass('hide-it');

         renderSearchMenu();
         return data;
     }
     let listString = [];
     if (dataName === "user" || accessLevel < ACCESS.PUBLIC) {
         listString.push(`<h1>${dataName}s</h1>`);
     } else {
         listString.push(`<h1>${dataName}s</h1><button role="button" 
        type="button" class="js-goto-create goto-create" data-value="${dataName}">
        New <i class="fas fa-plus"></i></button>`);
     }
     if (dataName === "employee") {
         listString.push(generateEmployeeThumbnails(data));
     } else {
         listString.push(generateHeader(dataName, options));
         listString.push(generateRows(data, dataName));
     }

     listString.join("");
     $('.js-list-results').html(listString).removeClass('hide-it');
     return data;
 }


 //modal window
 function doConfirm(dataName, action, data) {
     let windowString = [];
     let stringOne = "";

     if (data && action === "delete") {
         windowString.push(`<div class="info"><p>Confirm delete.</p>
        <button type="button" role="button" data-name="${data.name}"
        data-id="${data.id}" data-origin="thumbnail" 
        class="js-confirm-btn"><i class="fas fa-trash-alt"></i>
        </button><button type="button" role="button" class="js-close">
        Cancel</button></div>`);
         $('.js-info-window').html(windowString.join(""));
         return dataName;

     } else if (action === "deleted") {
         stringOne = "";
     } else if (action === "unchanged") {
         stringOne = "";
     } else if (dataName === "employee") {
         stringOne = `${data.firstName} ${data.lastName}`;
     } else if (dataName === "department") {
         stringOne = data.departmentName;
     } else if (dataName === "training") {
         stringOne = data.title;
     } else if (dataName === "employer") {
         stringOne = data.employerName;
     }
     windowString.push(`<div class="info">`);
     windowString.push(`<button role="button" type="button" class="close js-close"
            aria-label="Close" aria-pressed="false"><i class="far fa-times-circle"></i></button>`);
     if (dataName === "error") {
         windowString.push(`<p>${data}.</p>`);
     } else {
         windowString.push(`<p>${dataName} ${stringOne} was ${action}.</p>`);
     }
     windowString.push(`</div>`);

     $('.js-info-window').html(windowString.join(""));
     return dataName;
 }