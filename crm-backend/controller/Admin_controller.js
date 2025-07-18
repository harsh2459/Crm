const Admin = require('../model/Admin');
const Task = require('../model/Task');
const Employee = require('../model/employees')
const user = require('../model/Sign_up');
const { createNotification } = require('./notificationController');

exports.AdminSignup = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const newAdmin = new Admin({
            name,
            email,
            password,
            role,
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin signed up successfully',
            adminId: newAdmin._id,
            role: newAdmin.role,
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.Adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({
            message: 'Login successful',
            adminId: admin._id,
            role: admin.role,
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
        if (!employeeId || !taskDescription || !dueDate || !adminId) {
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
            dueDate: new Date(dueDate),
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