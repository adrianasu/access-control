let STATE = {};
// All these modules are are defined in /public/utilities
const RENDER = window.RENDER_MODULE;
const HTTP = window.HTTP_MODULE;
const HTTP_USER = window.HTTP_USER_MODULE;
const CACHE = window.CACHE_MODULE;

function generateOptions(data, name) {
    let options = [];
    options.push(`<option value="">Select an option</option>`);
    data.forEach(option => {
        options.push(`<option value="${option.id}">${option[name]}</option>`);
    });
    return options.join("");
}

function generateDateInput(index) {
    return `<input type="text" id="training-date${index}" size="30">`;
}

function generateTrainingOptions(data) {
    let trainings = [];
    let index = 0;
    training.push(`<legend>Trainings</legend>`);
    data.forEach(title => {
        index+=1;
        trainings.push(`<select id="training${index}">`);
        trainings.push(generateOptions(data));
        trainings.push(`</select>`);
        trainings.push(generateDateInput(index));
    })
    return training.join("");
}

function displayAllOptions(data) {
    $('#employer').html(generateOptions(data.employers, "employerName"));
    $('#department').html(generateOptions(data.departments, "departmentName"));
    $('.training').html(generateTrainingOptions(data.trainings));
}



function getFormData() {
    return new FormData($('.js-employee-form')[0]);

    // const employeeData = {
    //     photo: $('.js-photo-input').files[0],
    //     employeeId: $('#employee-id').val(),
    //     firstName: $('#first-name').val(),
    //     lastName: $('#last-name').val(),
    //     employmentDate: $('#employment-date').datepicker('getDate'),
    //     employer: $('#employer').val(),
    //     department: $('#department').val(),
    //     allowVehicle: $('#vehicle').val(),
    //     licensePlates: [$('#license-plate1').val(), $('#license-plate1').val()]
    // }
    // let allTraining = [];
    // let index = 0;
    // MOCK_DATA.trainingTitles.forEach(title => {
    //     index += 1;
    //     let trainingId = $(`#training${index}`).text();
    //     if (trainingId) {
    //         let trainingDate = $(`#training-date${index}`).datepicker('getDate');
    //         allTraining.push({ trainingDate: trainingDate, 
    //                             trainingInfo: {id: trainingId}
    //                         })
    //     }
    // });
    // employeeData.trainings = allTraining;
    // console.log(employeeData);
    // return employeeData;
}

function previewPhoto(event) {
    var $input = $(this);
    var inputFiles = this.files;
    if (inputFiles == undefined || inputFiles.length == 0) return;
    var inputFile = inputFiles[0];

    var reader = new FileReader();
    reader.onload = function (event) {
        $('.js-photo').attr("src", reader.result);
    };
    reader.onerror = function (event) {
        alert("ERROR: " + event.target.error.code);
    };
    reader.readAsDataURL(inputFile);
}

function handleSubmit(event) {
    event.preventDefault();
    console.log("handleSubmit");
    let settings = {
        jwToken: STATE.authUser.jwToken,
        formData: getFormData()
    }
    HTTP_MODULE.createOneWithFile(settings)
    .then(employee => {
        console.log(JSON.stringify(employee))
    })
}

function watchSubmitButtons() {
    $('.js-form').on('submit', '.js-submit-button', handleSubmit);
    console.log("watchButtons");

}

function watchCalendarsAndPhoto() {
    $('.js-photo').on('change', previewPhoto);
    $('#employment-date').datepicker();
    $('.training').on('focus', 'input', function (e) {
       e.preventDefault();
    $('.training input').datepicker();
   })
   console.log("watchCalendars");
}

function generateButtons() {
    $('.js-submit-button').text("Save");
    $('.js-helper-button').text("Reset").attr("type", "reset");
}

function main() {
   STATE.employeeId = employeeId;
    STATE.authUser = CACHE.getAuthenticatedUserFromCache();

    HTTP.getAllOptions({
        jwToken: STATE.authUser.jwToken
    })
    .then(data => {
        CACHE.saveOptionsIntoCache(data);
        CACHE.getOptionsFromCache();
    })
    .then(options => {
        displayAllOptions(options);
        generateButtons();
        watchCalendarsAndPhoto();
        watchSubmitButton(); 

    })
   
}
// Do this when the page loads
$(main);