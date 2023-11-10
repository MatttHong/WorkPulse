const express = require("express");
const router = express.Router();
const orgController = require("../controllers/organization");
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(validateSession, checkBodyForLongValues, validateAndFormatEmailParams);

router.post('', orgController.createOrg);

router.put('/:id', orgController.updateOrg);

router.get('/:id', orgController.getOrgById);

router.get('', orgController.getOrgs);

router.delete('/:id', orgController.deleteOrg);

module.exports = router;