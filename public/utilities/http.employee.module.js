window.HTTP_EMPLOYEE_MODULE = {
    createOne,
    createOneWithFile,
    updateOne,
    deleteOne,
    getAll,
    getById,
    overviewById,
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

function createOneWithFile(settings) {
      const {
          jwToken,
          formData,
          endpoint,
          onSuccess
      } = settings;
      $.ajax({
          type: 'POST',
          url: `/api/${endpoint}`,
          contentType: false,
          processData: false,
          data: formData,
          beforeSend: xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`),
          success: onSuccess,
          error: err => {
              console.error(err);
              handleError(err);
          }
      });
}


function getAllOptions(settings) {
    const {
        jwToken,
      
      
    } = settings;
    $.ajax({
        type: 'GET',
        url: `/api/options`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
      
        error: err => {
            console.error(err);
         
                handleError(err);
            
        }
    });
}





function createOne(settings) {
    const { jwToken, endpoint, sendData, onSuccess } = settings;
    $.ajax({
        type: 'POST',
        url: `/${endpoint}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(sendData),
            beforeSend: xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`),
        success: onSuccess,
        error: err => {
                console.error(err);
                handleError(err);
        }
    });
}

function updateOne(settings) {
    const { jwToken, endpoint, id, updatedData, onSuccess, onError } = settings;
    $.ajax({
        type: 'PUT',
        url: `/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(updatedData),  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            console.error(err);
            if (onError) {
                handleError(err);
            }
        }
    });
}

function deleteOne(settings) {
    const { jwToken, id, onSuccess, onError } = settings;
    $.ajax({
        type: 'DELETE',
        url: `/${endpoint}/${id}`,
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
                handleError(err);
            }
        }
    });
}

function getAll(settings) {
    const { jwToken, endpoint, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/${endpoint}`,
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
                handleError(err);
            }
        }
    });
}

function getById(settings) {
    const { endpoint, id, jwToken, onSuccess, onError } = settings;
    $.ajax({
        type: 'GET',
        url: `/${endpoint}/${id}`,
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
                handleError(err);
            }
        }
    });
}

function employeeOverviewById(settings) {
    const { employeeId, jwToken, onSuccess } = settings;
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
            handleError(err);
        }
    });
}


