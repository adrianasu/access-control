let oneEmployeeData;

const requestList = {
    employeesList: {
        endpoint: "employee",
        onSuccess: renderList,
        requestFunction: getAll,
        screen: "list"
    },
    departmentsList: {
        endpoint: "department",
        onSuccess: renderList,
        requestFunction: getAll,
        screen: "list"
    },
    employersList: {
        endpoint: "employer",
        onSuccess: renderList,
        requestFunction: getAll,
        screen: "list"
    },
    trainingsList: {
        endpoint: "training",
        onSuccess: renderList,
        requestFunction: getAll,
        screen: "list"
    },
    usersList: {
        endpoint: "user",
        onSuccess: renderList,
        requestFunction: getAll,
        screen: "list"
    },
    employeeById: {
        endpoint: "employee", // add employeeId
        onSuccess: renderSearchEmployeeById,
        requestFunction: getById,
        screen: "employeeInfo"
    },
    deleteAtById: {
        endpoint: "employee", // add employeeId
        onSuccess: renderSearchEmployeeById,
        requestFunction: deleteOne,
        screen: "employeeInfo"
    },
    deleteAtList: {
        endpoint: "employee", //add employeeId
        onSuccess: renderList,
        requestFunction: deleteOne,
        screen: "List"
    }
  
     
}

let STATE = {}; 

function updateAuthenticatedUI() {
    const authUser = getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
    } 
}

function handleRequestOptions() {
    let settings = {};
    updateAuthenticatedUI();
    settings.jwToken = STATE.authUser.jwToken;
    return getAllOptions(settings)
        .then(options=> {
            saveOptionsIntoCache(options);
            return getOptionsFromCache();
        })
        .catch(err => {
            console.log('Something went wrong.');
            $('.js-message').html(`<p>Something went wrong. Please, try again</p>`);
        })

}

function handleSearchBar(event) {
    event.preventDefault();
    $('.js-loader').show();
    const selectedOption = $(this)
                            .closest('li a')
                            .attr('data-value');
    //console.log(selectedOption);
    updateAuthenticatedUI();
    if (STATE.authUser) {
        pushSiteState(selectedOption);
        screens[selectedOption].render();
    }
}

function handleSearchEmployeeOverview(event) {
  
    event.stopPropagation();

    $('.js-loader').show();
    $('.js-results').hide();
    const employeeId = $('#employeeId').val();
    if (employeeId) {
        updateAuthenticatedUI();
        const jwToken = STATE.authUser.jwToken;
        employeeOverviewById({
            employeeId,
            jwToken,
            onSuccess: res => {
                $('#employeeId').val("");
                renderSearchEmployeeOverview(res);
            }
        })
    }
}

function handleSearchEmployeeById(event) {
    event.preventDefault();
 
    $('.js-loader').show();
    $('.js-results').hide();
    const employeeId = $('#employeeId').val();
    if (employeeId) {
        updateAuthenticatedUI();
        const jwToken = STATE.authUser.jwToken;
        if (STATE.authUser) {
            return getById({
                id: employeeId,
                jwToken,
                endpoint: "employee",
                onSuccess: res => {
                    oneEmployeeData = res;
                    $('#employeeId').val("");
                    pushSiteState("employeeInfo", employeeId);
                    renderEmployeeById(res);
                }
            })
           
           
        }
    }
}

function handleLoginLink(event) {
    event.preventDefault();
    renderLoginForm();
}

function handleOptions(event) {
    event.preventDefault();
    $('.js-results').hide();
    let id = null;
    let selectedOption = $('select').find(":selected").attr("data-value");
    if (selectedOption === "employeeById") {
        renderSearchEmployeeById();
    }
    else {
        updateAuthenticatedUI();
        const jwToken = STATE.authUser.jwToken;
        let { endpoint, onSuccess, requestFunction, screen } = requestList[selectedOption];
        let settings = {jwToken, endpoint, onSuccess };
        if (STATE.authUser) {
            return requestFunction(settings)
            .then(all => {
                pushSiteState(screen, endpoint);
                screens[selectedOption].render(all);
            })
        }
    }
}



function handleDelete(event) {
  
    event.preventDefault();

    $('.js-loader').show();
    const employeeId = $('.js-delete-btn').attr("data-employeeId");
    const origin = $('.js-delete-btn').attr("data-origin");
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
    const confirmation = confirm(`Are you sure you want to delete employee ${employeeId}?`);
    let settings = {
        id: employeeId,
        jwToken,
        endpoint: "employee"
    }
    
    if (origin === "byId") {
        settings.onSuccess = requestList.deleteAtById.onSuccess;
    }
    else {
        settings.onSuccess = requestList.deleteAtList.onSuccess;
    }
    
    if (confirmation && STATE.authUser) {
        return deleteOne(settings);
    }
}

function handleEdit() {
    console.log("hey");
    event.preventDefault();

    $('.js-loader').show();
    const employeeId = $('.js-goto-edit').attr("data-employeeId");
    const origin = $('.js-goto-edit').attr("data-origin");
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
    let employee;
    if(origin === "byId") {
        employee = oneEmployeeData;
    }
    else if (origin === "list") {
        // get employee byId
    }

    

}

function watchHamburguer() {
    $('.menu-toggle').click(function () {
        $('.site-nav').toggleClass('site-nav--open', 500);
        $(this).toggleClass('open');
    })
}

function watchButtons() {
    $('.js-form').on('submit', '.js-login-form', handleLogIn);
    $('.js-form').on('click', '.js-signup-link', renderSignUpForm);
    $('.js-form').on('submit', '.js-signup-form', handleSignUp);
    $('.js-form').on('click', '.js-login-link', handleLoginLink);
    $('.js-form').on('submit', '.js-overviewSearch-form', handleSearchEmployeeOverview);
    $('.js-nav-bar').on('click', '.js-logout', handleLogOut);
    $('.js-nav-bar').on('click', 'li a', handleSearchBar);
    $('.js-form').on('click', '.menu', handleOptions);
    $('.js-form').on('submit', '.js-byIdSearch-form', handleSearchEmployeeById);
    $('.js-results').on('click', '.js-goto-edit', handleEdit);
    $('.js-results').on('click', '.js-delete-btn', handleDelete);


   // $('.js-form').on('submit', '.js-submit-button', handleCreate);


}

function watchCalendarsAndPhoto() {
    $('.js-photo').on('change', previewPhoto);
    $('#employment-date').datepicker();
    $('.training').on('focus', 'input', function (e) {
        e.preventDefault();
        $('.training input').datepicker();
    })

}


function main() {
    clearScreen();
    renderLoginForm();
    watchButtons();
    watchCalendarsAndPhoto();
    watchHamburguer();
      
}

$(main);