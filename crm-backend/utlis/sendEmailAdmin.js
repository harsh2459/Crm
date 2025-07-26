const nodemailer = require('nodemailer');
require('dotenv').config({ quiet: true });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});

module.exports = async function sendEmailAdminOtpEmail(email, otp) {
    const msg = {
        from: `"BookMyAssignment" ${process.env.email}`,
        to: "harshbabariya2459@gmail.com",
        subject: 'Your Admin OTP Code',
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0;">
                    <div style="background-color: #f5f5f5; padding: 50px; border-radius: 15px; max-width: 600px; margin: auto; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <h2 style="color: #00695c; font-size: 28px; font-weight: bold; margin-bottom: 10px;">Employee Signup Attempt</h2>
                        <p style="font-size: 18px; color: #00796b; margin-top: 10px;">An employee is trying to sign up as an admin. Please review the details below:</p>
                        <div style="font-size: 20px; font-weight: bold; color: #004d40; margin-top: 20px;">
                            <p><strong>Employee Email:</strong> ${email}</p>
                            <p><strong>OTP:</strong> ${otp}</p>
                        </div>
                        <p style="font-size: 16px; color: #555; margin-top: 30px;">Please verify the authenticity of this request. If this is unauthorized, take appropriate actions to block or flag the account.</p>
                        <div style="margin-top: 40px; font-size: 14px; color: #888; line-height: 1.6;">
                            <p>If you need any assistance, please contact us at <a href="mailto:support@BookMyAssignment.com" style="color: #00796b; text-decoration: none; font-weight: bold;">support@BookMyAssignment.com</a>.</p>
                        </div>
                        <div style="margin-top: 50px; font-size: 12px; color: #999;">
                            <p>This is an automated message from BookMyAssignment. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
    };
    await transporter.sendMail(msg);
};
