

function handleError(xhr) {
    let message = "Something went wrong, please try again.";
   
    if (xhr && xhr.responseJSON && xhr.responseJSON.err ) {
        message = JSON.stringify(xhr.responseJSON.err);
    }
    $('.js-loader').hide();
    $('.box').removeClass('green red');
    $('.js-results').hide();
    $('.js-message').html(`<p>${message}</p>`).show();
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
              console.error(err);
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
            console.error(err);
            handleError(err); 
        }
    });
}


function createOne(settings) {
    const { jwToken, endpoint, sendData } = settings;
    return $.ajax({
        type: 'POST',
        url: `/api/${endpoint}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(sendData),
        beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
            },
        error: err => {
                console.error(err);
                handleError(err);
        }
    });
}

function updateOne(settings) {
    const { jwToken, endpoint, id, updatedData } = settings;
    return $.ajax({
        type: 'PUT',
        url: `/api/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(updatedData),  
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            console.error(err);
            handleError(err);
        }
    });
}
function deleteOne(settings) {
    const { endpoint, jwToken, id, onSuccess } = settings;
    return $.ajax({
        type: 'DELETE',
        url: `/api/${endpoint}/${id}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        success: onSuccess,
        error: err => {
            let message = `Couldn't delete ${endpoint} with id ${id}`;
            alert(message);
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
            console.error(err);
            
                handleError(err);
            
        }
    });
}

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

function employeeOverviewById(settings) {
    const { employeeId, jwToken } = settings;
    return $.ajax({
        type: 'GET',
        url: `/api/employee/overview/${employeeId}`,
        contentType: 'application/json',
        dataType: 'json',
        data: undefined,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', `Bearer ${jwToken}`);
        },
        error: err => {
            $('.js-results').hide();
            handleError(err);
        }
    });
}


