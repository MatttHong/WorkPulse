const mongoose = require("mongoose");

const organizationSchema = mongoose.Schema({

    organizationName : { type: String, required: true },
    organizationEmail : { type: String, required: true },
    employees : { type: [String], default: [], required: true},
    imageLink: { type: String, required: false },
    industry : { type: [String], default: [], required: true},
    tasks : { type: [String], default: [], required: true},
    departments: { type: [String], default: [], required: true},

});

module.exports = mongoose.model("Organization", organizationSchema)