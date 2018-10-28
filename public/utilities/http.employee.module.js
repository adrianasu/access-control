function handleError(xhr) {
    let message = "Something went wrong, please try again.";

    if (xhr && xhr.responseJSON && xhr.responseJSON.err) {
        message = JSON.stringify(xhr.responseJSON.err).replace(/\\\"/g, "");
    }

    doConfirm("error", "", message)
    toggleInfoWindow();
    return message;
}


function createOneWithFile(settings) {
    const {
        jwToken,
        formData,
        endpoint,
      } = settings;
      return $.ajax({
          type: 'POST',
          url: `/api/${endpoint}`,
          contentType: false,
          processData: false,
          data: formData,
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        }, 
        error: err => {
              handleError(err);
            }
      });
}

// get employers, trainings and departments
function getAllOptions(settings) {
    const {jwToken} = settings;
    return $.ajax({
        type: 'GET',
        url: `/api/options`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            handleError(err); 
        }
    });
}


function createOne(settings) {
    const { jwToken, endpoint, newData } = settings;
    return $.ajax({
        type: 'POST',
        url: `/api/${endpoint}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(newData),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
            },
            error: err => {
                handleError(err);
            }
        });
}

function updateOne(settings) {
    const { user, endpoint, id, updatedData, origin } = settings;
    return $.ajax({
        type: 'PUT',
        url: `/api/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(updatedData),  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${user.jwToken}`);
        },
        error: err => {
            handleError(err);
            if (origin === "form"){
                renderSearchMenu(user.accessLevel);
            } else {
                $('.js-list-results').removeClass('hide-it');
                $('.js-form').addClass('hide-it');
            }
        }
    });
}
function deleteOne(settings) {
    const { endpoint, jwToken, id } = settings;
    return $.ajax({
        type: 'DELETE',
        url: `/api/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            handleError(err);
        }
    });
}

function getAll(settings) {
    const { jwToken, endpoint } = settings;
    return $.ajax({
        type: 'GET',
        url: `/api/${endpoint}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            handleError(err);   
        }
    });
}

// id is the mongoose id except for employees (employeeId)
// and users (username)
function getById(settings) {
    const { jwToken, endpoint, id } = settings;
    return $.ajax({
        type: 'GET',
        url: `/api/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            handleError(err);
        }
    });
}

function getEmployeeDeskOverview(settings) {
    const { id, jwToken } = settings;
    return $.ajax({
        type: 'GET',
        url: `/api/employee/desk/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            handleError(err);
            $('.js-form').addClass('form');
            $('.js-form, .js-footer').removeClass('hide-it');
        }
    });
}

function getEmployeeKioskOverview(settings) {
    const { id } = settings;
    
    return $.ajax({
        type: 'GET',
        url: `/api/employee/kiosk/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        error: err => {
            handleError(err);
            $('.js-form').addClass('form');   
            $('.js-form, .js-footer').removeClass('hide-it');
        }
    });
}



