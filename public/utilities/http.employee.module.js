window.HTTP_EMPLOYEE_MODULE = {
    employeeCreate,
    employeeUpdate,
    employeeDelete,
    employeesGetAll,
    employeeGetById,
    employeeOverviewById,
    handleError
};

function handleError(xhr) {
    let message = "Something went wrong, please try again.";
    if (xhr && xhr.responseJSON && xhr.responseJSON.error && xhr.responseJSON.error.description) {
        message = xhr.responseJSON.error.description;
    }
    $('.js-loader').hide();
    $('.js-error-message').html(`<p>${message}</p>`).show();
}

function employeeCreate(settings) {
    const { jwToken, employeeData, onSuccess, onError } = settings;
    $.ajax({
        type: 'POST',
        url: '/employee',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(employeeData),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
            },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function employeeUpdate(settings) {
    const { jwToken, employeeId, updatedEmployee, onSuccess, onError } = settings;
    $.ajax({
        type: 'PUT',
        url: `/employee/${employeeId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(updatedEmployee),  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function employeeDelete(settings) {
    const { jwToken, employeeId, onSuccess, onError } = settings;
    $.ajax({
        type: 'DELETE',
        url: `/employee/${employeeId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function employeesGetAll(settings) {
    const { jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/employee`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function employeeGetById(settings) {
    const { employeeId, jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/employee/${employeeId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}

function employeeOverviewById(settings) {
    const { employeeId, jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/employee/overview/${employeeId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                onError(err);
            }
        }
    });
}


