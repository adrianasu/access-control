
function getAuthenticatedUserFromCache() {
    const jwToken = localStorage.getItem('jwToken');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const accessLevel = parseInt(localStorage.getItem('accessLevel'), 10);

    if(jwToken) {
        return {
            jwToken, userid, username, name, email, accessLevel
        };
    }
    else {
        return undefined;
    }
}

function saveAuthenticatedUserIntoCache(user) {
    localStorage.setItem('jwToken', user.jwToken);
    localStorage.setItem('userid', user.id);
    localStorage.setItem('username', user.username);
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.email);
    localStorage.setItem('accessLevel', user.accessLevel);
}

function deleteAuthenticatedUserFromCache() {
        localStorage.removeItem('jwToken');
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('accessLevel');  
}

function getOptionsFromCache() {
    const opt = localStorage.getItem('options');
    if (opt) {
        return JSON.parse(opt);
    } else {
        return undefined;
    }    
}

function saveOptionsIntoCache(res) {
    localStorage.setItem('options', JSON.stringify(res));
}

function deleteOptionsFromCache() {
    localStorage.removeItem('options');
}

function getEmployeeFromCache() {
    const employee = localStorage.getItem('employee');
    if (employee) {
        return JSON.parse(employee);
    } else {
        return undefined;
    }
}

function saveEmployeeIntoCache(res) {
    localStorage.setItem('employee', JSON.stringify(res));
}

function deleteEmployeeFromCache() {
    localStorage.removeItem('employee');
}

function getEmployeeIdsFromCache() {
    const ids = localStorage.getItem('ids');
    if (ids) {
        return ids;
    } else {
        return undefined;
    }
}

function saveEmployeeIdsIntoCache(ids) {
    localStorage.setItem('ids', ids);
}

function deleteEmployeeIdsFromCache() {
    localStorage.removeItem('ids');
}


