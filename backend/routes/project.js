const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project"); 
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(validateSession, checkBodyForLongValues, validateAndFormatEmailParams);

router.post('', projectController.createProject);

router.put('/:id', projectController.updateProject);

router.get('/:id', projectController.getProjectById);

router.get('', projectController.getProjects);

router.delete('/:id', projectController.deleteProject);

module.exports = router;
