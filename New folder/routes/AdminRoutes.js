const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin_controller');
const { verifyToken } = require('../middleware/auth');

// Route for Admin Signup
router.post('/signup', adminController.AdminSignup);

// Route for Admin Login
router.post('/login', adminController.Adminlogin);


// assain task to user throw admin
router.post('/assign_task', verifyToken, adminController.assignTask);
router.get('/get_tasks', verifyToken, adminController.getEmployeeTasks);
router.post('/get_single_tasks', verifyToken, adminController.GetSingleEmployeeTasks);

module.exports = router;