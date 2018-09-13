let MOCK_DATA = {
    employers: ["Handy Manny", "Metal Works", "Big Guys", "The Other Guys"],
    departments: ["Maintenance", "Administration", "Quarry", "Warehouse"],
    trainings: ["Safety First", "Always Safe", "Take Care"],
    employeeData : 
        // {
        //     "id": 12345,
        //     "photo": "https://unsplash.com/photos/XRA6DT2_ReY",
        //     "firstName": "John",
        //     "lastName": "Smith",
        //     "employer": "Handy Manny",
        //     "department": "Maintenance",
        //     "licensePlates": "2ABC1234",
                // "training": [
                //     {
                //         "title": "Safety First",
                //         "date": null
                //     },
                //     {
                //         "title": "Always Safe",
                //         "date": Date.now()
                //     },
                //     {
                //         "title": "Take Care",
                //         "date": Date.now()
                //     }
                // ]
        //     }
        // },
        {
            "id": 23456,
            "photo": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Caleb",
            "lastName": "Kennedy",
            "employer": "Handy Manny",
            "department": "Maintenance",
            "licensePlates": "7ZBC1234",
            "training": [
                  {
                      "title": "Safety First",
                      "date": Date.now()
                  },
                  {
                      "title": "Always Safe",
                      "date": Date.now()
                  },
                  {
                      "title": "Take Care",
                      "date": Date.now()
                  }
              ]
            }
        }
    


function getEmployeeInfo(data) {
    return `<tr><th>${data.employeeData.firstName} ${data.employeeData.lastName}</th></tr>
            <tr><td>License Plates</td><td>${data.employeeData.licensePlates}</td></tr>
            <tr><td>Employee ID</td><td>${data.employeeData.id}</td></tr>
            <tr><td>Employer</td><td>${data.employeeData.employer}</td></tr>
            <tr><td>Department</td><td>${data.employeeData.department}</td></tr>`;
}

function displayEmployeeData(data) {
   
}

function displayOptions(data) {
    let options = [];
    data.forEach(option => {
        options.push(`<option value=${option}>${option}</option>`);
    });
    return options.join("");
}

function displayDate(index) {
    return `<input type="date" id="training${index}">`;
}

function displayTrainings(data) {
    let trainings = [];
    let index = 0;
    trainings.push(`<legend>Trainings</legend>`);
    data.forEach(training => {
        index+=1;
        trainings.push(`<select id="training${index}">`);
        trainings.push(displayOptions(data));
        trainings.push(displayDate(index));
        trainings.push(`</select>`);
    })
    return trainings.join("");
}

function displayAllOptions(data) {
    $('#employer').html(displayOptions(data.employers));
    $('#department').html(displayOptions(data.departments));
    $('.trainings').html(displayTrainings(data.trainings));
}

function displayPhoto(fileList) {
    let photo = null;
    fileList.forEach(file => {
        if(file.type.match(/^image\//)) {
            photo = file;
            break;
        }
    });
    if (photo !== null) {
        $('.js-photo').attr('src', photo);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    let formData = new FormData();
    let photoFile = $('.js-photo-input').files[0];
    formData.append('photo', photoFile);
    let id = $('#employee-id').val();
    let firstName = $('#first-name').val();
    let lastName = $('#last-name').val();
    let employmentDate = $('#employment-date').val();
    let employer = $('#employer').val();
    let department = $('#department').val();
    let allTrainings = [];
    data.trainings.forEach(training => {
        allTrainings
    })
}


function watchButtons() {
    $('.js-photo-input').on('change', displayPhoto);
    $('.js-save-button').on('submit', handleSubmit);
    $('.js-delete-button').on('submit', handleDelete);
}

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getOptionsData(callbackFn) {
      // we use a `setTimeout` to make this asynchronous
      // as it would be with a real AJAX call.
    setTimeout(function() {
        callbackFn(MOCK_DATA)      
    }, 1);
    return MOCK_DATA;
}

// Do this when the page loads 
$(function() {
    return getOptionsData(displayAllOptions)
        .then(() => {
            watchButtons();
        })
})