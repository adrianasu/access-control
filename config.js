"use strict";
exports.DATABASE_URL =
    process.env.DATABASE_URL || 'mongodb://localhost/employees-app';
exports.TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-employees-app';
exports.PORT = process.env.PORT || 8080;