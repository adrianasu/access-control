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
            username: "overview",
            password: "overview123"
        },
        "public": {
            username: "public",
            password: "publicpublic"
        },
        "admin": {
            username: "admin",
            password: "adminadmin"
        },
    };

    return users[level];

}

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

function handleList(event) {
    event.preventDefault();
     event.stopPropagation();
    $('.js-results').addClass('hide-it');
    let selectedOption = $(this).text().slice(0, -1);
    return getAllAndRender({endpoint: selectedOption}, selectedOption);
  
}

function handleAdminLink(event) {
    event.preventDefault();
     event.stopPropagation();
    return getAllAndRender({endpoint: "user"}, "user");
    
}

function handleClear(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    let origin = $(this).attr('data-origin');
    $('.js-results').addClass('hide-it');
    if(origin === "list") {
        $('.js-list-results').removeClass('hide-it');
    } else {
        // if origin is "form"
        let user = getAuthenticatedUserFromCache();
        renderHome(user);
    }
}

function handleCancel(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    clearScreen();
    renderNavBar();

    let origin = $(this).attr('data-origin');
    
    if (origin === "form" || origin === "searchForm") {
        $('.js-results').removeClass('hide-it');
    } else {
        $('.js-list-results').removeClass('hide-it');  
    }
 
}


function handlePrepareCreate(event) {
    event.preventDefault();
    event.stopPropagation();
    let selectedOption = $('.js-goto-create').attr('data-value');
   
    updateAuthenticatedUI();
    if (STATE.authUser) {
        clearScreen();
        return screens[selectedOption].render();
    }
}

function handleUserLevelDemo(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    let selectedOption = $(this)
        .closest('th button')
        .text().trim().toLowerCase();
    $('.js-menu-toggle, .js-site-nav, .js-short-nav, .js-side-menu').removeClass('hide-it');
    decideWhatToRender(selectedOption);
}

function handleMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    let selectedOption = $(this)
        .closest('li button')
        .text().trim().toLowerCase();
    decideWhatToRender(selectedOption);
}


function handleNavigationClick(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    $(this).closest('header').toggleClass('open');
    
    let selectedOption = $(this)
    .closest('li button')
    .text().trim().toLowerCase();
    decideWhatToRender(selectedOption);
}


function handleSearchEmployee(event) {
    event.preventDefault();
     event.stopPropagation();
    event.stopImmediatePropagation();
    let origin = 'searchForm';
    // get id from search input
    let employeeId = $('#employeeId').val();
    // get id from thumbnails
    if(!employeeId) {
        employeeId = $(this).attr('data-value');
        origin = 'list';
    } else {
        $('.js-intro, .js-form, .js-footer').addClass('hide-it');
    }
    
    let userLevel = getUserLevel();
    let settings = { id: employeeId, endpoint: "employee", origin };
    if (STATE.authUser) {
        settings.jwToken = STATE.authUser.jwToken;
    }
    
    if (employeeId) {
        return screens.employees.request[userLevel](settings)
        .then(data => {
                saveEmployeeIntoCache(data);
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
    event.stopPropagation();
    renderLoginForm();
}

function handlePrepareDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    $('.js-loader').show();
    const name = $(this).attr("data-name");
 
    const id = $(this).attr("data-id");
    const origin = $(this).attr("data-origin");
   
    doConfirm(name, "delete", {name, id, origin});
    toggleInfoWindow();
}

function handleDelete(event) {
    let options = ["training", "department", "employer"];
    event.preventDefault();
    event.stopPropagation();
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
            if (endpoint === "employee") {
                deleteEmployeeIdsFromCache();
                deleteEmployeeFromCache();
            } else if (options.includes(endpoint)) {
                deleteOptionsFromCache();
            }
            if (origin === "byId" || origin === "searchForm") {
                clearScreen();
                renderHome(getAuthenticatedUserFromCache());
                doConfirm(endpoint, "deleted");
                toggleInfoWindow();
            } else if (origin === "list" || origin === "thumbnail") {
                return getAllAndRender({jwToken, endpoint}, endpoint)
                .then(all => {
                    doConfirm(endpoint, "deleted");   
                    toggleInfoWindow();
                    return all;
                })
            }
        })
    }
}

