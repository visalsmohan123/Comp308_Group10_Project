const express = require('express');
const router = express.Router();
const { createToken } = require('../middleware/authMiddleware');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

// Route for user login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        // Verify password
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth) {
            throw new Error('Incorrect password');
        }
        // Create JWT token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); // Set cookie with JWT
        // Respond with user details and token
        res.status(200).json({
            token,
            id: user._id,
            roleId: user.roleId,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route for user registration
router.post('/register', async (req, res) => {
    try {
        const { email, username, age, gender, role, password } = req.body;
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({ email, username, age, gender, role, password: hashedPassword });
        await newUser.save();
        // Create JWT token
        const token = createToken(newUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 }); // Set cookie with JWT
        // Respond with user details and token
        res.status(201).json({
            token,
            id: newUser._id,
            roleId: newUser.roleId,
            email: newUser.email,
            name: newUser.name,
            age: newUser.age,
            gender: newUser.gender,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
