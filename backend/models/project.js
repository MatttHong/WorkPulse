const mongoose = require("mongoose");
const Status = require('../utils/status');

const projectSchema = mongoose.Schema({

    projectName : { type: String, required: true },
    projectAdministrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: true},
    tasks : { type: [String], default: [], required: true},
    departments: { type: [String], default: [], required: true},
    status: {
        type: String,
        required: true,
        enum: Object.values(Status),
        default: Status.active
      },

});

module.exports = mongoose.model("Project", projectSchema)