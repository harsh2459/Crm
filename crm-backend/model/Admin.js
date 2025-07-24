const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    name: {
        type: String,
    },
    email: {
        type: String,
        sparse: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        default: 'admin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;