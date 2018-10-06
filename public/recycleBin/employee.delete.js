function generateOptions(data) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    data.forEach(option => 
        options.push(`<option value="${option}">${option}</option>`)
    );
    return options.join("");
}

function generateDateInput(index) {
    return `<input type="text" id="training-date${index}" size="30">`;
}

function generateTrainingOptions(titles) {
    let training = [];
    training.push(`<legend>Training</legend>`);
    for (let index=1; index <= titles.length; index++) {
        training.push(`<select id="training${index}">`);
        training.push(generateOptions(titles));
        training.push(generateDateInput(index));
        training.push(`</select>`);
    }
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

function selectActualOption(doneTraining, index) {
    $(`#training${index+1} > option`).each(function() {
        if(this.value === doneTraining[index].title) {
            $(this).val(doneTraining[index].title);
            $(this).attr("selected", true);
        }
        else {
            $(this).attr("selected", false);
        }
    });
}

function fillTrainingInfo(training) {
    const done = training.filter(item => item.trainDate !== null);
    if (done.length > 0) {
        for (let i = 0; i < done.length; i++) {
             selectActualOption(done, i);
              console.log(done[i].trainDate);
              let trainingDate = done[i].trainDate;
              $(`#training-date${i+1}`).datepicker().datepicker("setDate", trainingDate);
        }
    }
}

function eraseTrainingInfo(training) {
    for (let i=1; i <= training.length; i++) {
        $(`#training${i}`).val("");
        $(`#training-date${i}`).datepicker().datepicker("setDate", null);
    }
}

function fillFormWithEmployeeData({photo, id, firstName, lastName, employmentDate, employer,
    department, allowVehicle, licensePlate = "", training = []}) {
    $('.js-photo').attr({src: photo, alt: `${firstName} ${lastName}`});
    $('#employee-id').val(id);
    $('#first-name').val(firstName);
    $('#last-name').val(lastName);
    $('#employment-date').datepicker("setDate", employmentDate);
    $('#employer').val(employer);
    $('#department').val(department);
    fillTrainingInfo(training);
    $('#vehicle').attr("checked", allowVehicle);
    $('#license-plate').val(licensePlate);
}


function watchButtons() {
    $('.js-helper-button').on('click', handleCancel);
    $('.js-main-button').on('click', handleDelete);
    console.log("watchButtons");
    
}

function generateButtons() {
    $('.js-main-button').text("Delete");
    $('.js-helper-button').text("Cancel").attr("type", "button");
}

function watchCalendarsAndPhoto() {
    $('.js-photo-input').on('change', displayPhoto);
    $('#employment-date').datepicker();
    $('.training').on('focus', 'input', function (e) {
        e.preventDefault();
        $('.training input').datepicker();  
    });
    console.log("watchCalendars");
}

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getEmployeeData(callbackFn) {
      // we use a `setTimeout` to make this asynchronous
      // as it would be with a real AJAX call.
    return setTimeout(function() {
        callbackFn(MOCK_DATA);
        fillFormWithEmployeeData(MOCK_DATA.employeeData)
    }, 1);  
}

function main() {
    getEmployeeData(displayAllOptions);
    generateButtons();
    watchCalendarsAndPhoto();
    watchButtons(); 
    console.log("main");
}
// Do this when the page loads
$(main);