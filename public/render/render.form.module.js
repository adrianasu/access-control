function requestAndSaveOptions() {
    let jwToken = STATE.authUser.jwToken;
    return getAllOptions({ jwToken })
        .then(data => {
            saveOptionsIntoCache(data);
            return data;
        })   
}

function renderWelcome(user) {
    console.log("WELCOME ", user);
    clearScreen();
    let message;
    if(user) {
        message =`<h1>Welcome ${user.name}!</h1>`;
    } else  {
         message =`<h1>Welcome!</h1>`;
    }
    $('.js-intro').html(message).removeClass('hide-it').addClass('form');
    $('.js-form').removeClass('form');
    return renderHome(user, "fromWelcome");
}

function renderHome(user, fromWelcome) {
    if (!fromWelcome) {
        $('.js-form').addClass('form');
    }
    let ids = getEmployeeIdsFromCache();
    $('.js-search-form').addClass('welcome-form');
    renderNavBar();
    renderFooter(user);
   
    if (ids !== undefined) {
       return  $('.js-form').html(generateSearchForm(ids)).removeClass('hide-it');
    }
    else {
        return getEmployeeIds()
            .then(ids => {
                return $('.js-form').html(generateSearchForm(ids)).removeClass('hide-it').addClass('form');
            })
    }
}

function generateLevelOptions(data) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    Object.keys(data).forEach(level => {
        options.push(`<option value="${level}">${level}</option>`);
    });
    return options;
}

function generateUserFormString(data, id, origin) {
    let formString =[];
    let title;
    let btnName = 'signup';
    if (id) {
        btnName = 'update';
        title = 'Update'; 
    } else {
        id = 'list';
        title = 'Sign Up';
    }
    formString.push(`<form class="js-signup-form ${btnName}-form">
    <legend>${title}</legend>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" autofocus required>`);
    // show user's own email only
    let user = getAuthenticatedUserFromCache();
    if (user && id === user.userid) {
        formString.push(`<label for="email">e-mail</label>
        <input type="email" name="email" id="email" required>`);
    }
    if (title === "Sign Up") {
        formString.push(`<label for="email">e-mail</label>
            <input type="email" name="email" id="email" required>
            <label for="username">username <i class="fas fa-question-circle tooltip">
            <span class="tooltiptext">Four or more characters</span></i></label>
            <input type="text" name="username" id="username" pattern=".{4,}" title="Four or more characters" required>
            <label for="password">password <i class="fas fa-question-circle tooltip">
            <span class="tooltiptext">Seven or more characters</span></i></label>
            <input type="password" name="password" id="password" pattern=".{7,}" title="Seven or more characters" required>`);
    }
    else {
        formString.push(`<label for="access-level" class="tooltip">Access Level<i class="fas fa-question-circle">
            <span class="tooltiptext"><ul><li>OVERVIEW: reads employees' overview</li>
            <li>PUBLIC: creates employees, updates, reads complete info</li>
            <li>ADMIN: creates, updates, reads and deletes</li>
            </ul></span></i></label>
            <select id="access-level">`);
        formString.push(generateLevelOptions(data));
        formString.push(`</select>`);
    }
    if(title === "Update") {
        formString.push(`<div class="buttons"><button role="button" type="button" data-name="user" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">${title}</button>`);
         formString.push(`<button role="button" type="button" data-name="user" data-origin="${origin}" class="js-cancel-btn">Cancel</button></form></div>`);
    } 
    else {
        formString.push(`<button role="button" type="submit" data-name="user" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">${title}</button>`);
        formString.push(`<a href="" class="js-login-link">Already have an account?</a></form>`);
    }
    return formString.join("");
}

function renderUserForm(id, origin, data) {
    renderNavBar();
    if (origin === "list") {
        $('.js-form').html(generateUserFormString(data.levels, id, origin)).removeClass('hide-it form');
        fillUserForm(data);
    } else {
        $('.js-form').html(generateUserFormString()).removeClass('hide-it form');
    }
        return data;
}


function renderLoginForm() {
    clearScreen();
    renderNavBar();
    let logInString = `<form class="js-login-form login-form">
    <legend>Log In</legend>
    <label for="username">username</label>
    <input type="text" name="username" id="username" autofocus>
    <label for="password">password</label>
    <input type="password" name="password" id="password">
    <button role="button" type="submit">Log In</button>
    <a href="" class="js-signup-link">Create one account here.</a>
    </form>`;

    $('.js-form').html(logInString).removeClass('hide-it form');

}

function generateEmployeeFormOptions(data, name) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    data.forEach(item => {
        options.push(`<option value="${item._id}">${item[name]}</option>`);
    });
    return options.join("");
}

function generateTrainingOptions(dataT) {
    let trainings = [];
    let index = 0;
    trainings.push(`<legend>Trainings</legend>`);
    let titles = generateEmployeeFormOptions(dataT, "title");
            dataT.forEach(title => {
            index += 1;
            trainings.push(`<label for="training-date${index}"><i class="far fa-calendar-alt tooltip"><span class="tooltiptext">Training Date</span></i>
            <input type="text" id="training-date${index}" class="training-date" autocomplete="off" size="30"></label>`);
            trainings.push(`<select id="training${index}" data-option="${index}">`);
            trainings.push(titles);
            trainings.push(`</select>`);
            })
    return trainings.join("");
}

