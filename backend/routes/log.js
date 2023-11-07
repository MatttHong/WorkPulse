const express = require('express');
const router = express.Router();
const logController = require('../controllers/log');

// Route to create a new log
router.post('/logs', logController.createLog);

// Route to update a log by ID
router.put('/logs/:id', logController.updateLog);

// Route to get all logs
router.get('/logs', logController.getLogs);

// Route to get a log by ID
router.get('/logs/:id', logController.getLogById);

// Route to delete a log by ID
router.delete('/logs/:id', logController.deleteLog);

// Route to end a log session
router.patch('/logs/:id/end', logController.endLogSession);

// Route to get logs by employee ID
router.get('/logs/employee/:employeeId', logController.getLogsByEmployeeId);

// Route to add a log entry to an existing log
router.put('/logs/:id/entry', logController.addLogEntry);

module.exports = router;
