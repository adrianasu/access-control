let STATE = {}; 

function updateAuthenticatedUI() {
    const authUser = getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
    } 
}

function doHttpRequest(endpoint, screen) {
    const jwToken = STATE.authUser.jwToken;
    let { requestFunction } = screens[screen];
    let settings = {jwToken, endpoint };
    return requestFunction(settings);  
}

function handleSearchMenu(event) {
    event.preventDefault();
    $('.js-results').hide();
    
    let selectedOption = $('select').find(":selected").attr("data-value");
    updateAuthenticatedUI();
    if (STATE.authUser) {
        if (selectedOption === "employeeById") {
            screens[selectedOption].render();    
        }
        else {
            return doHttpRequest(selectedOption, "list")
            .then(data => {
                clearScreen();
                return screens.list.onSuccess(data, selectedOption)})
            .catch(err => console.log(err));
        }
    }
}

function handleCreateMenu(event) {
    event.preventDefault();
    $('.js-results').hide();
    let selectedOption = $('select').find(":selected").attr("data-value");
    updateAuthenticatedUI();
    if (STATE.authUser) {
        clearScreen();
        return screens[selectedOption].render();
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
        clearScreen();
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
                renderSearchEmployeeOverview(data);
                return data;
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
                return renderEmployeeById(data);
            
        })  
    }
}

function handleLoginLink(event) {
    event.preventDefault();
    renderLoginForm();
}

function watchConfirmation() {
    $('.js-info-window').on('click', '.js-window-delete', function(event) {
        event.preventDefault();
        $('js-loader').show();
        return true;
    });
    $('.js-info-window').on('click', '.js-window-cancel', function (event) {
        event.preventDefault();
        $('js-loader').show();
        return false;
    });

}

function handleDelete(event) {
    event.preventDefault();
    //event.stopImmediatePropagation();
    $('.js-loader').show();
    const dataName = $(this).attr("data-name");
    const dataId = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
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
            settings.onSuccess = () => {
                screens.deleteAtById.onSuccess();
                doConfirm(dataName, "delete");
            }
        }
        else if (origin === "list") {
            settings.onSuccess = () => { getAll({
                jwToken,
                endpoint: dataName})
                .then(res => {
                    clearScreen();
                    screens.list.onSuccess(res, dataName);
                    doConfirm(dataName, "delete", res);
                }) 
            }
        }
        return deleteOne(settings);
    }
}

function handlePrepareUpdateForm() {
    event.preventDefault();
    clearScreen();
    $('.js-loader').show();
    const origin = $(this).attr('data-origin');
    const id = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
    let data;
    if (origin === "byId") {  
        data = STATE.employee;
        renderUpdateForm(id, dataName, origin, data);
        return screens[dataName].fill(data, dataName);
    }
    else { 
        return getById({
            jwToken,
            id,
            endpoint: dataName,
        })
        .then(res => {
                return renderUpdateForm(id, dataName, origin, res); 
        })
        .then(data=> {
              return screens[dataName].fill(data, dataName);
        })
    }
}

function handleUpdate(event) {
    event.preventDefault();
    $('.js-loader').show();
    let endpoint = $(this).attr("data-name");
    let id = $(this).attr("data-id");
    let origin = $(this).attr("data-origin");
    updateAuthenticatedUI();
    let jwToken = STATE.authUser.jwToken;
    let updatedData = screens[endpoint].getDataFrom(event);
    if (endpoint === "employee") {
        updatedData.employeeId = id;
    }
    else {
        updatedData.id = id;
    }
    let settings = { jwToken, endpoint, updatedData, id };
    
    return updateOne(settings)
    .then(data=> {
        toggleInfoWindow();
        doConfirm(endpoint, 'updated', data);
        if(origin === "list") {
            return doHttpRequest(endpoint, "list")
            .then(data => {
                clearScreen();
                return screens.list.onSuccess(data, endpoint)
                })
                .catch(err => console.log(err));
        }
        else {
            clearScreen();
            return screens.searchMenu.render();
        }
   
    })
    
}

function handleCreate(event) {
    event.preventDefault();
    $('.js-loader').show();
    let endpoint = $(this).attr("data-name");
   
    updateAuthenticatedUI();
    let jwToken = STATE.authUser.jwToken;
    let sendData = screens[endpoint].getDataFrom(event);
    let settings = { jwToken, endpoint, sendData };
    
    return screens[endpoint].requestFunction(settings)
    .then(data=> {
        toggleInfoWindow();
        return doConfirm(endpoint, 'created', data);
    })
}
    
    function handleCancel() {
        event.preventDefault();
        clearScreen();
        renderSearchBar();
    }

    function handleSignUpForm(event) {
        event.preventDefault();
        clearScreen();
        renderSignUpForm();
    }
    
    function toggleInfoWindow() {
        $('.js-info-window').toggleClass('show-info-window');
    }
    
    function watchHamburguer() {
    $('.menu-toggle').click(function (e) {
        event.preventDefault();
        $('.site-nav').toggleClass('site-nav--open', 500);
        $(this).toggleClass('open');
    })
}

function watchButtons() {
    $('.js-form').on('submit', 'form', e => e.preventDefault());
    $('.js-form').on('submit', '.js-login-form', handleLogIn);
    $('.js-form').on('click', '.js-signup-link', handleSignUpForm);
    $('.js-form').on('submit', '.js-signup-form', handleSignUp);
    $('.js-form').on('click', '.js-login-link', handleLoginLink);
    $('.js-form').on('submit', '.js-overviewSearch-form', handleSearchEmployeeOverview);//
    $('.js-nav-bar').on('click', '.js-logout', handleLogOut);
    $('.js-nav-bar').on('click', 'li a', handleSearchBar);
    $('.js-form').on('click', '.search-menu', handleSearchMenu);
    $('.js-form').on('click', '.create-menu', handleCreateMenu);
    $('.js-form').on('submit', '.js-byIdSearch-form', handleSearchEmployeeById);
    $('.js-results').on('click', '.js-goto-edit', handlePrepareUpdateForm);
    $('.js-results').on('click', '.js-delete-btn', handleDelete);
    $('.js-form').on('click', '.js-cancel-btn', handleCancel);
    $('.js-form').on('click', '.js-create-btn', handleCreate);
    $('.js-info-window').on('click', '.js-close', toggleInfoWindow);
    $('.js-form').on('click', '.js-update-btn', handleUpdate);
    //$('.js-form').tooltip();
    
}

function watchCalendars() {

    $('.js-form').on("focus", ('#employment-date, .training-date'),
            function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).datepicker();
    });

}


function main() {
    clearScreen();
    renderLoginForm();
    watchHamburguer();
    watchCalendars();
    watchButtons();   
}

$(main);