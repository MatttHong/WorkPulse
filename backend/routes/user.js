const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const checkAuth = require("../utils/check-auth");
const { validateSession } = require('../controllers/session'); 

// router.use(validateSession);

router.post('', userController.createUser);

router.put('/:id', validateSession, userController.updateUser);

router.get('/email/:email', validateSession, userController.getUserByEmail);

router.get('/:id', validateSession, userController.getUserById);

router.get('', validateSession, userController.getUsers);

router.delete('/:id', validateSession, userController.deleteUser);

module.exports = router;