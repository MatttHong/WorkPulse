const emailNewUser = require('../utils/smtps.js');
const Employee = require('../models/employee'); // Import your Mongoose model for employees
const Status = require('../utils/status'); // Import your Mongoose model for employees

// Define the inviteUser controller function
// exports.inviteUser = (req, res) => {
//     const { businessId, email, header, body } = req.body;

//     // Check if email, header, and body are provided in the request body
//     if (!businessId || !email || !header || !body) {
//         return res.status(400).json({ error: 'Email, header, and body are required.' });
//     }

//     Employee.findOne({ email, businessId }, (err, existingEmployee) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: 'Internal server error' });
//         }
    
//         if (existingEmployee) {
//           // Employee with the same email and businessId found; proceed with sending an email
//           emailNewUser(email, header, body);
//         } else {
//           // Create a new employee object with default values
//           const newEmployee = new Employee({
//             email,
//             businessId,
//             status: Status.invited,
//             // Add any other default values from your Employee model here
//           });
    
//           // Save the new employee object to the database
//           newEmployee.save((saveErr) => {
//             if (saveErr) {
//               console.error(saveErr);
//               return res.status(500).json({ error: 'Error creating employee' });
//             }
    
//             // Proceed with sending an email
//             emailNewUser(email, header, body);
//             });
//         }
//     });
//     // Call the emailNewUser function to send the invitation email

//     // Respond with a success message or handle errors from the emailNewUser function
//     res.status(200).json({ message: 'Invitation email sent successfully.' });
// };

exports.inviteUser = async (req, res) => {
    try {
        const { businessId, email, header, body } = req.body;
  
         // Check if email, header, and body are provided in the request body
        if (!businessId || !email || !header || !body) {
            return res.status(400).json({ error: 'Email, header, and body are required.' });
        }
  
        // Use async/await to query the employee
        const existingEmployee = await Employee.findOne({ email, businessId });
  
        if (existingEmployee) {
        // Employee with the same email and businessId found; proceed with sending an email
            emailNewUser(email, header, body);
        } else {
            // Create a new employee object with default values
            const newEmployee = new Employee({
                email,
                businessId,
                status: Status.invited,
                // Add any other default values from your Employee model here
            });
    
            // Save the new employee object to the database
            await newEmployee.save();
    
            // Proceed with sending an email
            emailNewUser(email, header, body);
        }
  
        // Respond with a success message
        res.status(200).json({ message: 'Invitation email sent successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
  

exports.acceptInvite = async (req, res, next) => {
    try {
        // Check if the required fields are present in the request body
        const { employeeId, userId, email } = req.body;
        
        if (!employeeId || !userId || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // Find the employee by their ID
        const employee = await Employee.findById(employeeId);
    
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
    
        // Update the employee object with the new userId and status
        employee.userId = userId;
        employee.status = Status.onboarding;
    
        // Save the updated employee object in the database
        await employee.save();
    
        // Respond with a success message
        return res.status(200).json({ message: 'Employee updated successfully' });
        } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};