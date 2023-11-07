const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/invite");
const { validateSession } = require('../controllers/session'); 

// router.use(validateSession);

router.post('', validateSession, inviteController.inviteUser);

router.put('', inviteController.acceptInvite);

module.exports = router;