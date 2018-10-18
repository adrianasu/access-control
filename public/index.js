let STATE = {}; 

function updateAuthenticatedUI() {
   
    const authUser = getAuthenticatedUserFromCache();
  
    if (authUser) {
        STATE.authUser = authUser;
    } 

}

function updateSiteStatus() {
    const siteStatus = getSiteStatus();
    if (siteStatus) {
        STATE.siteStatus = siteStatus;
    }
}
//yes
function getAllAndRender(settings, selectedOption) {
    return getAll(settings)
        .then(data => {
            clearScreen();
            screens[selectedOption].onSuccess(data, selectedOption)
            return data;
        })
        .catch(err => console.log(err));
}


//yes
function handleList(event) {
    event.preventDefault();
    $('.js-results').hide();
    let selectedOption = $(this).text().slice(0, -1);
    updateAuthenticatedUI();
    if (STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;

        return getAllAndRender({jwToken, endpoint: selectedOption}, selectedOption);
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
//yes
function handleSearchBar(event) {
    event.preventDefault();
    $('.js-loader').show();
    let selectedOption = $(this)
                            .closest('li button')
                            .text().trim().toLowerCase();
    let endpoint = selectedOption;
    if(selectedOption === "list employees") {
        endpoint = "employee/desk";
        selectedOption = "employee";
    }                       
    if(selectedOption.slice(-1) === "s") {
        selectedOption = selectedOption.slice(0, -1);
    } 
                            
    clearScreen();
    if (selectedOption === "home") {
        let userLevel = getUserLevel();  // returns a string
        return screens[selectedOption][userLevel]();  
    } else if(selectedOption === "login" 
            || selectedOption === "logout" 
            || selectedOption === "signup"){
                return screens[selectedOption].render();
    }
    else {
        updateAuthenticatedUI();
        if (STATE.authUser) {
            const jwToken = STATE.authUser.jwToken;
            return getAllAndRender({ jwToken, endpoint }, selectedOption);
        }
    }

}

//yes
function handleSearchEmployee(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    $('.js-loader').show();
    $('.js-results, .js-intro').hide();
    const employeeId = $('#employeeId').val();

    let userLevel = getUserLevel();
    console.log(userLevel);
    let settings = { id: employeeId, endpoint: "employee" };
    if (STATE.authUser) {
        settings.jwToken = STATE.authUser.jwToken;
    }

    if (employeeId) {
        return screens.employees.request[userLevel](settings)
            .then(data => {
                STATE.employeeId = data.employeeId;
                STATE.employee = data;
                $('#employeeId').val("");
                return screens.employees.render[userLevel](data, userLevel);
            })
    }
    else {
        $('.js-message').html(`<p>Please, provide a valid employee ID.</p>`);
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
    $('.js-loader').show();
    const endpoint = $(this).attr("data-name");
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
    const confirmation = confirm(`Are you sure you want to delete ${endpoint} ${id}?`);
    updateAuthenticatedUI();
    
    if (confirmation && STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;
        let settings = { id, jwToken, endpoint };
        if (origin === "byId") {
            settings.onSuccess = () => {
                screens.deleteAtById.onSuccess();
                doConfirm(endpoint, "delete");
            }
        }
        else if (origin === "list") {
            settings.onSuccess = () => { 
                return getAllAndRender({jwToken, endpoint}, endpoint)
                .then(res => {
                    doConfirm(endpoint, "delete", res);
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
            settings = {jwToken, endpoint};
            return getAllAndRender(settings, endpoint);
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
    renderUserForm();
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
    $('.js-form').on('submit', '.js-search-form', handleSearchEmployee);
    $('.js-nav-bar').on('click', '.js-logout', handleLogOut);
    $('.js-nav-bar').on('click', 'li button', handleSearchBar);
     $('.js-form').on('click', '.js-list', handleList);
    $('.js-form').on('click', '.create-menu', handleCreateMenu);
    $('.js-results').on('click', '.js-goto-edit', handlePrepareUpdateForm);
    $('.js-results').on('click', '.js-delete-btn', handleDelete);
    $('.js-form').on('click', '.js-cancel-btn', handleCancel);
    $('.js-form').on('click', '.js-create-btn', handleCreate);
    $('.js-info-window').on('click', '.js-close', toggleInfoWindow);
    $('.js-form').on('click', '.js-update-btn', handleUpdate);
    $('.js-form').tooltip();
    
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
    deleteAuthenticatedUserFromCache();
    //// check if token is valid
 
    clearScreen();
    renderWelcome();
    watchHamburguer();
    watchCalendars();
    watchButtons();   
}

$(main);