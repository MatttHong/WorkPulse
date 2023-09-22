const mongoose = require("mongoose");

const sessionTokenSchema = mongoose.Schema({

    employeeId : { type: String, required: true },
    Token : { type: [String], required: true },
    
});

module.exports = mongoose.model("SessionToken", sessionTokenSchema)