const express = require("express");
const router = express.Router();
const overRideController = require("../controllers/override"); 

router.delete('/:id', overRideController.deleteModel);

module.exports = router;
