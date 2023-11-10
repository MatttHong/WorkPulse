const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({

    taskName : { type: String, required: true },
    taskAdministrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: true},
    status : { type: String, default: [], required: true },

});

module.exports = mongoose.model("Task", taskSchema)