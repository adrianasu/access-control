

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




function getDataFromTable() {



}

function renderEmployeeForm() {

    let formString = `<img src="" alt="" class="js-photo">
        <form enctype="multipart/form-data" method="POST" name="employeeInfo" class="js-employee-form">
            <input type="file" accept="image/*" id="js-photo-input" name="photo-file" autofocus required>
            <fieldset name="personal-information">
                <label for="employee-id">Employee ID</label>
                <input type="text" id="employee-id" required>
                <label for="first-name">First Name</label>
                <input type="text" id="first-name" required>
                <label for="last-name">Last Name</label>
                <input type="text" id="last-name" required>
            </fieldset>
            <fieldset name="employment-information">
                <label for="employment-date">Employed since</label>
                <input type="text" id="employment-date" size="30">
                <label for="employer">Employed by</label>
                <select id="employer" required></select>
                <label for="department">Department</label>
                <select id="department" required></select>
            </fieldset>
            <fieldset name="training" class="training">
            </fieldset>
            <input type="checkbox" id="vehicle" name="vehicle" value="true" required>
            <label for="vehicle">Allow vehicle on-site</label>
            <label for="license-plate">License Plates</label>
            <input type="text" id="license-plate1" placeholder="License Plate">
            <input type="text" id="license-plate2" placeholder="License Plate">
            <button role="button" type="reset" class="js-main-button"></button>
            <button role="button" type="button" class="js-helper-button"></button>
        </form>`;

    $('.js-form').html(formString).show();
    renderSearchBar();

}

function generateButtons() {
    $('.js-submit-button').text("Save");
    $('.js-helper-button').text("Cancel").attr("type", "button");
}

function prepareEmployeeFormData(employeeId) {
    let employeeData, optionsData;
    STATE.authUser = getAuthenticatedUserFromCache();
    let jwToken = STATE.authUser.jwToken;

    if (getOptionsFromCache === undefined) {
        return HTTP.getAllOptions({
                jwToken
            })
            .then(optionsData => {
                saveOptionsIntoCache(optionsData);
            })
    } else {
        optionsData = getOptionsFromCache();
    }

    if (STATE.employeeId === employeeId) {
        employeeData = STATE.employee;
    } else {
        let settings = { jwToken, 
            endpoint: "employee",
            id: employeeId,
            onSuccess: res => {
                STATE.employeeId = res.employeeId;
                STATE.employee = res;
            }
        }
        return getById(settings);
    }

}


