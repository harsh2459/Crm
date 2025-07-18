const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "harshbabariya12345@gmail.com",
        pass: "lpdquevsxtcmftnp"
    }
});

module.exports = async function sendSignupEmail(to, employeeCode, password) {
    const message = {
        from: '"MyApp" harshbabariya12345@gmail.com',
        to,
        subject: 'Welcome! Your Employee Details',
        text: `Congratulations! Your signup is successful.

Here are your credentials:
Employee Code: ${employeeCode}
Password: ${password}

Please login and change your password as needed.`,
    };

    await transporter.sendMail(message);
};
