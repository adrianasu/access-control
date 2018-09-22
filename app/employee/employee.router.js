const express = require('express');
const Joi = require('joi');
const employeeRouter = express.Router();

const { HTTP_STATUS_CODES } = require('../config');
const { jwtPassportMiddleware } = require('../auth/auth.strategy');
const { Employee, EmployeeJoiSchema } = require('./employee.model');