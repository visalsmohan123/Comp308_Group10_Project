const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email!'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email!']
    },
    username: {
        type: String,
        required: [true, "Please enter a valid username!"],
        unique: true,
    },
    age: {
        type: Number,
        required: [true, "Please enter a valid age!"],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter password!'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {
        type: String,
        enum: ['nurse', 'patient'],
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    }
});

// userSchema.statics.login = async function(email, password) {
//     const user = await this.findOne({ email });
//     if (user) {
//         const isAuth = await bcrypt.compare(password, user.password);
//         if (isAuth) {
//             return user;
//         }
//         throw Error('Incorrect password');
//     } else {
//         throw Error('Email not found');
//     }
// };

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Only hash the password if it has been modified (or is new)
    this.password = await bcrypt.hash(this.password, 12);  // Increase salt rounds if necessary for security
    next();
});

userSchema.statics.findByRole = function(role) {
    return this.find({ role }); // Query users with the specified role
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
