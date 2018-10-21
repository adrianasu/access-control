let STATE = {}; 

function updateAuthenticatedUI() {
    const authUser = getAuthenticatedUserFromCache();
    if (authUser) {
        STATE.authUser = authUser;
    } else {
        STATE.authUser = undefined;
    }
}

function defineEndpointLevel() {
    let userLevel = getUserLevel();
    if (userLevel === "basic") {
        return "employee/kiosk";
    } else if ( userLevel === "overview") {
        return "employee/desk";
    } else {
        return "employee";
    }

}

//yes
function getAllAndRender(settings, selectedOption) {
    updateAuthenticatedUI();
    if (STATE.authUser) {
        settings.jwToken = STATE.authUser.jwToken;
    return getAll(settings)
        .then(data => {
            clearScreen();
            screens[selectedOption].onSuccess(data, selectedOption)
            return data;
        })
        .catch(err => console.log(err));
    }
}


//yes
function handleList(event) {
    event.preventDefault();
    $('.js-results').hide();
    let selectedOption = $(this).text().slice(0, -1);
    return getAllAndRender({endpoint: selectedOption}, selectedOption);
  
}

function handleAdminLink(event) {
    event.preventDefault();
    return getAllAndRender({endpoint: "user"}, "user");
    
}

function handleClear(event) {
    event.preventDefault();
    $('.js-results').hide();
}

function handleCancel(event) {
    event.preventDefault();
    clearScreen();
    renderSearchBar();
    let endpoint = $(this).attr('data-name');
    return getAllAndRender({endpoint}, endpoint);
}


