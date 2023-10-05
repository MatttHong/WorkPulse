const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    
    userName : { type: String, required: false },
    // salt: { type: String, required: true},
    password : { type: Object, default: "fillthisin", required: true },
    firstName : { type: String, default: "", required: false },
    lastName : { type: String, default: "", required: false },
    email : { type: String, required: true },
    birthday : {type: String, required: false },
    bio : {type: String, required: false },
    employments : {type: [String], default: [], required: true },
    reviews : {type: [Object], default: [], required: true},

});

module.exports = mongoose.model("User", userSchema);