

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




