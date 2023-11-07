const User = require("../models/user");
const { generateSalt, hash, compare } = require('../utils/salt.js');
const { createSession } = require('../controllers/session')
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    // console.log("passed")
    try {
        // let { email, password } = req.body;
        // let email = "gabe@denton";
        let email = req.body.email;
        // let password = "poopscoop";
        let password = req.body.password;
        // console.log(email);
        // console.log(password);
        // console.log("a");
        // console.log('here')
        let user = await User.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            });
        }

        // Use try-catch block to handle errors from the compare function
        try {
            console.log(user.password)
            let match = await compare(password, user.password);
            if (match) {
                const token = await createSession(user._id.toString());
                // if(!process.env.JWT_SECRET) {
                //     return res.status(500).json({
                //         type: "Internal Server Error",
                //         msg: "JWT_SECRET is not set in the environment."
                //     });
                // }
// IDK Where this came from but its really bad
                // const token = jwt.sign({
                //         userId: user._id,
                //         email: user.email
                //     },
                //     process.env.JWT_SECRET,
                //     {
                //         expiresIn: '8h'
                //     });

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
                    msg: "Wrong Login Details"
                });
            }
        } catch (error) {
            // Handle errors from the compare function here
            console.error(error);
            res.status(500).json({
                type: "Internal Server Error",
                msg: "An error occurred during password comparison."
            });
        }
    } catch (err) {
        // Handle errors from the User.findOne function here
        console.error(err);
        res.status(500).json({
            type: "Internal Server Error",
            msg: "An error occurred during user lookup."
        });
    }
};
