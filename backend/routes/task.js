const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task"); 
const { validateSession } = require('../controllers/session'); 

router.use(validateSession);

router.post('', taskController.createTask);

router.put('/:id', taskController.updateTask);

router.get('/:id', taskController.getTaskById);

router.get('', taskController.getTasks);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
