const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("", userController.createUser);

// router.put("/:id", userController.updateUser);

// router.get("", userController.getUser);

// router.get("/:id", userController.getUserById);

// router.delete("/:id", userController.deleteUser);

module.exports = router;