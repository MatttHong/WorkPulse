// import { v4 as uuidv4 } from 'uuid';

const emailNewUser = require('../utils/smtps.js');
const Employee = require('../models/employee'); // Import your Mongoose model for employees
const Status = require('../utils/status'); // Import your Mongoose model for employees
const User = require('../models/user')
const { REACTURL } = require('./environment');

exports.inviteUser = async (req, res) => {
  try {
    const { businessId, email } = req.body;

    // Check if email, header, and body are provided in the request body
    if (!businessId || !email) {
      return res.status(400).json({ error: 'Email, header, and body are required.' });
    }

    // Use async/await to query the employee
    const existingEmployee = await Employee.findOne({ email, businessId });

    if (existingEmployee) {
      // Employee with the same email and businessId found; proceed with sending an email
      existingEmployee.generateInviteToken(); // Generate a new token
      await existingEmployee.save(); // Save the updated employee with the new token
      const inviteEmail = CreateEmailInvite(email,existingEmployee._id, true, token)

    //   generateInviteEmail(email, existingEmployee._id, existingEmployee.inviteToken); // Pass the token
      // Send the inviteEmail using your email sending method
      // e.g., sendEmail(inviteEmail);

    } else {
      // Create a new employee object with default values
      const newEmployee = new Employee({
        email,
        businessId,
        status: Status.invited,
        // Add any other default values from your Employee model here
      });

      newEmployee.generateInviteToken(); // Generate a new token for the new employee
      // Save the new employee object to the database
      await newEmployee.save();

      // Generate the invite email with the new employeeId and token
      const inviteEmail = CreateEmailInvite(email,existingEmployee._id, false, token)
    //    generateInviteEmail(email, newEmployee._id, newEmployee.inviteToken);
      // Send the inviteEmail using your email sending method
      // e.g., sendEmail(inviteEmail);

      // Respond with the newly created employee's _id
      res.status(200).json({ message: 'Invitation email sent successfully.', employeeId: newEmployee._id });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.acceptInvite = async (req, res, next) => {
    try {
      // Check if the required fields are present in the request body
      const { employeeId, email, inviteToken } = req.body;
  
      if (!employeeId || !email || !inviteToken) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Find the employee by their ID and check if the invite token is valid
      const employee = await Employee.findById(employeeId);
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
  
      // Check if the invite token is valid
      const isTokenValid = await Employee.isInviteTokenValid(inviteToken);
  
      if (!isTokenValid) {
        return res.status(400).json({ error: 'Invalid invite token' });
      }
  
      // Find the user by their email
      let user = await User.findOne({ email });
  
      // If the user does not exist, create a new user
      if (!user) {
        user = new User({ email });
        await user.save();
      }
  
      // Update the employee object with the new userId and status
      employee.userId = user._id; // Use the user's ID
      employee.status = Status.onboarding;
  
      // Save the updated employee object in the database
      await employee.save();
  
      // Respond with a success message
      return res.status(200).json({
        message: 'Employee updated successfully',
        userId: employee.userId
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };  

function CreateEmailInvite(email, employeeId, invited, token) {
    if(invited) {
        header = "Resending Invitation To Join Pulse"
    } else {
        header = "Invitation To Join Pulse"
    }

    const urlWithParameters = `${REACTURL}?token=${encodeURIComponent(token)}&employeeId=${encodeURIComponent(employeeId)}`;

    const body = `
    Hi There,
    
    Great news! You have been invited to join your team on the Pulse platform.
    
    To accept this invitation, simply click on the link below:
    
    ${inviteLink}
    
    Note that this link will only be valid for one week, and you may need to contact your team to resend the link if it has been too long.
    
    Once you've joined Pulse, you'll have the opportunity to customize your profile, connect with your colleagues, and start benefiting from this powerful platform immediately.
    
    If you have any questions or need assistance with the onboarding process, please don't hesitate to reach out to our support.
    `;
    return generateInviteEmail(email, header, body)
}