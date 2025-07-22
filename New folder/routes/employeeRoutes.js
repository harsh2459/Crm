const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employe_controller');
const { verifyToken } = require('../middleware/auth');

// get all employees
router.get('/', verifyToken, employeeController.getAllEmployees);

// get an employee by employee code
router.get('/:employeeCode', verifyToken, employeeController.getEmployeeByCode);

// update an employee's information
router.put('/:employeeCode', verifyToken, employeeController.updateEmployee);

// delete an employee
router.delete('/:employeeCode', verifyToken, employeeController.deleteEmployee);

module.exports = router;
