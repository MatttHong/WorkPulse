const express = require("express");
const router = express.Router();
const depController = require("../controllers/department");
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(validateSession, checkBodyForLongValues, validateAndFormatEmailParams);

router.post('', depController.createDept);

router.put('/:id', depController.updateDept);

router.get('/:id', depController.getDeptById);

router.get('', depController.getDepts);

router.delete('/:id', depController.deleteDept);

module.exports = router;