const requestList = {
    // employeesList: {
    //     endpoint: "employee",
    //     onSuccess: renderList,
    //     requestFunction: getAll,
    //     screen: "list"
    // },
    // departmentsList: {
    //     endpoint: "department",
    //     onSuccess: renderList,
    //     requestFunction: getAll,
    //     screen: "list"
    // },
    // employersList: {
    //     endpoint: "employer",
    //     onSuccess: renderList,
    //     requestFunction: getAll,
    //     screen: "list"
    // },
    // trainingsList: {
    //     endpoint: "training",
    //     onSuccess: renderList,
    //     requestFunction: getAll,
    //     screen: "list"
    // },
    // usersList: {
    //     endpoint: "user",
    //     onSuccess: renderList,
    //     requestFunction: getAll,
    //     screen: "list"
    // },
    // employeeById: {
    //     endpoint: "employee", // add employeeId
    //     onSuccess: renderSearchEmployeeById,
    //     requestFunction: getById,
    //     screen: "employeeInfo"
    // },
    // deleteAtById: {
    //     endpoint: "employee", // add employeeId
    //     onSuccess: renderSearchEmployeeById,
    //     requestFunction: deleteOne,
    //     screen: "employeeInfo"
    // },
    // deleteAtList: {
    //     endpoint: "employee", //add employeeId
    //     onSuccess: getAll,
    //     requestFunction: deleteOne,
    //     screen: "list"
    // },
    // employeeForm: {
    //     endpoint: "employee",
    //     onSuccess: confirmCreation, ///maybe window
    //     requestFunction: createOne,
    //     screen: "employeeForm"
    // },
    // trainingsForm: {
    //     endpoint: "training",
    //     onSuccess: confirmCreation, ///maybe window
    //     requestFunction: createOne,
    //     screen: "trainingsForm"
    // },
    // departmentsForm: {
    //     endpoint: "department",
    //     onSuccess: confirmCreation, ///maybe window
    //     requestFunction: createOne,
    //     screen: "departmentsForm"
    // },
    // employersForm: {
    //     endpoint: "employer",
    //     onSuccess: confirmCreation, ///maybe window
    //     requestFunction: createOne,
    //     screen: "employersForm"
    // },  
}

let STATE = {}; 

function updateAuthenticatedUI() {
    const authUser = getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
    } 
}

function doHttpRequest(endpoint, screen) {
    const jwToken = STATE.authUser.jwToken;
    let { onSuccess, requestFunction } = screens[screen];
    let settings = {jwToken, endpoint, onSuccess };
    return requestFunction(settings);  
}

function handleSearchMenuOptions(event) {
    event.preventDefault();
    $('.js-results').hide();
    
    let selectedOption = $('select').find(":selected").attr("data-value");
    updateAuthenticatedUI();
    if (STATE.authUser) {
        if (selectedOption === "employeeById") {
            pushSiteState(selectedOption, screens[selectedOption].endpoint);
            screens[selectedOption].render();    
        }
        else {
            return doHttpRequest(selectedOption, "list")
            .then(data => {
                pushSiteState("list", selectedOption);

                screens.list.onSuccess(data, selectedOption)})
            .catch(err => console.log(err));
        }
    }
}

function requestOptionsData() {
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

function handleCreateMenuOptions(event) {
    event.preventDefault();
    $('.js-results').hide();

    let selectedOption = $('select').find(":selected").attr("data-value");
    
    updateAuthenticatedUI();
    if (STATE.authUser) {
       
        let { endpoint, screen } = requestList[selectedOption];
        pushSiteState(screen, endpoint);

        if ((selectedOption === "employersForm" ||
            selectedOption === "employeeForm") &&
            getOptionsFromCache === undefined) {
                return requestOptionsData()
                    .then(options => {
                        screens[selectedOption].render(options);

                    })
                    
        } else if (selectedOption === "employersForm" ||
                selectedOption === "employeeForm") {
            let options = getOptionsFromCache();
            screens[selectedOption].render(options);
        } else {
            screens[selectedOption].render();
        }
    }
}


function handleSearchBar(event) {
    event.preventDefault();
    $('.js-loader').show();
    const selectedOption = $(this)
                            .closest('li a')
                            .attr('data-value');

    updateAuthenticatedUI();
    if (STATE.authUser) {
        pushSiteState(selectedOption);
        screens[selectedOption].render();
    }
}

function handleSearchEmployeeOverview(event) {
    event.preventDefault();
  
    $('.js-loader').show();
    $('.js-results').hide();
    const employeeId = $('#employeeId').val();
    updateAuthenticatedUI();
    if (employeeId && STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;
        return employeeOverviewById({
            employeeId,
            jwToken})
            .then(data => {
                $('#employeeId').val("");
                return renderSearchEmployeeOverview(data);
        })
    }
}

function handleSearchEmployeeById(event) {
    event.preventDefault();
  
    $('.js-loader').show();
    $('.js-results').hide();
    const employeeId = $('#employeeId').val();
    if (employeeId && STATE.authUser) {
        updateAuthenticatedUI();
        const jwToken = STATE.authUser.jwToken;
        
        return getById({
            id: employeeId,
            jwToken,
            endpoint: "employee"})
            .then(data => {
                STATE.employeeId = data.employeeId;
                STATE.employee = data;
                $('#employeeId').val("");
                pushSiteState("employeeById", employeeId);
                return renderEmployeeById(data);
            
        })  
    }
}

function handleLoginLink(event) {
    event.preventDefault();
    renderLoginForm();
}

function handleDelete(event) {
  
    event.preventDefault();
    event.stopImmediatePropagation();
    $('.js-loader').show();
    const dataName = $(this).attr("data-name");
    const dataId = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
    // const origin = $('.js-delete-btn').attr("data-origin");
    const confirmation = confirm(`Are you sure you want to delete ${dataName} ${dataId}?`);
    updateAuthenticatedUI();
    
    if (confirmation && STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;
        let settings = {
            id: dataId,
            jwToken,
            endpoint: dataName
        }
        if (origin === "byId") {
            settings.onSuccess = screens.deleteAtById.onSuccess();
        }
        else if (origin === "list") {
            settings.onSuccess = () => { getAll({
                jwToken,
                endpoint: dataName,
                onSuccess: res => {
                    pushSiteState("list", dataName);
                    screens.list.onSuccess(res, dataName);
                    } 
                })
            }
        }
        return deleteOne(settings);
    }
}

function handleEdit() {
    console.log("hey");
    event.preventDefault();

    $('.js-loader').show();
    const employeeId = $('.js-goto-edit').attr("data-employeeId");
    //const origin = $('.js-goto-edit').attr("data-origin");
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
    
   pushSiteState("employeeForm", employeeId);
   renderEmployeeForm();
    
    prepareEmployeeFormData(employeeId)

    

    

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
    $('.js-form').on('click', '.search-menu', handleSearchMenuOptions);
    $('.js-form').on('click', '.create-menu', handleCreateMenuOptions);
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