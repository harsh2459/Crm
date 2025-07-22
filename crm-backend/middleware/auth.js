const jwt = require('jsonwebtoken');

require('dotenv').config();

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    const secretKey = process.env.JWT_SECRET;
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;  // Attach decoded user info to the request
        next();  // Move to the next middleware/route handler
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
