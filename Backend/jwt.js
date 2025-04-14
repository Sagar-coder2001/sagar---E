require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.jwtmiddleware = (req, res, next) => {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    // Split the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: Invalid Token Format' });
    }

    try {
        // Verify the token using the secret (make sure to use your actual secret here instead of "10")
        const user = jwt.verify(token , process.env.SECRET_KEY); // Replace 'yourSecretKey' with your actual secret
        req.user = user;  // Attach the user information to the request object
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        // Handle invalid token
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

exports.generateToken = (userdata) => {
    const payload = { id: userdata._id, email: userdata.email };  // Specify the data you need
    return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
};

// module.exports = { jwtmiddleware, generateToken };