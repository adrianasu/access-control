function optionsDataHttpRequest() {
    let jwToken = STATE.authUser.jwToken;
    return getAllOptions({ jwToken })
        .then(data => {
            saveOptionsIntoCache(data);
            return data;
        })   
}

function generateLevelOptions(data) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    Object.keys(data).forEach(level => {
        options.push(`<option value="${level}">${level}</option>`);
    });
    return options;
}

// user's data to get all access levels available
function generateUserFormString(data, id) {
    let btnName = 'signup';
    let title = 'Sign Up';
    if (id) {
        btnName = 'update';
        title = 'Update';
    } else {
        id = 'list';
    }
    let formString =[];
    formString.push(`<form class="js-signup-form">
    <legend>${title}</legend>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" autofocus required>
    <label for="email">e-mail</label>
    <input type="email" name="email" id="email" required>`);
    if (title === "Sign Up") {
        formString.push(`<label for="username">username</label>
            <input type="text" name="username" id="username" pattern=".{4,}" title="Four or more characters" required>
            <label for="password">password</label>
            <input type="password" name="password" id="password" pattern=".{7,}" title="Seven or more characters" required>`);
    }
    else {
        formString.push(`<legend>Access Level</legend>
            <select id="access-level">`);
        formString.push(generateLevelOptions(data));
        formString.push(`</select>`);
    }
        formString.push(`<button role="button" type="submit" data-name="user" data-id="${id}" class="js-${btnName}-btn">Submit</button>`);
    if(title === "Update") {
         formString.push(`<button role="button" type="button" data-name="user" data-origin="${id}" class="js-cancel-btn">Cancel</button></form>`);
    } 
    else {
        formString.push(`<a href="" class="js-login-link">Already have an account?</a></form>`);
    }
    return formString.join("");
}

function renderSignUpForm(id, data) {
    if (id) {
        renderSearchBar();
        $('.js-form').html(generateUserFormString(data.levels, id)).show();
    }
        $('.js-form').html(generateUserFormString()).show();
    return data;
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

function generateEmployeeForm(options, id) {
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
        //<input type="file" accept="image/*" id="js-photo-input" name="photo-file" autofocus required>
        formString.push(`<img src="" alt="" class="js-photo">
        <form enctype="multipart/form-data" method="POST" name="employeeInfo" id="js-employee-form">
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
        <input type="checkbox" id="vehicle" name="vehicle" value="true" required>
        <label for="vehicle">Allow vehicle on-site</label>
        <label for="license-plate1">License Plates</label>
        <input type="text" id="license-plate1" class="license-plate">
        <input type="text" id="license-plate2" class="license-plate">
        <button role="button" type="submit" data-name="employee" data-id="${id}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="employee" data-origin="${id}" class="js-cancel-btn">Cancel</button>
        </form>`);
        $('.js-form').html(formString.join("")).show();

        return options;
}


function renderEmployeeForm(id, data) {
    renderSearchBar();
    let options = getOptionsFromCache();
    if (options !== undefined) {
        generateEmployeeForm(options, id);
        return data;
    } else {
        return optionsDataHttpRequest()
            .then(options => {
                return generateEmployeeForm(options, id);

            })
            .catch(err => {
                console.log(err);
                $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })
    }
}     

function generateEmployerForm(data, id) {
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

    employerString.push(`<button role="button" type="button" data-name="employer" data-id="${id}" class="js-${btnName}-btn">Submit</button>
    <button role="button" type="button" data-name="employer" data-origin="${id}" class="js-cancel-btn">Cancel</button></form>`);

    $('.js-form').html(employerString).show();
    return data;
}

function renderEmployerForm(id,data) {
     
    renderSearchBar();
    let options = getOptionsFromCache();
    if (options !== undefined) {
        generateEmployerForm(options, id);
    } else {
        return optionsDataHttpRequest()
            .then(options => {
                return generateEmployerForm(options, id);
            })    
            .catch(err => {
                console.log(err);
                $('.js-message').html(`<p>Something went wrong. Please try again</p>`);
            })    
    } 
    return data;       
}    

function renderTrainingForm(id, data) {
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

        <button role="button" type="submit" data-name="training" data-id="${id}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="training" data-origin="${id}" class="js-cancel-btn">Cancel</button>
        </form>`;
    $('.js-form').html(trainingString).show();
    renderSearchBar();
    return data;
}

function renderDepartmentForm(id, data) {
    let btnName = 'create';
    if (id) {
        btnName = 'update';
    } else {
        id = 'list';
    }
    let departmentString = `<form class="js-department-form">
        <label for="departmentName">Department Name</label>
        <input type="text" name="departmentName" id="departmentName" autofocus required>
        <button role="button" type="submit" data-name="department" data-id="${id}" class="js-${btnName}-btn">Submit</button>
        <button role="button" type="button" data-name="department" data-origin="${id}" class="js-cancel-btn">Cancel</button>
        </form>`;

    $('.js-form').html(departmentString).show();
    renderSearchBar();
    return data;
}