function handlePrepareUpdateForm(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    // Check if the update form was called
    // from the list or from the search form.
    const origin = $(this).attr('data-origin');
    const id = $(this).attr('data-id');
    const dataName = $(this).attr('data-name');
    updateAuthenticatedUI();
    const jwToken = STATE.authUser.jwToken;

    if (dataName === "employee") {
        let data = getEmployeeFromCache();
        return renderUpdateForm(id, dataName, origin, data);
    } else { 
        return getById({
            jwToken,
            id,
            endpoint: dataName,
        })
        .then(res => {
            if (dataName === "employee") {
                saveEmployeeIntoCache(res);
            }
                return renderUpdateForm(id, dataName, origin, res); 
        })
    }
}

function handleUpdate(event) {
    event.preventDefault();
    event.stopPropagation();
    let endpoint = $(this).attr("data-name");
    let id = $(this).attr("data-id");
    let origin = $(this).attr("data-origin");
   
    updateAuthenticatedUI();
    let user = getAuthenticatedUserFromCache(); 
    let updatedData = screens[endpoint].getDataFrom(event);

    if (endpoint === "employee") {
        updatedData.employeeId = id;
    }
    else {
        updatedData.id = id;
    }
    let settings = { user, endpoint, updatedData, id, origin };
   
    return updateOne(settings)
    .then(data=> {
        if (endpoint === "employee") {
            saveEmployeeIntoCache(data);
        } else if (endpoint === "user") {
            // save updated user's info into cache
            data.jwToken = getAuthenticatedUserFromCache().jwToken;
            saveAuthenticatedUserIntoCache(data);
        } else {
            deleteOptionsFromCache();
        }
        if(origin === "list" || origin === "thumbnail") {
            let jwToken = getAuthenticatedUserFromCache().jwToken;
            settings = {jwToken, endpoint};
            return getAllAndRender(settings, endpoint)
            .then(all => {
                doConfirm(endpoint, 'updated', data);
                toggleInfoWindow();
                return data;
            })
        }
        else {
            clearScreen();
            renderHome(getAuthenticatedUserFromCache());
            doConfirm(endpoint, 'updated', data);
            toggleInfoWindow();
            return data;
        }
    })
    

}


function handleCreate(event) {
    event.preventDefault();
    event.stopPropagation();
    let endpoint = $(this).attr("data-name");
    let jwToken = getAuthenticatedUserFromCache().jwToken;
    let newData = screens[endpoint].getDataFrom(event);
    let settings = { jwToken, endpoint, newData };
    let origin = $(this).attr("data-origin");
    
    return createOne(settings)
    .then(data=> {
        if (endpoint === "employee") {
            saveEmployeeIntoCache(data);
        }
        doConfirm(endpoint, 'created', data);
        toggleInfoWindow();
        if (origin === "list" || origin === "thumbnail") {
            settings = {
                jwToken,
                endpoint
            };
            return getAllAndRender(settings, endpoint);
        } else {
            clearScreen();
            return renderHome(getAuthenticatedUserFromCache());
        }
    })
}

function handleSignUpForm(event) {
    event.preventDefault();
    event.stopPropagation();
    clearScreen();
    renderUserForm();
}

function toggleInfoWindow(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    $('.js-info-window').toggleClass('show-info-window');
}
    
function watchButtons() {
    $('.js-nav-container').on('click', 'li button', handleNavigationClick);
    $('.js-side-menu').on('click', 'li button', handleMenu);
    $('.js-permissions').on('click', 'th button', handleUserLevelDemo);
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

}

function watchHamburguer() {
     $('.js-nav-container').on('click', '.js-menu-toggle', function (event) {
         event.preventDefault();
         event.stopPropagation();
         event.stopImmediatePropagation();
        $(this).closest('header').toggleClass('open');
     })
}

function watchCalendars() {
    $('.js-form').on("focus", ('#employment-date, .training-date'),
            function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            $(this).datepicker();
    });
}

function reset() {
    deleteEmployeeIdsFromCache();
    deleteEmployeeFromCache();
    deleteOptionsFromCache();
    deleteAuthenticatedUserFromCache();
    clearScreen();
    $('.js-help').removeClass('hide-it');
    $('.js-menu-toggle, .js-site-nav, .js-short-nav, .js-side-menu').addClass('hide-it');
    
}

function main() {
    reset();
    watchHamburguer();
    watchCalendars();
    watchButtons();   
}

$(main);