const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task"); 
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(validateSession, checkBodyForLongValues, validateAndFormatEmailParams);

router.post('', taskController.createTask);

router.put('/:id', taskController.updateTask);

router.get('/:id', taskController.getTaskById);

router.get('', taskController.getTasks);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
