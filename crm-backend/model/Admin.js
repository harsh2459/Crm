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

adminSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;