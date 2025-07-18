const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employe_controller');

// get all employees
router.get('/', employeeController.getAllEmployees);

// get an employee by employee code
router.get('/:employeeCode', employeeController.getEmployeeByCode);

// update an employee's information
router.put('/:employeeCode', employeeController.updateEmployee);

// delete an employee
router.delete('/:employeeCode', employeeController.deleteEmployee);

module.exports = router;
