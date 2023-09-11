const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/invite");

router.post("", inviteController.inviteUser);

module.exports = router;