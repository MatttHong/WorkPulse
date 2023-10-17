const User = require("../models/user");
const { generateSalt, hash, compare } = require('../utils/salt.js');

// Create a new user (makes a hash for the password)
exports.createUser = (req, res, next) => {
    // console.log('got createUser req');
    console.error(req.body);
    console.log(req.body.password);
    let hashedpassword = hash(req.body.password)
        
    const user = new User({
        userName: req.body.userName,
        // salt: salt,
        password: hashedpassword,
        userType: req.body.userType,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthday: req.body.birthday,
        bio: req.body.bio,
        employments: req.body.employments,
        logs: req.body.logs,
    });
    console.log(user);
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

// Update a user by ID (makes a hash if the password is new)
exports.updateUser = async (req, res, next) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Update user properties as needed
        user.userName = req.body.userName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.birthday = req.body.birthday;
        user.bio = req.body.bio;
        user.userType = req.body.userType;
        user.employments = req.body.employments;
        user.reviews = req.body.reviews;

        // Check if a new password is provided and it's different from the existing one
        if (req.body.password && req.body.password !== user.password) {
            // Check if the provided password is not already hashed
            let match = await compare(req.body.password, user.password);
            if (!match) {
                let salt = generateSalt(10);
                let hashedpassword = hash(req.body.password, salt);
                user.password = hashedpassword;
            }
        }

        await user.save();

        return res.json({
            message: "User updated successfully",
            user: user.toObject(),
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message || "Failed to update user!",
        });
    }
};

//get all users 
exports.getUsers = (req, res, next) => {
    User.find()
    .then((users) => {
        res.json({
            users: users.map(user => user.toObject()),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            message: err.message || "Failed to fetch users!",
        });
    });
};

// Get a user by ID
exports.getUserById = (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId)
    .then((user) => {
        if (!user) {
            throw new Error("User not found");
        }

        res.json({
            user: user.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "User not found!",
        });
    });
};

// Delete a user by ID
exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;

    User.findByIdAndRemove(userId)
    .then((user) => {
        if (!user) {
            throw new Error("User not found");
        }

        res.json({
            message: "User deleted successfully",
            user: user.toObject(),
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "User not found!",
        });
    });
};

// Get a user by email (using a query parameter)
exports.getUserByEmail = (req, res, next) => {
    const email = req.params.email;
    console.log("email: ", email);
    User.findOne({ email })
    .then((user) => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: { ...user._doc },
            status: "Success"
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json({
            message: err.message || "User not found!",
        });
    });
};
