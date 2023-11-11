const express = require("express");
const router = express.Router();
const overRideController = require("../controllers/overRide"); 

router.delete('/:id', overRideController.deleteModel);

module.exports = router;
