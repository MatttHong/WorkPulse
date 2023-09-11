const emailNewUser = require('../utils/smtps.js');

// Define the inviteUser controller function
exports.inviteUser = (req, res) => {
    const { email, header, body } = req.body;

    // Check if email, header, and body are provided in the request body
    if (!email || !header || !body) {
        return res.status(400).json({ error: 'Email, header, and body are required.' });
    }

    // Call the emailNewUser function to send the invitation email
    emailNewUser(email, header, body);

    // Respond with a success message or handle errors from the emailNewUser function
    res.status(200).json({ message: 'Invitation email sent successfully.' });
};
