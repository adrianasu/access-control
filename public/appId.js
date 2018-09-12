let MOCK_EMPLOYEE_DATA = {
    "employeeData" : [
        {
            "id": 12345,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "John",
            "lastName": "Smith",
            "employer": "Handy Manny",
            "department": "Maintenance",
            "licensePlates": "2ABC1234",
            "ready2work": {
                "status": "true",
                "required": []
            }
        },
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
        },
        {
            "id": 62345,
             "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "David",
            "lastName": "Salomon",
            "employer": "Metal Works",
            "department": "Maintenance",
            "licensePlates": "2ABX578",
            "ready2work": {
                "status": "true",
                "required": []
            }
        }, {
            "id": 73456,
             "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Sally",
            "lastName": "Miller",
            "employer": "Metal Works",
            "department": "Administration",
            "licensePlates": "1ZBC1458",
            "ready2work": {
                "status": "false",
                "required": ["Training Two"]
            }
        }, {
            "id": 92345,
             "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Dilan",
            "lastName": "Lee",
            "employer": "Big Guys",
            "department": "Maintenance",
            "licensePlates": "3APC194",
            "ready2work": {
                "status": "true",
                "required": []
            }
        }, {
            "id": 23499,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Olaf",
            "lastName": "Elliot",
            "employer": "Big Guys",
            "department": "Administration",
            "licensePlates": "7ZBC1784",
            "ready2work": {
                "status": "false",
                "required": ["Training Two"]
            }
        }
    ]
}


function displayEmployeeData(data) {
    if(data.employeeData.upToDate.status === "false") {
        $('.box').addClass('red').removeClass('blue');
    }
    else {
        $('.box').addClass('green').removeClass('blue');
    }
    $('.box img').attr('src', data.employeeData.img)
                 .attr('alt', `${data.employeeData.firstName} ${data.employeeData.lastName}`);
    $('.container').html(getXXXX)

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
    getEmployeeInfo(displayEmployeeData);
}

// Do this when the page loads 
$(function() {
    getAndDisplayEmployeeData();
})