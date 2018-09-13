let MOCK_EMPLOYERS = {
    employers: ["Handy Manny", "Metal Works", "Big Guys", "The Other Guys"]
}

let MOCK_DEPARTMENTS = {
    departments: ["Maintenance", "Administration", "Quarry", "Warehouse"]
}

let MOCK_TRAININGS = {
    trainings: ["Safety First", "Always Safe", "Take care"]
}

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
                "required": ["Take Care"]
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
    if (data.employeeData.img) {
        $('.js-photo').attr('src', data.employeeData.img)
                 .attr('alt', `${data.employeeData.firstName} ${data.employeeData.lastName}`);
    }
}

function displayOptions(data) {
    let options = [];
    data.forEach(option => {
        options.push(`<option value=${option}>${option}</option>`);
    });
    return options.join("");
}

function displayDate(index) {
    return `<input type="date" id="training${index}">`;
}

function displayTrainings(data) {
    let trainings = [];
    let index = 0;
    trainings.push(`<legend>Trainings</legend>`);
    data.forEach(training => {
        index+=1;
        trainings.push(`<select id="training${index}">`);
        trainings.push(displayOptions(data));
        trainings.push(displayDate(index));
        trainings.push(`</select>`);
    })
    return trainings.join("");
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
        callbackFn(MOCK_EMPLOYEE_DATA);
        $() 
        $('#employer').html(displayOptions(MOCK_EMPLOYERS.employers)); 
        $('#department').html(displayOptions(MOCK_DEPARTMENTS.departments));
        $('.trainings').html(displayTrainings(MOCK_TRAININGS.trainings))
    }, 1);
}

function getAndDisplayEmployeeData() {
    getEmployeeData(displayEmployeeData);
}

// Do this when the page loads 
$(function() {
    getAndDisplayEmployeeData();
})