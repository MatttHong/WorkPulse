const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/invite");
const { validateSession } = require('../controllers/session'); 
const { checkBodyForLongValues, validateAndFormatEmailParams } = require('../controllers/filter'); 

router.use(checkBodyForLongValues, validateAndFormatEmailParams);
// router.use(validateSession);

router.post('', validateSession, inviteController.inviteUser);

router.put('', inviteController.acceptInvite);

module.exports = router;