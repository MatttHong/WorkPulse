const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require('uuid');
const Organization = require("../models/organization"); 

const employeeSchema = new Schema({
  userid: { type: String, default: "" },
  email: { type: String, required: true },
  logs: { type: [String], default: [], required: true },
  employees: { type: [String], default: [], required: true },
  businessId: { type: String, required: true },
  status: { type: String, required: true },
  inviteToken: {
    type: String,
    required: false,
  },
  inviteTokenExpiration: {
    type: Date,
    required: false,
  },
});

// Function to generate and set the inviteToken
employeeSchema.methods.generateInviteToken = function () {
  const token = uuid.v4();
  const expirationTimestamp = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours in milliseconds
  this.inviteToken = token;
  this.inviteTokenExpiration = expirationTimestamp;
};

// Function to check if an invite token is valid
employeeSchema.statics.isInviteTokenValid = async function (token) {
  const employee = await this.findOne({ inviteToken: token });
  if (!employee || !employee.inviteTokenExpiration) {
    return false; // Token not found or expiration timestamp not set
  }

  const currentTimestamp = new Date();
  return currentTimestamp <= employee.inviteTokenExpiration;
};

employeeSchema.methods.addToBusiness = function () {
    return new Promise((resolve, reject) => {
      Organization.findById(this.businessId)
        .then(org => {
          if (!org) {
            reject(new Error("Organization not found."));
            return;
          }
  
          // Check if the employee's ID is not in the organization's employees array
          if (!org.employees.includes(this._id.toString())) {
            org.employees.push(this._id);
            return org.save();
          }
        })
        .then(() => {
          resolve("Operation successful.");
        })
        .catch(err => {
          reject(err);
        });
    });
  };  

  module.exports = mongoose.model("Employee", employeeSchema);