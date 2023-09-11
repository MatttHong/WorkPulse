const mongoose = require("mongoose");

const logSchema = mongoose.Schema({

    employee : { type: String, required: true },
    task : { type: String, required: true },
    department : { type: [String], default: [], required: true},
    status : { type: String, default: [], required: true },
    log : [{
        string: { type: String, required: true },
        timestamp: { type: Date, required: true },
        int: { type: Number, required: true }
    }] 

});

module.exports = mongoose.model("Log", logSchema)