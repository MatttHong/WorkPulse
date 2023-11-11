const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(validateSession, checkBodyForLongValues, validateAndFormatEmailParams);

router.get('/:id', employeeController.getEmployeeById);

router.get('', employeeController.getEmployees);

router.get('/byUserId/:userId', employeeController.getEmployeesByUserId);

router.put('/:id', employeeController.updateEmployee);

router.delete('/:id', employeeController.deleteEmployeeModel);

module.exports = router;
