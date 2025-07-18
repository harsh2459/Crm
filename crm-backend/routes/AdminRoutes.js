const express = require('express');
const router = express.Router();
const adminController = require('../controller/Admin_controller');

// Route for Admin Signup
router.post('/signup', adminController.AdminSignup);

// Route for Admin Login
router.post('/login', adminController.Adminlogin);

router.post('/assign_task', adminController.assignTask);
router.get('/get_tasks', adminController.getEmployeeTasks);
router.post('/get_single_tasks', adminController.GetSingleEmployeeTasks);

module.exports = router;
