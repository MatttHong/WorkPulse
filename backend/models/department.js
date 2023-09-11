const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({

    departmentName : { type: String, required: true },
    departmentAdminstrators : { type: [String], required: true },
    employees : { type: [String], default: [], required: true},
    projects : { type: [String], default: [], required: true},

});

module.exports = mongoose.model("Department", departmentSchema)