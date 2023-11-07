const express = require('express');
const router = express.Router();
const logController = require('../controllers/log');

// Route to create a new log
router.post('', logController.createLog);

// Route to update a log by ID
router.put('/:id', logController.updateLog);

// Route to get all logs
router.get('', logController.getLogs);

// Route to get a log by ID
router.get('/:id', logController.getLogById);

// Route to delete a log by ID
router.delete('/:id', logController.deleteLog);

// Route to end a log session
router.patch('/:id/end', logController.endLogSession);

// Route to get logs by employee ID
router.get('/employee/:employeeId', logController.getLogsByEmployeeId);

// Route to add a log entry to an existing log
router.put('/:id/entry', logController.addLogEntry);

module.exports = router;
