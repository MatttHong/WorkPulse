const User = require("../models/user");
const { generateSalt, hash, compare } = require('../utils/salt.js');
const { createSession } = require('../controllers/session')
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    try {
        
        let email = req.body.email;
        let password = req.body.password;
        
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                type: "Not Found",
                message: "Wrong Login Details"
            });
        }

        // Use try-catch block to handle errors from the compare function
        try {
            let match = await compare(password, user.password);
            if (match) {
                const token = await createSession(user._id.toString());

                res.status(200).json({
                    status: "Success",
                    message: "Correct Details",
                    token: token,
                    data: user
                    // email: email,
                    // id: user._id
                });
            } else {
                res.status(400).json({
                    type: "Invalid Password",
                    message: "Wrong Login Details"
                });
            }
        } catch (error) {
            // Handle errors from the compare function here
            console.error(error);
            res.status(500).json({
                type: "Internal Server Error",
                message: "An error occurred during password comparison."
            });
        }
    } catch (err) {
        // Handle errors from the User.findOne function here
        console.error(err);
        res.status(500).json({
            type: "Internal Server Error",
            message: "An error occurred during user lookup."
        });
    }
};
