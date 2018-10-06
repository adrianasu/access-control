window.RENDER_EMPLOYEE_MODULE = {
    renderEmployeeForm
};

////let State ={};

const HISTORY = window.HISTORY_MODULE;


function renderEmployeeForm(data, id) {
    changeSiteState("employeeForm", id);
  
    let formString =  `<img src="" alt="" class="js-photo">
        <form enctype="multipart/form-data" method="POST" name="employeeInfo" class="js-employee-form">
            <input type="file" accept="image/*" id="js-photo-input" name="photo-file" required>
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
}

