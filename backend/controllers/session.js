const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const { JWT_SECRET } = require('../secret/secret');

// Create a new session token for a user
exports.createSession = async (userId) => {
  await Session.deleteMany({ userId });
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '8h' });

  const session = new Session({ token, userId });

  await session.save();

  return token;
};
// Middleware to validate session token
exports.validateSession = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the token is valid and not expired
        const decoded = jwt.verify(token, JWT_SECRET);
        const session = await Session.findOne({ token });

        if (!session) {
        return res.status(401).json({ message: 'Session expired or invalid' });
        }

        // Add user info to the request
        req.TokenUserId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};