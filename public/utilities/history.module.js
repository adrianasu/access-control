window.HISTORY_MODULE = {
    screens,
    changeSiteState,
};

const RENDER_EMPLOYEE = window.RENDER_EMPLOYEE_MODULE;
const RENDER_SEARCH = window.RENDER_SEARCH_MODULE;
const RENDER_OTHER = window.RENDER_OTHER_MODULE;

const screens = {
    overview: {
        show: false,
        render: RENDER_EMPLOYEE.renderEmployeeOverview,
        URL: '/api/overview' // add employeeId
    },
    search: {
        show: false,
        render: RENDER_SEARCH.renderSearchBar,
        URL: '/api/search',
    },
    employeeForm: {
        show: false,
        render: RENDER_EMPLOYEE.renderEmployeeForm,
        URL: '/api/employee'  // if !create add id
    },
    trainingForm: {
        show: false,
        render: RENDER_OTHER.renderTrainingForm,
        URL: '/api/training' // if !create add id
    },
    employerForm: {
            show: false,
            render: RENDER_OTHER.renderEmployerForm,
            URL: '/api/employer' // if !create add id
        },
    departmentForm: {
            show: false,
            render: RENDER_OTHER.renderDepartmentForm,
            URL: '/api/department' // if !create add id
    },
    list: {
        show: false,
        render: RENDER_OTHER.renderList,
        URL: '/api/'   // add what list
    },
    login: {
        show: false,
        render: RENDER_OTHER.renderLoginForm,
        URL: '/api/public/index.html'
    },
    userForm: {
        show: false,
        render: RENDER_OTHER.renderSignUpForm,
        URL: '/api/user' // if !create add id
    }
}

function clearScreen() {
    $('.js-results').hide();
    $('.js-form').hide();
    $('js-loader').hide();
    $('js-message').hide();
}

function changeSiteState(currentScreen, addToUrl) {
    let previousScreen = Object.keys(screens).map(screen => 
                                                (screen.show));
    screens[previousScreen] = false;
    screens[currentScreen] = true;
    let url = screens[currentScreen].URL;
    if (addToUrl) {
        url = url+`/${addToUrl}`;
    }
    clearScreen();
    history.pushState(screens[currentScreen], currentScreen, url);
}

