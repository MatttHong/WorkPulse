const mongoose = require("mongoose");
const Status = require('../utils/status');


const taskSchema = mongoose.Schema({

    taskName : { type: String, required: true },
    taskAdministrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: true},
    status: {
        type: String,
        required: true,
        enum: Object.values(Status),
        default: Status.active
    },
});

module.exports = mongoose.model("Task", taskSchema)