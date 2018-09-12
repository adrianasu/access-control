let MOCK_EMPLOYEE_DATA = {
    "employeeData" : 
        // {
        //     "id": 12345,
        //     "img": "https://unsplash.com/photos/XRA6DT2_ReY",
        //     "firstName": "John",
        //     "lastName": "Smith",
        //     "employer": "Handy Manny",
        //     "department": "Maintenance",
        //     "licensePlates": "2ABC1234",
        //     "ready2work": {
        //         "status": "true",
        //         "required": []
        //     }
        // },
        {
            "id": 23456,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Caleb",
            "lastName": "Kennedy",
            "employer": "Handy Manny",
            "department": "Maintenance",
            "licensePlates": "7ZBC1234",
            "ready2work": {
                "status": "false",
                "required": ["Training One"]
            }
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
    if(data.employeeData.ready2work.status === "false") {
        $('.box').addClass('red').removeClass('blue');
        $('.box p:nth-child(2)').text("Do Not Enter");
        $('.box p:nth-child(3)').text(`${data.employeeData.ready2work.required} is required`);
    }
    else {
        $('.box').addClass('green').removeClass('blue');
    }
    $('.box img').attr('src', data.employeeData.img)
                 .attr('alt', `${data.employeeData.firstName} ${data.employeeData.lastName}`);
    $('table').html(getEmployeeInfo(data));
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
    setTimeout(function() {
        callbackFn(MOCK_EMPLOYEE_DATA)}, 1);
}

function getAndDisplayEmployeeData() {
    getEmployeeData(displayEmployeeData);
}

// Do this when the page loads 
$(function() {
    getAndDisplayEmployeeData();
})