const User = require("../models/user");
const { generateSalt, hash, compare } = require('../utils/salt.js');

exports.login = async (req, res, next) => {
    try {
        // let { email, password } = req.body;
        // let email = "gabe@denton";
        let email = req.body.email;
        // let password = "poopscoop";
        let password = req.body.password;
        console.log(email);
        console.log(password);
        // console.log("a");
        let user = await User.findOne({ email: email });
        // print(user)
        if (!user) {
            return res.status(400).json({
                type: "Not Found",
                msg: "Wrong Login Details"
            });
        }

        // Use try-catch block to handle errors from the compare function
        try {
            let match = await compare(password, user.password);

            if (match) {
                res.status(200).json({
                    status: "Success",
                    message: "Correct Details",
                    data: user
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
