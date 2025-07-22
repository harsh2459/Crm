const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/Sign_up');
const sendOtpEmail = require('../utlis/sendEmail');
const crypto = require('crypto');
require('dotenv').config();

const generateJwtToken = (userId, email,) => {

    // const secretKey = "58aa9b8a4a6b8d47a44790c83eea7affa212dc7112c5795818424b5de64d0f91" 
    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        { userId, email },
        secretKey, 
        { expiresIn: '1h' } 
    );
};
exports.signIn = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Identifier and password are required' });
        }

        // Check if identifier is email or employeeCode
        const user = await User.findOne({
            $or: [{ email: identifier }, { employeeCode: identifier }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: 'User not verified' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateJwtToken(user._id, user.email);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                employeeCode: user.employeeCode,
                phone_no: user.phone_no,
                address: user.address,
                company: user.company
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.SendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.endsWith('@gmail.com')) {
            return res.status(400).json({ error: 'Email must end with @gmail.com' });
        }

        let user = await User.findOne({ email });

        if (!user && !user.isVerified) {
            return res.status(400).json({ error: 'Email not verified. Please complete sign-up.' });
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

exports.verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        console.log('Stored OTP:', user.otp);
        console.log('Entered OTP:', otp);
        if (!otp || user.otp !== otp) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        res.json({ message: 'OTP verified, you can now reset your password' });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};