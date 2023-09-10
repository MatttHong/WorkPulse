const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    
    userName : { type: String, required: true },
    password : { type: String, required: true },
    firstName : { type: String, default: "", required: true },
    lastName : { type: String, default: "", required: false },
    email : { type: String, required: true },
    birthday : {type: String, required: true },
    bio : {type: String, required: true },
    role : {type: [String], default: [], required: true },

});

module.exports = mongoose.model("User", userSchema);