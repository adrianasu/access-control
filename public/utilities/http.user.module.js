

function userSignup(settings) {
    const { userData, onSuccess } = settings;
    $.ajax({
        type: 'POST',
        url: '/api/user',
        contentType: 'application/json',
        dataType: 'json',
            data: JSON.stringify(userData),
            success: onSuccess,
            error: err => {
                console.error(err);
                handleError(err);
            }
    });
}

function userLogin(settings) {
    const { userData, onSuccess, onError } = settings;
    $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            let message = 'Incorrect username or password. Please try again.';
            $('.js-message').html(`<p>${message}</p>`).show();
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
            handleError(err);
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


