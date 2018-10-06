window.RENDER_OTHER_MODULE = {
    renderSignUpForm,
    renderLoginForm,
    renderList,
    renderDepartmentForm,
    renderEmployerForm,
    renderTrainingForm
};

const RENDER_EMPLOYEE = window.RENDER_EMPLOYEE_MODULE;
const HISTORY = window.HISTORY_MODULE;


function renderSignUpForm() {
    HISTORY.changeSiteState("signup");
    let signUpString = `<form class="js-signup-form">
    <legend>Sign up</legend>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" required>
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
    HISTORY.changeSiteState("login");
    let logInString = `<form class="js-login-form">
    <legend>Log In</legend>
    <label for="username">username</label>
    <input type="text" name="username" id="username">
    <label for="password">password</label>
    <input type="text" name="password" id="password">
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
        } else {
            table.push(`<th>${item}</th>`);
        }
    });
    table.push('</tr>');
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
            } else {
                table.push(`<td>${item[key]}</td>`);
            }
        });
        table.push('</tr>');
    })
    return table.join("");
}

function renderList(data) {
    HISTORY.changeSiteState("list");
    let table = [];
    table.push(generateHeader(data));
    table.push(generateRows(data));
    table.join("");
    $('.js-results').html(table).show();
}

function renderTrainingForm(data, id) {
    HISTORY.changeSiteState("trainingForm", id);
    let trainingString = `<form class="js-training-form">
            <label for="training-title">Training Title</label>
            <input type="text" name="training-title" id="training-title" required>
            <label for="expiration-time">Expiration Time (in days)</label>
            <input type="number" name="expiration-time" id="expiration-time" required>

            <button role="button" type="submit">Submit</button>
            </form>`;

    $('.js-form').html(trainingString).show();
}

function renderEmployerForm(data, id) {
    HISTORY.changeSiteState("employerForm", id);
    let employerString = `<form class="js-employer-form">
            <label for="emp-name">Employer Name</label>
            <input type="text" name="emp-name" id="emp-name" required>
            <button role="button" type="submit">Submit</button>
            </form>`;

    $('.js-form').html(employerString).show();
}

function renderDepartmentForm(data, id) {
    HISTORY.changeSiteState("departmentForm", id);
    let departmentString = `<form class="js-department-form">
        <label for="dep-name">Department Name</label>
        <input type="text" name="dep-name" id="dep-name" required>
        <button role="button" type="submit">Submit</button>
        </form>`;

    $('.js-form').html(departmentString).show();
}

