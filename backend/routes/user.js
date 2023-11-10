const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { validateSession } = require('../controllers/session'); 

// router.use(validateSession);

router.post('', userController.createUser);

router.put('/:id', userController.updateUser);

router.get('/email/:email', userController.getUserByEmail);

router.get('/:id', userController.getUserById);

router.get('', userController.getUsers);

router.delete('/:id', userController.deleteUser);

module.exports = router;