function generateEmployeeForm(options, id, origin) {
    let action = 'create';
    if (id) {
        action = 'update';
    } else {
        origin = 'list';
    }
     let formString = [];
    
    let employerOptions = generateEmployeeFormOptions(options.employers, "employerName");
    let departmentOptions = generateEmployeeFormOptions(options.departments, "departmentName");
    let trainingOptions = generateTrainingOptions(options.trainings);
        
        formString.push(`<form id="js-employee-form" class="employee-form create-form">
        <p>* required</p>
        <fieldset name="personal-information">`);
        if(action === 'create') {
            formString.push(`<label for="employee-id">Employee ID*</label>
            <input type="text" id="employee-id" required>`);
        }
        else {
            formString.push(`<h1>Employee ID:  ${id}</h1>`);
        }
        formString.push(`<label for="first-name">First Name*</label>
        <input type="text" id="first-name" required>
        <label for="last-name">Last Name*</label>
        <input type="text" id="last-name" required>
        </fieldset>
        <fieldset name="employment-information">
        <label for="employment-date">Employed since*</label>
        <input type="text" id="employment-date" autocomplete="off" size="30">
        <label for="employer">Employer*</label>
        <select id="employer" required>`);
        formString.push(employerOptions);
        formString.push(`</select><label for="department">Department*</label>
        <select id="department" required>`);
        formString.push(departmentOptions);
        formString.push(`</select></fieldset><fieldset name="training" class="training">`);
        formString.push(trainingOptions);
        formString.push(`</fieldset>
        <label for="vehicle"><input type="checkbox" id="vehicle" name="vehicle" value="true">
        Allow vehicle on-site</label>
        <label for="license-plate1">License Plates</label>
        <input type="text" id="license-plate1" class="license-plate">
        <input type="text" id="license-plate2" class="license-plate"><div class="buttons">
        <button role="button" type="button" data-name="employee" data-id="${id}" data-origin="${origin}" class="js-${action}-btn ${action}-btn">Submit</button>
        <button role="button" type="button" data-name="employee" data-origin="${origin}" class="js-cancel-btn cancel-btn">Cancel</button>
        </div></form>`);
        $('.js-form').html(formString.join("")).removeClass('hide-it').addClass('form');

        return options;
}


function renderEmployeeForm(id, origin, data) {
    renderNavBar();
    let options = getOptionsFromCache();
    // render form to create a new employee
    if (!id) {
        generateEmployeeForm(options);
    } // render form filled  with data when
    // options data is already in cache memory
    else if (options !== undefined) {
        generateEmployeeForm(options, id, origin);
        return fillEmployeeForm(data, "employee");
     // render form filled  with data when
     // options data has to be requested to server
    } else {
        return requestAndSaveOptions()
            .then(options => {
                return generateEmployeeForm(options, id, origin);   
            })
            .then(options => {
                return fillEmployeeForm(data, "employee");
            })
            .catch(err => {
                return $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })
    }
}     

function generateEmployerForm(data, id, origin) {
     let action = 'create';
     if (id) {
         action = 'update';
     } else {
         id = 'list';
     }
    let employerString = [];
    employerString.push(`<form class="js-employer-form create-form">
            <label for="employerName">Employer Name</label>
            <input type="text" name="employerName" id="employerName" autofocus required>
            <label for="departmentName">Departments</label>`);

    data.departments.forEach(department => {
        let name = department.departmentName;
        let departmentId = department._id;    
        employerString.push(`<input type="checkbox" name="departmentName" id="${name}" value="${departmentId}"
                            <label for="${name}">${name}</label>`);
    });

    employerString.push(`<div class="buttons"><button role="button" type="submit" 
    data-name="employer" data-id="${id}" data-origin="${origin}" 
    class="js-${action}-btn">Submit</button>
    <button role="button" type="button" data-name="employer" data-origin="${origin}" 
    class="js-cancel-btn">Cancel</button></div></form>`);

    $('.js-form').html(employerString.join("")).addClass('form').removeClass('hide-it');
    if(action === "update") {
        fillEmployerForm(data, "employer");
    }
    return data;
}

function renderEmployerForm(id, origin, data) {
     
    renderNavBar();
    let options = getOptionsFromCache();
    if (options !== undefined) {
        generateEmployerForm(options, id, origin);
    } else {
        return requestAndSaveOptions()
            .then(options => {
                return generateEmployerForm(options, id, origin);
            })    
            .catch(err => {
                console.log(err);
                $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })    
    } 
    return data;       
}    

function renderTrainingForm(id, origin, data) {
     let action = 'create';
     if (id) {
         action = 'update';
     } else {
         id = 'list';
     }
    let trainingString = `<form class="create-form">
        <label for="training-title">Training Title</label>
        <input type="text" name="training-title" id="training-title" autofocus required>
        <label for="expiration-time">Expiration Time (in days)</label>
        <input type="number" name="expiration-time" id="expiration-time" required><div class="buttons">
        <button role="button" type="submit" data-name="training" data-id="${id}" data-origin="${origin}" class="js-${action}-btn">Submit</button>
        <button role="button" type="button" data-name="training" data-origin="${origin}" class="js-cancel-btn">Cancel</button></div>
        </form>`;
    $('.js-form').html(trainingString).addClass('form').removeClass('hide-it');
     if (action === "update") {
         fillTrainingForm(data);
     }
    renderNavBar();
    return data;
}

function renderDepartmentForm(id, origin, data) {
    let action = 'create';
    if (id) {
        action = 'update';
    } else {
        id = 'list';
    }
    let departmentString = `<form class="js-department-form create-form">
        <label for="departmentName">Department Name</label>
        <input type="text" name="departmentName" id="departmentName" autofocus required><div class="buttons">
        <button role="button" type="submit" data-name="department" data-id="${id}" data-origin="${origin}" class="js-${action}-btn">Submit</button>
        <button role="button" type="button" data-name="department" data-origin="${origin}" class="js-cancel-btn">Cancel</button></div>
        </form>`;

    $('.js-form').html(departmentString).addClass('form').removeClass('hide-it');
    renderNavBar();
    if (action === "update") {
        fillDepartmentForm(data, "department");
    }
    return data;
}
