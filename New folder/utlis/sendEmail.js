const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
}); 

module.exports = async function sendOtpEmail(to, otp) {
    const msg = {
        from: `"BookMyAssignment" ${process.env.email}`,
        to,
        subject: 'Your OTP Code',
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0;">
                    <div style="background-color: #e0f7fa; padding: 50px; border-radius: 15px; max-width: 600px; margin: auto; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <!-- Using embedded image with updated size -->
                        <img src="https://bookmyassignments.com/extra_img/logo2.png" alt="MyApp Logo" style="width: 250px; margin-bottom: 30px;">
                        <h2 style="color: #00695c; font-size: 28px; font-weight: bold; margin-bottom: 10px;">verification code</h2>
                        <p style="font-size: 18px; color: #00796b; margin-top: 10px;">To complete your authentication, please use the following One-Time Password (OTP):</p>
                        <div style="font-size: 32px; font-weight: bold; color: #ffffff; background-color: #4caf50; padding: 20px 40px; border-radius: 10px; display: inline-block; margin-top: 20px; box-shadow: 0 6px 15px rgba(0,0,0,0.1);">
                            ${otp}
                        </div>
                        <p style="font-size: 16px; color: #555; margin-top: 30px;">This OTP will expire in <strong>15 minutes</strong>. Please use it before it expires.</p>
                        <div style="margin-top: 40px; font-size: 14px; color: #888; line-height: 1.6;">
                            <p>If you did not request this OTP, please disregard this email. Your security is important to us.</p>
                            <p style="font-size: 14px; color: #00796b;">Need help? <a href="mailto:support@yourapp.com" style="color: #00796b; text-decoration: none; font-weight: bold;">Contact Support</a></p>
                        </div>
                        <div style="margin-top: 50px; font-size: 12px; color: #999;">
                            <p>This is an automated message from MyApp. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
    };
    await transporter.sendMail(msg);
};
