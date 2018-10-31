"use strict";
exports.DATABASE_URL =
    //process.env.DATABASE_URL || 'mongodb://localhost/employees-app';
    'mongodb://adriana:adriana123@ds117623.mlab.com:17623/employees-app';
exports.TEST_DATABASE_URL =
    //process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-employees-app';
    'mongodb://adriana:adriana123@ds261072.mlab.com:61072/test-employees-app';
exports.PORT = process.env.PORT || 8080;
exports.HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}
exports.JWT_SECRET = process.env.JWT_SECRET || 'default';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '20d';