function handlePrepareCreate(event) {
    event.preventDefault();
    $('.js-results').hide();
    let selectedOption = $('.js-goto-create').attr('data-value');
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
    let endpoint;
    if(selectedOption === "list employees") {
        selectedOption = "employee";
        endpoint = defineEndpointLevel();
    }                       
    else if(selectedOption.slice(-1) === "s") {
        selectedOption = selectedOption.slice(0, -1);
        endpoint = selectedOption;
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
    
    // get id from search input
    let employeeId = $('#employeeId').val();
    console.log(employeeId);
    // get id from thumbnails
    if(!employeeId) {
        employeeId = $(this).attr('data-value');
    } else {
        $('.js-results, .js-intro').hide();
    }

    let userLevel = getUserLevel();
    let settings = { id: employeeId, endpoint: "employee" };
    if (STATE.authUser) {
        settings.jwToken = STATE.authUser.jwToken;
    }

    if (employeeId) {
        return screens.employees.request[userLevel](settings)
            .then(data => {
                saveDataIntoCache(data);
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

function handlePrepareDelete(event) {
    event.preventDefault();
      event.stopImmediatePropagation();
    $('.js-loader').show();
    const name = $(this).attr("data-name");
    console.log(name);
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
    if (origin === "thumbnail"){
    toggleInfoWindow();
    }
    doConfirm(name, "delete", {name, id, origin});
    toggleInfoWindow();
}

function handleDelete(event) {
    event.preventDefault();
    $('.js-loader').show();
    const endpoint = $(this).attr("data-name");
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
    updateAuthenticatedUI();
    toggleInfoWindow();
console.log(origin);
    if (STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;
        let settings = { id, jwToken, endpoint };

        return deleteOne(settings)
        .then(data => {
            deleteDataFromCache();
            if (origin === "byId") {
                doConfirm(endpoint, "deleted");
                toggleInfoWindow();
                clearScreen();
                return renderSearchMenu();
            } else if (origin === "list" || origin === "thumbnail") {
                doConfirm(endpoint, "deleted");   
                toggleInfoWindow();
                return getAllAndRender({jwToken, endpoint}, endpoint);
            }
        })
    }
}

function handlePrepareUpdateForm(event) {
    event.preventDefault();
    $('.js-loader').show();
    const origin = $(this).attr('data-origin');
    const id = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
    if (origin === "thumbnail") {
        toggleInfoWindow();
    }

    if (dataName === "employee") {
        let data = getDataFromCache();
        renderUpdateForm(id, dataName, origin, data);
        return screens[dataName].fill(data, dataName);
    } else { 
        return getById({
            jwToken,
            id,
            endpoint: dataName,
        })
        .then(res => {
                saveDataIntoCache(res);
                return renderUpdateForm(id, dataName, origin, res); 
        })
        .then(data=> {
              return screens[dataName].fill(data, dataName);
        })
    }
}

function compareData(updatedData) {
    let updated = {};
    let previousData = getDataFromCache();
    Object.keys(updatedData).forEach(item => {
        // let deps = [];
        // if (item === "departments" && item.length > 0) {
        //     for(let i= 0; i < item.length; i++){
             
        //         previousData.departments.forEach(dep2 => {
        //        console.log(item, dep2);
        //             if (item[i] !== dep2) {
        //                 deps.push(dep2);
        //             }
        //         })
        //     }
            
        //     if (deps.length > 0) {
        //         updated[item] = updatedData[item];
        //     }
        // } else if (item === "departments"  && item.length === 0) {
        //     if (previousData.departments.length > 0) {
        //         updated[item] = [];
        //     }
        // }
        
        if(updatedData[item] !== previousData[item]) {
            updated[item] = updatedData[item];
        }
    })
    console.log(updated);
    return updated;
}

function handleUpdate(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    $('.js-loader').show();
    let endpoint = $(this).attr("data-name");
    let id = $(this).attr("data-id");
    let origin = $(this).attr("data-origin");
   
    
    updateAuthenticatedUI();
    let jwToken = getAuthenticatedUserFromCache().jwToken; 
    let formData = screens[endpoint].getDataFrom(event);
    let updatedData = compareData(formData);

    if(jQuery.isEmptyObject(updatedData)) {
        doConfirm(endpoint, "unchanged");
        toggleInfoWindow();
        return updatedData;
    }

    if (endpoint === "employee") {
        updatedData.employeeId = id;
    }
    else {
        updatedData.id = id;
    }
    let settings = { jwToken, endpoint, updatedData, id };
    
    return updateOne(settings)
    .then(data=> {
        if (endpoint === "employee") {
            saveDataIntoCache(data);
        }
        doConfirm(endpoint, 'updated', data);
        toggleInfoWindow();
        if(origin === "list" || origin === "thumbnail") {
            settings = {jwToken, endpoint};
            
            return getAllAndRender(settings, endpoint);
        }
        else {
            clearScreen();
            return renderSearchMenu();
        }
   
    })

}


function handleCreate(event) {
    event.preventDefault();
    $('.js-loader').show();
    let endpoint = $(this).attr("data-name");
    let jwToken = getAuthenticatedUserFromCache().jwToken;
    let newData = screens[endpoint].getDataFrom(event);
 
    let settings = { jwToken, endpoint, newData };
    
    return createOne(settings)
    .then(data=> {
        saveDataIntoCache(data);
        doConfirm(endpoint, 'created', data);
        toggleInfoWindow();
        return data;
    })
}

function handleSignUpForm(event) {
    event.preventDefault();
    clearScreen();
    renderUserForm();
}


function toggleInfoWindow(event) {
    if (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
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
    $('.js-nav-bar').on('click', '.js-logout', handleLogOut);
    $('.js-nav-bar').on('click', 'li button', handleSearchBar);
    $('.js-form').on('submit', 'form', e => e.preventDefault());
    $('.js-form').on('submit', '.js-login-form', handleLogIn);
    $('.js-form').on('click', '.js-signup-link', handleSignUpForm);
    $('.js-form').on('submit', '.js-signup-form', handleSignUp);
    $('.js-form').on('click', '.js-login-link', handleLoginLink);
    $('.js-form').on('submit', '.js-search-form', handleSearchEmployee);
    $('.js-form').on('click', '.js-list', handleList);
    $('.js-form').on('click', '.js-cancel-btn', handleCancel);
    $('.js-form').on('click', '.js-create-btn', handleCreate);
    $('.js-form').on('click', '.js-update-btn', handleUpdate);
    $('.js-results').on('click', '.js-goto-edit', handlePrepareUpdateForm);
    $('.js-results').on('click', '.js-delete-btn', handlePrepareDelete);
    $('.js-results').on('click', '.js-clear-btn', handleClear);
    $('.js-results').on('click', '.js-goto-create', handlePrepareCreate);
    $('.js-results').on('click', '.js-thumbnail', handleSearchEmployee);
    $('.js-info-window').on('click', '.js-goto-edit', handlePrepareUpdateForm);
    $('.js-info-window').on('click', '.js-delete-btn', handlePrepareDelete);
    $('.js-info-window').on('click', '.js-confirm-btn', handleDelete);
    $('.js-info-window').on('click', '.js-close', toggleInfoWindow);
    $('.js-footer').on('click', '.js-user-list', handleAdminLink);
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

function reset() {
    deleteAuthenticatedUserFromCache();
    clearScreen();
    renderWelcome();
}

function main() {
    reset();
    watchHamburguer();
    watchCalendars();
    watchButtons();   
}

$(main);