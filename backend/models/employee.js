const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({

    userid: { type: String, default: ""},
    email: { type: String, required: true},
    logs: { type: [String], default: [], required: true},
    employees: { type: [String], default: [], required: true},
    businessId: { type: String, required: true},
    status: { type: String, required: true},

});

module.exports = mongoose.model("Employee", employeeSchema)