const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({

    projectName : { type: String, required: true },
    projectAdminstrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: true},
    tasks : { type: [String], default: [], required: true},
    departments: { type: [String], default: [], required: true},
    status : { type: String, default: [], required: true },

});

module.exports = mongoose.model("Project", projectSchema)