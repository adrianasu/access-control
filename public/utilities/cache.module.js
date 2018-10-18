
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

// endpoint refers to the name of the data (employee, departmemt, employer, training or user)
// data is the information available at that moment
// screen is the one renderd
function getSiteStatus() {
    const origin = localStorage.getItem('origin');
    const data = localStorage.getItem('data');
    const render = localStorage.getItem('render');
    if(origin) {
        return {
            origin, data, render
        };
    }
    else {
        return undefined;
    }
}

function saveSiteStatus(status) {
    localStorage.setItem('origin', status.origin);
    localStorage.setItem('data', status.data);
    localStorage.setItem('render', status.render);

}

function deleteSiteStatus() {
    localStorage.removeItem('origin');
    localStorage.removeItem('data');
    localStorage.removeItem('render');
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


