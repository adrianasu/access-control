let MOCK_DATA = {
    employers: ["Handy Manny", "Metal Works", "Big Guys", "The Other Guys"],
    departments: ["Maintenance", "Administration", "Quarry", "Warehouse"],
    trainingTitles: ["Safety First", "Always Safe", "Take Care"],
    employeeData : 
        // {
        //     "id": 12345,
        //     "photo": "https://unsplash.com/photos/XRA6DT2_ReY",
        //     "firstName": "John",
        //     "lastName": "Smith",
        //     "employer": "Handy Manny",
        //     "department": "Maintenance",
        //     "licensePlate": "2ABC1234",
                // "training": [
                //     {
                //         "title": "Safety First",
                //        "date": new Date()
                //     },
                //     {
                //         "title": "Always Safe",
                //         "date": new Date()
                //     },
                //     {
                //         "title": "Take Care",
                //         "date": new Date()
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
            "licensePlate": "7ZBC1234",
            "training": [
                  {
                      "title": "Safety First",
                      "date": null
                  },
                  {
                      "title": "Always Safe",
                      "date": new Date()
                  },
                  {
                      "title": "Take Care",
                      "date": new Date()
                  }
              ]
            }
        }
    


function generateOptions(data) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    data.forEach(option => {
        options.push(`<option value=${option}>${option}</option>`);
    });
    return options.join("");
}

function generateDateInput(index) {
    return `<input type="text" id="training-date${index}" size="30">`;
}

function generateTrainingOptions(data) {
    let training = [];
    let index = 0;
    training.push(`<legend>Trainings</legend>`);
    data.forEach(title => {
        index+=1;
        training.push(`<select id="training${index}">`);
        training.push(generateOptions(data));
        training.push(generateDateInput(index));
        training.push(`</select>`);
    })
    return training.join("");
}

function displayAllOptions(data) {
    $('#employer').html(generateOptions(data.employers));
    $('#department').html(generateOptions(data.departments));
    $('.training').html(generateTrainingOptions(data.trainingTitles));
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

function getFormData() {
    const employeeData = {
        //photo : $('.js-photo-input').files[0],
        id : $('#employee-id').val(),
        firstName : $('#first-name').val(),
        lastName : $('#last-name').val(),
        employmentDate : $('#employment-date').val(),
        employer : $('#employer').val(),
        department : $('#department').val(),
        allowVehicle : $('#vehicle').val(),
        licensePlate : $('#license-plate').val(),
    }
    let allTrainings = [];
    let index = 0;
    MOCK_DATA.trainingTitles.forEach(title => {
        index += 1;
        let trainingTitle = $(`#training${index}`).text();
        if (trainingTitle) {
            let trainingDate = $(`#training-date${index}`).datepicker('getDate');
            allTrainings.push({ title: trainingTitle, date: trainingDate });
            console.log(trainingDate.getFullYear()+ " " + trainingDate.getMonth());
        }
    });
    employeeData.training = allTrainings;
    console.log(employeeData);
    return employeeData;
}

function handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit");
    getFormData();
}

function watchSubmitButton() {
    $('.js-form').on('submit', handleSubmit);
    //$('.js-delete-button').on('submit', handleDelete);
    console.log("watchButtons");
}

function watchCalendarsAndPhoto() {
     $('.js-photo-input').on('change', displayPhoto);
    $('#employment-date').datepicker();
    $('.training').on('focus', 'input', function (e) {
       e.preventDefault();
       $('.training input').datepicker();
   })
   console.log("watchCalendars");
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
    return setTimeout(function() {
        callbackFn(MOCK_DATA)      
    }, 1);  
}

function main() {
    getOptionsData(displayAllOptions);
    watchCalendarsAndPhoto();
    watchSubmitButton(); 
    console.log("main");
}
// Do this when the page loads
$(main);