window.CACHE_MODULE = {
    getAuthenticatedUserFromCache,
    saveAuthenticatedUserIntoCache,
    deleteAuthenticatedUserFromCache
};

function getAuthenticatedUserFromCache() {
    const jwToken = localStorage.getItem('jwToken');
    const userid = localStorage.getItem('userid');
    const username = localStorage.getItem('username');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const accessLevel = localStorage.getItem('accessLevel');

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

