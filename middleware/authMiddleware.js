const jwt = require('jsonwebtoken');

// Create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 3 * 24 * 60 * 60 }); // Expires in 3 days
};

// Authentication middleware
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    console.log("Token", token);
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.status(401).json({ message: 'Unauthorized' });
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = { createToken, requireAuth };
