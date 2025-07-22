const mongoose = require('mongoose');

const sign_up = new mongoose.Schema({
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    name: String,
    employeeCode: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true },
    phone_no: String,
    address: String,
    password: String,
    company: { type: String },
    file: String,
},);

module.exports = mongoose.model('User', sign_up);
