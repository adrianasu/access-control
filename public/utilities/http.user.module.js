window.HTTP_USER_MODULE = {
    userSignup,
    userLogin,
    userUpdate,
    userDelete,
    usersGetAll,
    userGetById
};

const HTTP_EMPLOYEE = window.HTTP_EMPLOYEE_MODULE;

function userSignup(settings) {
    const { userData, onSuccess } = settings;
    $.ajax({
        type: 'POST',
        url: '/user',
        contentType: 'application/json',
        dataType: 'json',
            data: JSON.stringify(userData),
            success: onSuccess,
            error: err => {
                console.error(err);
                HTTP_EMPLOYEE.handleError(err);
            }
    });
}

function userLogin(settings) {
    const { userData, onSuccess, onError } = settings;
    $.ajax({
        type: 'POST',
        url: '/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            console.error(err);
            HTTP_EMPLOYEE.handleError(err);
        }
    });
}

function userUpdate(settings) {
    const { jwToken, userId, updatedUser, onSuccess, onError } = settings;
    $.ajax({
        type: 'PUT',
        url: `/user/${userId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(updatedUser),  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            HTTP_EMPLOYEE.handleError(err);
        }
    });
}

function userDelete(settings) {
    const { jwToken, userId, onSuccess, onError } = settings;
    $.ajax({
        type: 'DELETE',
        url: `/user/${userId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            HTTP_EMPLOYEE.handleError(err);
        }
    });
}

function usersGetAll(settings) {
    const { jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/user`,
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

function userGetById(settings) {
    const { userId, jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `api/user/${userId}`,
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


