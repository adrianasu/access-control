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

function getUserAndPassword(level) {
    let users = {
        "overview": {
            username: "sara123",
            password: "sara123"
        },
        "public": {
            username: "peter",
            password: "peterpan"
        },
        "admin": {
            username: "hello",
            password: "hello123"
        },
    };

    return users[level];

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
    $('.js-results').addClass('hide-it');
    let selectedOption = $(this).text().slice(0, -1);
    return getAllAndRender({endpoint: selectedOption}, selectedOption);
  
}

function handleAdminLink(event) {
    event.preventDefault();
    return getAllAndRender({endpoint: "user"}, "user");
    
}

function handleClear(event) {
    event.preventDefault();
    let origin = $(this).attr('data-origin');
    $('.js-results').addClass('hide-it');
    if(origin === "list") {
        $('.js-list-results').removeClass('hide-it');
    }
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
  
    let selectedOption = $('.js-goto-create').attr('data-value');
   
    updateAuthenticatedUI();
    if (STATE.authUser) {
        clearScreen();
        return screens[selectedOption].render();
    }
}
//yes
function handleNavigationClick(event) {
    let loginAndRender = ["overview", "public", "admin"];
    let justRender = ["login", "logout", "signup"];
    event.preventDefault();
    $(this).closest('header').toggleClass('open');
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
    } else if(selectedOption === "basic") {
        selectedOption = "home";
    } else if(selectedOption === "help") {
        return reset();
    }

    if (loginAndRender.includes(selectedOption)) {
        user = getUserAndPassword(selectedOption);
        return doLogin(user);
    }

   
    clearScreen();
    if (selectedOption === "home") {
        let userLevel = getUserLevel();  // returns a string
        return screens[selectedOption][userLevel]();  
    } else if(justRender.includes(selectedOption)){
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
    let origin = 'form';
    // get id from search input
    let employeeId = $('#employeeId').val();
    // get id from thumbnails
    if(!employeeId) {
        employeeId = $(this).attr('data-value');
        origin = 'list';
    } else {
        $('.js-results, .js-intro').addClass('hide-it');
        $('.js-search-form').removeClass('welcome-form');
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
                return screens.employees.render[userLevel](data, userLevel, origin);
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
 
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
   
    doConfirm(name, "delete", {name, id, origin});
    toggleInfoWindow();
}

function handleDelete(event) {
    event.preventDefault();
 
    const endpoint = $(this).attr("data-name");
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
    updateAuthenticatedUI();
    toggleInfoWindow();

    if (STATE.authUser) {
        const jwToken = STATE.authUser.jwToken;
        let settings = { id, jwToken, endpoint };

        return deleteOne(settings)
        .then(data => {
            deleteDataFromCache();
            deleteOptionsFromCache();
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
 
    const origin = $(this).attr('data-origin');
    const id = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;
 

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

function handleUpdate(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
 
    let endpoint = $(this).attr("data-name");
    let id = $(this).attr("data-id");
    let origin = $(this).attr("data-origin");
   
    
    updateAuthenticatedUI();
    let jwToken = getAuthenticatedUserFromCache().jwToken; 
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
        if (endpoint === "employee") {
            saveDataIntoCache(data);
        } else if (endpoint === "user") {
            // save updated user's info into cache
            data.jwToken = getAuthenticatedUserFromCache().jwToken;
            saveAuthenticatedUserIntoCache(data);
        } else {
            deleteOptionsFromCache();
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
    

function watchButtons() {
    $('.js-site-nav').on('click', 'li button', handleNavigationClick);
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
    $('.js-list-results, .js-results').on('click', '.js-goto-edit', handlePrepareUpdateForm);
    $('.js-list-results, .js-results').on('click', '.js-delete-btn', handlePrepareDelete);
    $('.js-list-results, .js-results').on('click', '.js-goto-create', handlePrepareCreate);
    $('.js-list-results').on('click', '.js-thumbnail', handleSearchEmployee);
    $('.js-list-results, .js-results').on('click', '.js-clear', handleClear);
    $('.js-info-window').on('click', '.js-delete-btn', handlePrepareDelete);
    $('.js-info-window').on('click', '.js-confirm-btn', handleDelete);
    $('.js-info-window').on('click', '.js-close', toggleInfoWindow);
    $('.js-footer').on('click', '.js-user-list', handleAdminLink);
    $('.js-footer').on('click', '.js-signup-link', handleSignUpForm);
    $('.js-form').tooltip();
}

function watchHamburguer() {
     $('.menu-toggle').on('click', function (event) {
         event.preventDefault();
         event.stopPropagation();
        //$('.js-site-nav').toggleClass('site-nav--open');
        $(this).closest('header').toggleClass('open');
     })
}

function watchCalendars() {
    $('.js-form').on("focus", ('#employment-date, .training-date'),
            function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            $(this).datepicker();
    });
}

function reset() {
    /// delete 
    deleteDataFromCache();
    deleteOptionsFromCache();
    deleteAuthenticatedUserFromCache();
  
    clearScreen();
    $('.js-help').removeClass('hide-it');
    renderSearchBar("instructions");
}

function main() {
    reset();
    watchHamburguer();
    watchCalendars();
    watchButtons();   
}

$(main);