function requestAndSaveOptions() {
    let jwToken = STATE.authUser.jwToken;
    return getAllOptions({ jwToken })
        .then(data => {
            saveOptionsIntoCache(data);
            return data;
        })   
}

function renderWelcome() {
    $('.js-intro').html(`<h1>Welcome!</h1>
    <p>Enter your employee ID to check if you comply with the requirements to enter these premises.</p>
    <p>For more information, please contact your supervisor.</p>`).show();
    $('.js-form').html(generateSearchForm()).show();
    renderSearchBar();
    renderFooter();
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
    formString.push(`<form class="js-signup-form">
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
        formString.push(`<label for="username">username</label>
            <input type="text" name="username" id="username" pattern=".{4,}" title="Four or more characters" required>
            <label for="password">password</label>
            <input type="password" name="password" id="password" pattern=".{7,}" title="Seven or more characters" required>`);
    }
    else {
        formString.push(`<legend>Access Level<i class="fas fa-question-circle"></i></legend>
            <select id="access-level">`);
        formString.push(generateLevelOptions(data));
        formString.push(`</select>`);
    }
    if(title === "Update") {
        formString.push(`<button role="button" type="button" data-name="user" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">${title}</button>`);
         formString.push(`<button role="button" type="button" data-name="user" data-origin="${origin}" class="js-cancel-btn">Cancel</button></form>`);
    } 
    else {
        formString.push(`<button role="button" type="submit" data-name="user" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">${title}</button>`);
        formString.push(`<a href="" class="js-login-link">Already have an account?</a></form>`);
    }
    return formString.join("");
}

function renderUserForm(id, origin, data) {
    renderSearchBar();
    if (origin === "list") {
        $('.js-form').html(generateUserFormString(data.levels, id, origin)).show();
    } else {
        $('.js-form').html(generateUserFormString()).show();
    }
        return data;
}


function renderLoginForm() {
    clearScreen();
    renderSearchBar();
    let logInString = `<form class="js-login-form">
    <label for="username">username</label>
    <input type="text" name="username" id="username" autofocus>
    <label for="password">password</label>
    <input type="password" name="password" id="password">
    <button role="button" type="submit">Log In</button>
    </form>
    <a href="" class="js-signup-link">Create one account here.</a>`;

    $('.js-form').html(logInString).show();

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
            trainings.push(`<select id="training${index}" data-option="${index}">`);
            trainings.push(titles);
            trainings.push(`</select>`);
            trainings.push(`<input type="text" id="training-date${index}" class="training-date" autocomplete="off" size="30">`);
            })
    return trainings.join("");
}

function generateEmployeeForm(options, id, origin) {
    let btnName = 'create';
    if (id) {
        btnName = 'update';
    } else {
        id = 'list';
    }
     let formString = [];
    
    let employerOptions = generateEmployeeFormOptions(options.employers, "employerName");
    let departmentOptions = generateEmployeeFormOptions(options.departments, "departmentName");
    let trainingOptions = generateTrainingOptions(options.trainings);
        
        formString.push(`<form id="js-employee-form">
        <fieldset name="personal-information">`);
        if(btnName === 'create') {
            formString.push(`<label for="employee-id">Employee ID</label>
            <input type="text" id="employee-id" required>`);
        }
        else {
            formString.push(`<p>Employee ID:  ${id}</p>`);
        }
        formString.push(`<label for="first-name">First Name</label>
        <input type="text" id="first-name" required>
        <label for="last-name">Last Name</label>
        <input type="text" id="last-name" required>
        </fieldset>
        <fieldset name="employment-information">
        <label for="employment-date">Employed since</label>
        <input type="text" id="employment-date" autocomplete="off" size="30">
        <label for="employer">Employer</label>
        <select id="employer" required>`);
        formString.push(employerOptions);
        formString.push(`</select><label for="department">Department</label>
        <select id="department" required>`);
        formString.push(departmentOptions);
        formString.push(`</select></fieldset><fieldset name="training" class="training">`);
        formString.push(trainingOptions);
        formString.push(`</fieldset>
        <input type="checkbox" id="vehicle" name="vehicle" value="true">
        <label for="vehicle">Allow vehicle on-site</label>
        <label for="license-plate1">License Plates</label>
        <input type="text" id="license-plate1" class="license-plate">
        <input type="text" id="license-plate2" class="license-plate">
        <button role="button" type="button" data-name="employee" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="employee" data-origin="${origin}" class="js-cancel-btn">Cancel</button>
        </form>`);
        $('.js-form').html(formString.join("")).show();

        return options;
}


function renderEmployeeForm(id, origin, data) {
    renderSearchBar();
    let options = getOptionsFromCache();
    if (options !== undefined) {
        generateEmployeeForm(options, id, origin);
        return data;
    } else {
        return requestAndSaveOptions()
            .then(options => {
                generateEmployeeForm(options, id, origin);
                return data;
            })
            .catch(err => {
                console.log(err);
                $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })
    }
}     

function generateEmployerForm(data, id, origin) {
     let btnName = 'create';
     if (id) {
         btnName = 'update';
     } else {
         id = 'list';
     }
    let employerString = [];
    employerString.push(`<form class="js-employer-form">
            <label for="employerName">Employer Name</label>
            <input type="text" name="employerName" id="employerName" autofocus required>`);

    data.departments.forEach(department => {
        let name = department.departmentName;
        let departmentId = department._id;    
        employerString.push(`<input type="checkbox" name="departmentName" id="${name}" value="${departmentId}"
                            <label for="${name}">${name}</label>`);
    });

    employerString.push(`<button role="button" type="submit" data-name="employer" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">Submit</button>
    <button role="button" type="button" data-name="employer" data-origin="${origin}" class="js-cancel-btn">Cancel</button></form>`);

    $('.js-form').html(employerString).show();
    return data;
}

function renderEmployerForm(id, origin, data) {
     
    renderSearchBar();
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
     let btnName = 'create';
     if (id) {
         btnName = 'update';
     } else {
         id = 'list';
     }
    let trainingString = `<form>
        <label for="training-title">Training Title</label>
        <input type="text" name="training-title" id="training-title" autofocus required>
        <label for="expiration-time">Expiration Time (in days)</label>
        <input type="number" name="expiration-time" id="expiration-time" required>

        <button role="button" type="submit" data-name="training" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="training" data-origin="${origin}" class="js-cancel-btn">Cancel</button>
        </form>`;
    $('.js-form').html(trainingString).show();
    renderSearchBar();
    return data;
}

function renderDepartmentForm(id, origin, data) {
    let btnName = 'create';
    if (id) {
        btnName = 'update';
    } else {
        id = 'list';
    }
    let departmentString = `<form class="js-department-form">
        <label for="departmentName">Department Name</label>
        <input type="text" name="departmentName" id="departmentName" autofocus required>
        <button role="button" type="submit" data-name="department" data-id="${id}" data-origin="${origin}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="department" data-origin="${origin}" class="js-cancel-btn">Cancel</button>
        </form>`;

    $('.js-form').html(departmentString).show();
    renderSearchBar();
    return data;
}
