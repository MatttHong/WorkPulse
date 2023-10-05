const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/invite");

router.post('', inviteController.inviteUser);

router.put('', inviteController.acceptInvite);

module.exports = router;