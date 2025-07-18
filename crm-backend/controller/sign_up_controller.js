const fs = require('fs');
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../model/Sign_up');
const Employee = require('../model/employees');
const Company = require('../model/company');
const sendOtpEmail = require('../utlis/sendEmail');
const sendSignupEmail = require('../utlis/sendSignupEmail');
const generateEmployeeCode = require('../utlis/generateEmployeeCode');

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.endsWith('@gmail.com')) {
            return res.status(400).json({ error: 'Email must end with @gmail.com' });
        }

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ error: 'Email already verified. Please login.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        if (!user) {
            user = new User({ email, otp, otpExpires });
        } else {
            user.otp = otp;
            user.otpExpires = otpExpires;
        }

        await user.save();
        await sendOtpEmail(email, otp);
        console.log('Generated OTP:', otp);
        res.status(200).json({ message: 'OTP sent to your email' });

    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'User already verified' });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP resent' });

    } catch (err) {
        console.error('Resend OTP error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP required' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'User already verified' });
        if (!user.otp || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (new Date() > user.otpExpires) return res.status(400).json({ error: 'OTP expired' });

        // Mark as OTP verified (but NOT isVerified, so user can set password later)
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpVerified = true; // <-- Add this field in your User schema if not already!
        await user.save();

        res.status(200).json({ message: 'OTP verified!' });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.CompleteSignup = async (req, res) => {
    const { email, name, phone_no, address, company, password } = req.body;
    const file = req.file;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            if (file) fs.unlinkSync(file.path);
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.isVerified) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'User already verified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const filename = file ? file.filename : null;
        const formattedDate = moment().format('DD-MMM-YYYY HH:mm');
        const employeeCode = await generateEmployeeCode();

        const newEmployee = new Employee({
            name: name,
            userId: null,
            employeeCode,
            department: null,
            designation: null,
            dateOfJoining: formattedDate,
            salary: null,
            shiftId: null,
            contact: {
                phone: phone_no,
                email: email,
                address: address
            },
            profileImageUrl: filename || null
        });

        await newEmployee.save();

        user.name = name;
        user.phone_no = phone_no;
        user.address = address;
        user.company = company;
        user.file = filename;
        user.employeeCode = employeeCode;
        user.password = hashedPassword;
        user.isVerified = true;
        user.otpVerified = false;
        await user.save();

        await sendSignupEmail(email, employeeCode, password);

        res.status(200).json({ message: 'Signup complete, credentials sent to email' });

    } catch (err) {
        console.error('Signup error:', err);
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        res.status(500).json({ error: 'Internal server error' });
    }
};