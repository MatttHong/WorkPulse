const mongoose = require("mongoose");
const { Schema } = mongoose;
const uuid = require('uuid');
const Organization = require("../models/organization"); 
const Department = require("../models/department");
const Status = require('../utils/status');


const employeeSchema = new Schema({
  userId: { type: String, default: "" },
  email: { type: String, required: true },
  logs: { type: [String], default: [], required: true },
  employees: { type: [String], default: [], required: true },
  orgId: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    default: Status.invited,
    enum: Object.values(Status)
  },
  inviteToken: {
    type: String,
    required: false,
  },
  inviteTokenExpiration: {
    type: Date,
    required: false,
  },
  tasks: [String]
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

employeeSchema.methods.addToOrg = function () {
    return new Promise((resolve, reject) => {
      Organization.findById(this.orgId)
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

// employeeSchema.methods.addToDepartment = function () {
// return new Promise((resolve, reject) => {
//     Department.findOne({ departmentName: this.departmentName })
//     .then(department => {
//         if (!department) {
//         reject(new Error("Department not found."));
//         return;
//         }

//         // Check if the employee's ID is not in the department's employees array
//         if (!department.employees.includes(this._id.toString())) {
//         department.employees.push(this._id);
//         return department.save();
//         }
//     })
//     .then(() => {
//         resolve("Operation successful.");
//     })
//     .catch(err => {
//         reject(err);
//     });
// });
// };
  
  module.exports = mongoose.model("Employee", employeeSchema);