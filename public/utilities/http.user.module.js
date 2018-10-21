

function userSignup(settings) {
    const { userData } = settings;
    return $.ajax({
        type: 'POST',
        url: '/api/user',
        contentType: 'application/json',
        dataType: 'json',
            data: JSON.stringify(userData),
            error: err => {
                console.error(err);
                handleError(err);
            }
    });
}

function userLogin(settings) {
    const { userData } = settings;
    return $.ajax({
        type: 'POST',
        url: '/api/auth/login',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(userData),
        error: err => {
            let message = 'Incorrect username or password. Please try again.';
            doConfirm("error", "", message)  
            toggleInfoWindow();
        }
    });
}




