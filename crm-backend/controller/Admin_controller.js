const Admin = require('../model/Admin');
const Task = require('../model/Task');
const Employee = require('../model/employees')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createNotification } = require('./notificationController');
const sendEmailAdminOtpEmail = require('../utlis/sendEmailAdmin');
require('dotenv').config();

const generateJwtToken = (_id, email) => {
    const secretKey = process.env.JWT_SECRET || 'defaultSecret'; // Use JWT secret key from .env file
    return jwt.sign({ _id, email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
};

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.endsWith('@gmail.com')) {
            return res.status(400).json({ error: 'Email must end with @gmail.com' });
        }

        let admin = await Admin.findOne({ email });

        if (admin && admin.isVerified) {
            return res.status(400).json({ error: 'Email already verified. Please login.' });
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

        if (!admin) {
            admin = new Admin({
                email,
                otp,
                otpExpires,
                employeeCode: `TEMP-${Date.now()}`  // Generating a temporary employee code
            });

            // Save the new admin to the database
            await admin.save();
        } else {
            // If admin exists but is not verified, update the OTP and expiration time
            admin.otp = otp;
            admin.otpExpires = otpExpires;
            await admin.save();
        }


        await sendEmailAdminOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });

    } catch (err) {
        console.error('Send OTP error:', err);  // Log the error
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        if (!email || !otp) {
            return res.status(400).json({ error: 'Email and OTP required' });
        }

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'User not found' });
        if (admin.isVerified) return res.status(400).json({ error: 'User already verified' });
        if (!admin.otp || admin.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });
        if (new Date() > admin.otpExpires) return res.status(400).json({ error: 'OTP expired' });

        // Mark as OTP verified (but NOT isVerified, so user can set password later)
        admin.otp = undefined;
        admin.otpExpires = undefined;
        admin.isVerified = true;
        await admin.save();

        res.status(200).json({ message: 'OTP verified!' });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.AdminSignup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        // Check if the admin exists and is verified
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        if (!admin.isVerified) return res.status(400).json({ error: 'Admin is not verified' });

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the admin with the new password and save
       
        admin.name= name;
        admin.email=email;
        admin.password=password;

        await admin.save();

        res.status(201).json({
            message: 'Admin created successfully',
            adminId: admin._id,
        });

    } catch (err) {
        console.error('Create Admin error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.Adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ensure both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if the admin exists in the database
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the admin's email is verified
        if (!admin.isVerified) {
            return res.status(400).json({ error: 'Email is not verified. Please verify your email first.' });
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token for the logged-in admin
        const token = generateJwtToken(admin._id, admin.email);

        // Send the token along with a success message
        res.status(200).json({
            message: 'Login successful',
            adminId: admin._id,
            role: admin.role,
            token: token,  // Send JWT token
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.assignTask = async (req, res) => {
    try {
        const { employeeId, taskDescription, dueDate, adminId } = req.body;

        // Validate input
        if (!employeeId || !taskDescription || !adminId) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the employee exists (Employee _id should be used)
        const employee = await Employee.findById(employeeId); // Use findById to get employee by _id
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const newTask = new Task({
            assignedTo: employee.name,
            employeeCode: employee.employeeCode,
            taskDescription,
            // dueDate: new Date(dueDate),/
            assignedBy: admin.name
        });

        await newTask.save();
        await createNotification({
            empId: employee.employeeCode,
            title: "New Task Assigned",
            description: taskDescription,
            type: "task"
        });

        res.status(201).json({ message: 'Task assigned successfully', newTask });

    } catch (err) {
        console.error('Error assigning task:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// get all task 
exports.getEmployeeTasks = async (req, res) => {
    try {
        const { employeeCode } = req.body;

        const tasks = await Task.find({ employeeCode });

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks assigned to this employee' });
        }

        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });

    } catch (err) {
        console.error('Error retrieving tasks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// short task acording to employeeCode
exports.GetSingleEmployeeTasks = async (req, res) => {
    try {
        const { employeeCode } = req.body;  // Get employeeCode from the URL params


        const tasks = await Task.find({ assignedTo: employeeCode });

        if (tasks.length === 0) {
            return res.status(404).json({ error: 'No tasks assigned to this employee' });
        }

        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });

    } catch (err) {
        console.error('Error retrieving tasks:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};