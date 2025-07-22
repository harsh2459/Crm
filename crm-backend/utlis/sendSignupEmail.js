const nodemailer = require('nodemailer');

require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
});

module.exports = async function sendSignupEmail(to, employeeCode, password) {
    const message = {
        from: `"BookMyAssignment" ${process.env.email}`,
        to,
        subject: 'Welcome! Your Employee Details',
        html: `
            <html>
                <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
                        <h2 style="color: #4CAF50;">Welcome to MyApp, ${to.split('@')[0]}!</h2>
                        <p>Congratulations! Your account has been successfully created. We're excited to have you on board.</p>
                        <p>Here are your credentials to get started:</p>
                        <ul>
                            <li><strong>Employee Code:</strong> ${employeeCode}</li>
                        </ul>
                        <p><strong>Important Next Steps:</strong></p>
                        <ol>
                            <li>Log in to your account using the credentials above.</li>
                            <li>Change your password to something secure by following the link below:</li>
                        </ol>
                        <a href="https://yourapp.com/change-password" style="color: #ffffff; background-color: #4CAF50; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">Change Your Password</a>
                        <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@yourapp.com" style="color: #4CAF50;">support@yourapp.com</a>.</p>
                        <p style="font-size: 12px; color: #999;">This email was sent from MyApp. If you didn't sign up, please ignore this email.</p>
                    </div>
                </body>
            </html>
        `,
    };

    await transporter.sendMail(message);
};
