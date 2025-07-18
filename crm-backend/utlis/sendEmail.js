const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "harshbabariya12345@gmail.com",
        pass: "lpdquevsxtcmftnp"
    }
});

module.exports = async function sendOtpEmail(to, otp) {
    const msg = {
        from: `"MyApp" harshbabariya12345@gmail.com`,
        to, 
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It expires in 15 minutes.`
    };
    await transporter.sendMail(msg);
};
