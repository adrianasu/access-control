function getDataFromEmployerForm() {
    let employerName = $('#employerName').val();
    let departments = $('input[type=checkbox]:checked').map(function() {
        return $(this).val();
        }).get();
    $('#employerName').val("");
    $('input[type=checkbox]:checked').each(function () {
        $(this).prop("checked", false);
    });
    deleteOptionsFromCache();
    return { employerName, departments };
}

function getDataFromDepartmentForm() {
    let departmentName = $('#departmentName').val();
    $('#departmentName').val("");
    deleteOptionsFromCache();
    return { departmentName } ;
}

function getDataFromTrainingForm() {
    let title = $('#training-title').val();
    let expirationTime = new Date($('#expiration-time').val() *1000*60*60*24);
    $('#training-title, #expiration-time').val("");
    deleteOptionsFromCache();
    return { title, expirationTime };
}

function getDataFromUserForm () {
    let name = $('#name').val();
    let email = $('#email').val();
    let accessLevel = STATE.accessLevels[$('#access-level').val()];

    return { name, email, accessLevel };

}

function getTrainingsFromEmployeeForm(){
    let trainings = [];
    let index = 1;
    let thisTraining = $(`#training${index}`).val();

    while (thisTraining !== "") {
        let trainingDate = $(`#training-date${index}`).val();
        if (trainingDate) {
            trainings.push({
                trainingInfo: { _id: $(`#training${index}`).val() },
                trainingDate
            });
        }
        index++;
        if ($(`#training${index}`).val() === "") {
            break;
        }
    }
    return trainings;
}

function getLicensePlatesValues() {
    let licensePlates =[];
    let cars = 2;
    for(let i=1; i<= cars; i++) {
        if($(`#license-plate${i}`).val()) {
            licensePlates.push($(`#license-plate${i}`).val());
        }
    }
    return licensePlates;
}

function getDataFromEmployeeForm() {
    let formData = {};
    formData.employeeId = $('#employee-id').val();
    formData.firstName = $('#first-name').val();
    formData.lastName = $('#last-name').val();
    formData.employmentDate = $('#employment-date').val();
    formData.employer = {_id: $('#employer').val()};
    formData.department = {_id: $('#department').val()};
    formData.vehicle = $('#vehicle').val();
    formData.licensePlates = getLicensePlatesValues();
    formData.trainings = getTrainingsFromEmployeeForm();
    $('#js-employee-form')[0].reset();
    return formData;
}


function fillDepartmentForm(data, dataName) {
     $('#departmentName').val(data[`${dataName}Name`]);
    return data;
}

function fillUserForm(data) {
    STATE.accessLevels = data.levels;
    let accLevel;
    Object.keys(data.levels).forEach(level => {
        if (data.levels[level] === data.accessLevel) {
            accLevel = level;
        }
    }) 
    $('#name').val(data.name);
    $('#email').val(data.email);
    $('#access-level').val(accLevel);
    return data;
}

function fillEmployerForm(data, dataName) {
    if(data.departments.length > 0) {
        data.departments.forEach(department => {
            let name = department.departmentName;
            $(`#${name}`).prop("checked", true);
        });
    }
    $('#employerName').val(data[`${dataName}Name`]);
    return data;
}

function fillTrainingForm(data, dataName) {
    $('#training-title').val(data.title);
    $('#expiration-time').val(new Date(data.expirationTime).getTime()/(1000*60*60*24));
    return data;
}

function fillOptions(data, dataName) {
    if (data[dataName].length > 0) {
        let index = 1;
        data[dataName].forEach(item => {
            let name = item[dataName];
            $(`#${name}${index}`).val(item);
            index++;
        });
    }
    return data;
}

function fillEmployeeForm(data, dataName) {
  console.log(data);
    $('#first-name').val(data.firstName);
    $('#last-name').val(data.lastName);
    $('#employment-date').val(data.employmentDate);
    $('#employer').val(data.employer.employerName);
    $('#department').val(data.department.departmentName);
    $('#vehicle').val(data.allowVehicle);
    
    //fillOptions(data, "trainings");
    //formData.licensePlates = getLicensePlatesValues();
    return data;

}


function renderUpdateForm(data, id, dataName) {
    pushSiteState(dataName, id);
    return screens[dataName].render(id, data);
  
}

///////////////////////////////////////////////////////
function getDataAndPhotoFromEmployeeForm() {

    let formData = new FormData();
    formData.append("photo", $('#js-photo-input').files[0]);
    formData.append("employeeId", $('#employee-id').val());
    formData.append("firstName", $('#first-name').val());
    formData.append("lastName", $('#last-name').val());
    formData.append("employmentDate", $('#employment-date').val());
    formData.append("employer", $('#employer').val());
    formData.append("department", $('#department').val());
    formData.append("vehicle", $('#vehicle').val());
    formData.append("licensePlates", [$('#license-plate1').val(), $('#license-plate2').val()]);
    formData.append("trainings", getTrainingsFromEmployeeForm);
    
    return formData;
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


