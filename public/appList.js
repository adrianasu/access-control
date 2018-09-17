let MOCK_DATA = {
    employers: ["Handy Manny", "Metal Works", "Big Guys", "The Other Guys"],
    departments: ["Maintenance", "Administration", "Quarry", "Warehouse"],
    trainingTitles: ["Safety First", "Always Safe", "Take Care"],
    employeeData: [{
            "id": 12345,
            "photo": "https://images.pexels.com/photos/683381/pexels-photo-683381.jpeg?cs=srgb&dl=beard-blue-sky-casual-683381.jpg&fm=jpg",
            "firstName": "John",
            "lastName": "Smith",
            "employer": "Handy Manny",
            "department": "Maintenance",
            "licensePlate": "7ZBC1234",
            "employmentDate": new Date(2017, 1, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": null
                },
                {
                    "title": "Always Safe",
                    "trainDate": new Date(2017, 1, 5)
                },
                {
                    "title": "Take Care",
                    "trainDate": new Date(2018, 4, 21)
                }
            ]
        },
        {
            "id": 23456,
            "photo": "https://images.pexels.com/photos/683381/pexels-photo-683381.jpeg?cs=srgb&dl=beard-blue-sky-casual-683381.jpg&fm=jpg",
            "firstName": "Caleb",
            "lastName": "Kennedy",
            "employer": "Handy Manny",
            "department": "Maintenance",
            "licensePlates": "7ZBC1234",
            "employmentDate": new Date(2014, 6, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": new Date(2017, 8, 5)
                },
                {
                    "title": "Always Safe",
                    "trainDate": null
                },
                {
                    "title": "Take Care",
                    "trainDate": new Date(2018, 4, 21)
                }
            ]
        },
        {
            "id": 62345,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "David",
            "lastName": "Salomon",
            "employer": "Metal Works",
            "department": "Maintenance",
            "licensePlates": "2ABX578",
            "employmentDate": new Date(2013, 1, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": new Date(2018, 4, 21)
                },
                {
                    "title": "Always Safe",
                    "trainDate": new Date(2017, 1, 5)
                },
                {
                    "title": "Take Care",
                    "trainDate": null
                }
            ]
        }, {
            "id": 73456,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Sally",
            "lastName": "Miller",
            "employer": "Metal Works",
            "department": "Administration",
            "licensePlates": "1ZBC1458",
            "employmentDate": new Date(2017, 1, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": null
                },
                {
                    "title": "Always Safe",
                    "trainDate": null
                },
                {
                    "title": "Take Care",
                    "trainDate": new Date(2018, 4, 21)
                }
            ]
        }, {
            "id": 92345,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Dilan",
            "lastName": "Lee",
            "employer": "Big Guys",
            "department": "Maintenance",
            "licensePlates": "3APC194",
            "employmentDate": new Date(2010, 1, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": null
                },
                {
                    "title": "Always Safe",
                    "trainDate": new Date(2017, 1, 5)
                },
                {
                    "title": "Take Care",
                    "trainDate": null
                }
            ]
        }, {
            "id": 23499,
            "img": "https://unsplash.com/photos/XRA6DT2_ReY",
            "firstName": "Olaf",
            "lastName": "Elliot",
            "employer": "Big Guys",
            "department": "Administration",
            "licensePlates": "7ZBC1784",
            "employmentDate": new Date(2017, 1, 5),
            "allowVehicle": true,
            "training": [{
                    "title": "Safety First",
                    "trainDate": new Date(2018, 1, 20)
                },
                {
                    "title": "Always Safe",
                    "trainDate": new Date(2017, 11, 5)
                },
                {
                    "title": "Take Care",
                    "trainDate": new Date(2018, 4, 21)
                }
            ]
        }
    ]
}

function generateHeader(data, table) {
    table.push('<tr>');
    Object.keys(data.employeeData[0]).forEach(key => {
        table.push(`<th>${key}</th>`);
    });
    table.push('</tr>');
    return table;
}

function generateRows(data, table) {
    data.employeeData.forEach(employee => {
        table.push('<tr>');
        Object.keys(employee).forEach(key => {
            table.push(`<td>${employee.key}</td>`);
        });
        table.push('</tr>');
    })
    return table;
}

function displayData(data) {
    console.log('displaydata');
    let table = [];
    table = generateHeader(data, table);
    table = generateRows(data, table);
    $('.js-results').html(table).show();
}

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function handleSearch(getEmployeeData) {
    let searchBy = $('#search-by').val();
    console.log('handleSearch');
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    setTimeout(function () {
        getEmployeeData(searchBy)
    }, 1);
    displayData(MOCK_DATA);

}

function watchButton() {
    $('.js-form').on('submit', handleSearch);
}

function main() {
    watchButton();

}

$(main);