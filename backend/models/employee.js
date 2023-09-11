const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({

    userid: { type: String, required : true},
    logs: { type: [String], required: true},
    lead: { type: [String], required: true},
    employees: { type: [String], required: true},
    

});

module.exports = mongoose.model("Employee", employeeSchema)