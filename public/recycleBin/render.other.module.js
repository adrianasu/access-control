

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
    event.preventDefault();
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

function watchPhoto() {
    //$('.js-form').on('change', '#js-photo-input', previewPhoto);
}
