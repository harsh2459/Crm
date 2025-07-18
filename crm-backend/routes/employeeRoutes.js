const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employe_controller');

// use http://localhost:5000/api/...

// get all employees
router.get('/employee', employeeController.getAllEmployees);
// get an employee by employee code
router.get('/employee/:employeeCode', employeeController.getEmployeeByCode);
// update an employee's information
router.put('/employee/:employeeCode', employeeController.updateEmployee);
// delete an employee
router.delete('/employee/:employeeCode', employeeController.deleteEmployee);

module.exports = router;
