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
    let numberOfTrainings = getOptions().trainings.length;
  
    for (let i = 1; i <= numberOfTrainings; i++) {
        let trainingDate = $(`#training-date${i}`).val();
        if (trainingDate) {
            trainings.push({
                trainingInfo: { _id: $(`#training${i}`).val() },
                trainingDate
            });
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
    formData.allowVehicle = $('#vehicle').val();
    formData.licensePlates = getLicensePlatesValues();
    formData.trainings = getTrainingsFromEmployeeForm();
    $('#js-employee-form')[0].reset();
    return formData;
}

function fillDepartmentForm(data, dataName) {
     $('#departmentName').val(data[`${dataName}Name`]);
    return data;
}

function fillTrainingForm(data, dataName) {
    $('#training-title').val(data.title);
    $('#expiration-time').val(new Date(data.expirationTime).getTime()/(1000*60*60*24));
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

function fillLicensePlatesValues(data) {
    if (data.licensePlates.length > 0) {
        for (let index=0; index < data.licensePlates.length; index++) {
            $(`#license-plate${index+1}`).val(data.licensePlates[index]);
        }
    }
    return data;
}

function fillTrainingOptions(data, dataName) {
    if (data.trainings.length > 0) {
        let index = 1;
        data.trainings.forEach(item => {
            $(`#training${index}`).val(item.trainingInfo._id);
            $(`#training-date${index}`).val(new Date(item.trainingDate).toLocaleDateString("en-US"));
            index++;
        });
    }
    return data;
}

function fillEmployeeForm(data, dataName) {
    $('#first-name').val(data.firstName);
    $('#last-name').val(data.lastName);
    $('#vehicle').attr("checked", data.allowVehicle);
    $('#employer').val(data.employer._id);
    $('#department').val(data.department._id);
    $('#employment-date').val(new Date(data.employmentDate).toLocaleDateString("en-US"));
    fillTrainingOptions(data, "training");
    return fillLicensePlatesValues(data);
  
} 

function renderUpdateForm(id, dataName, origin, data) {
    clearScreen();
    return screens[dataName].render(id, origin, data);
}


