const User = require("../models/user");
const { generateSalt, hash, compare } = require('../utils/salt.js');

exports.createUser = (req, res, next) => {
    // console.log('got createUser req');
    let salt = generateSalt(10);

    const user = new User({
        userName: req.body.userName,
        password: await hash(req.body.password, salt),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        bio: req.body.bio,
        companies: req.body.companies,
        logs: req.body.logs,
    });
    // console.log(user);
    User.findOne({
        email: user.email 
    })
    .then(foundUser => {
        if (!foundUser) {
            return user.save();
        } else {
            throw new Error("User already exists.");
        }
    })
    .then((result) => {
        res.status(201).header('Content-Type', 'application/json').json({
            message: "User added successfully",
            post: {
                ...result.toObject(),
                id: result._id,
            },
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).header('Content-Type', 'application/json').json({
            message: err.message || "Fail to create user!",
        });
    });
};

// module.exports = (app) => {
//     const {
//         generateSalt,
//         hash,
//         compare
//     } = require('./index');
//     let salt = generateSalt(10);
//     app.post('/register', async (req, res) => {
//         try {
//             let user = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: await hash(req.body.password, salt) // dont remove the await
//             })
//             let response = await user.save();
//             res.status(200).json({
//                 status: "Success",
//                 data: response
//             })
//         } catch (err) {
//             //handle error
//         }
//     });
// }