const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({

    departmentName : { type: String, required: true },
    departmentAdministrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: false},
    projects : { type: [String], default: [], required: false},

});

module.exports = mongoose.model("Department", departmentSchema)