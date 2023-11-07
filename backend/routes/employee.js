const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee');
const { validateSession } = require('../controllers/session'); 

router.use(validateSession);

router.get('/:id', employeeController.getEmployeeById);

router.get('/byUserId/:userId', employeeController.getEmployeesByUserId);

router.put('/:id', employeeController.updateEmployee);

router.delete('/:id', employeeController.deleteEmployeeModel);

module.exports = router;
