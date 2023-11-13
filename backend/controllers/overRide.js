const Department = require("../models/department");
const Employee = require("../models/employee");
const Logs = require("../models/logs");
const Organization = require("../models/organization");
const Project = require("../models/project");
const Task = require("../models/tasks");
const User = require("../models/user");

exports.deleteModel = (req, res, next) => {
    const id = req.params.id;
    let modelType = req.body.type;
    modelType = modelType.toLowerCase();
    const routeToModelType = {
        users: 'user',
        auth: 'auth',
        invite: 'invite',
        org: 'organization',
        orgs: 'organization',
        task: 'task',
        dep: 'department',
        employee: 'employee',
        log: 'logs',
        proj: 'project'
      };
    if(routeToModelType[modelType]){
        modelType = routeToModelType[modelType];
    }

    // Check the value of modelType and delete the corresponding model
    switch (modelType) {
      case 'department':
        Department.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Department not found' });
            } else {
              res.status(200).json({ message: 'Department deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
      
      case 'employee':
        Employee.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Employee not found' });
            } else {
              res.status(200).json({ message: 'Employee deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      case 'logs':
        Logs.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Logs not found' });
            } else {
              res.status(200).json({ message: 'Logs deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      case 'organization':
        Organization.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Organization not found' });
            } else {
              res.status(200).json({ message: 'Organization deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      case 'project':
        Project.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Project not found' });
            } else {
              res.status(200).json({ message: 'Project deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      case 'task':
        Task.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'Task not found' });
            } else {
              res.status(200).json({ message: 'Task deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      case 'user':
        User.findByIdAndRemove(id)
          .then((result) => {
            if (!result) {
              res.status(404).json({ message: 'User not found' });
            } else {
              res.status(200).json({ message: 'User deleted successfully' });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
          });
        break;
  
      default:
        res.status(400).json({ message: 'Invalid modelType' });
    }
  };
  
