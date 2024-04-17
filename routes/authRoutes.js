const express = require('express');
const router = express.Router();
const { createToken } = require('../middleware/authMiddleware');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');



module.exports = router;
