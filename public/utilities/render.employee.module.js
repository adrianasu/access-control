window.RENDER_EMPLOYEE_MODULE = {
    renderEmployeeOverview,
    handleLogOut
};

function handleLogOut(event) {
    const confirmation = confirm('Are you sure you want to logout?');
    if (confirmation) {
        CACHE.deleteAuthenticatedUserFromCache();
        window.open('/auth/login.html', '_self');
    }
}

function getEmployeeInfo(employee) {
    let vehicle = (employee.allowVehicle) ? "Yes" : "No";
    return `<tr><th>${employee.firstName} ${employee.lastName}</th></tr>
            <tr><td>Allow Vehicle</td><td>${vehicle}</td></tr>
            <tr><td>License Plates</td><td>${employee.licensePlates}</td></tr>
            <tr><td>Employee ID</td><td>${employee.employeeId}</td></tr>
            <tr><td>Employer</td><td>${employee.employer.employerName}</td></tr>
            <tr><td>Department</td><td>${employee.department.departmentName}</td></tr>`;
}

function displayTrainingData(missingRequirements) {
      if (missingRequirements.length > 0) {
        $('.box').addClass('red').removeClass('green');
        $('.box p:nth-child(2)').text("Do Not Enter");
        $('.box p:nth-child(3)').text(`${missingRequirements.join(", ")} training required`);
    } else {
        $('.box').addClass('green').removeClass('red');
    }
}

function displayEmployeeData(employee) {
    $('.box img').attr('src', employee.photo)
        .attr('alt', `${employee.firstName} ${employee.lastName}`);
    $('table').html(getEmployeeInfo(employee));
}

// in this case our requirements are trainings and
// its validation is included in the ready2work property
function checkForMissingRequirements(employee) {
    return employee.ready2work.map(requirement => !requirement.title);
}

function renderEmployeeOverview(employee) {
    displayEmployeeData(employee);
    let missing = checkForMissingRequirements(employee);
    displayTrainingData(missing);
}