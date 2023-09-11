const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    
    userName : { type: String, required: true },
    password : { type: String, required: Object },
    firstName : { type: String, default: "", required: true },
    lastName : { type: String, default: "", required: false },
    email : { type: String, required: true },
    birthday : {type: String, required: true },
    bio : {type: String, required: true },
    companies : {type: [String], default: [], required: true },
    logs: {type: [String], default: [], required: true},

});

module.exports = mongoose.model("User", userSchema);