const Employee = require('../model/employees');

module.exports = async function generateEmployeeCode() {
    
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    const code = `EMP${randomNumber}`;

    const existingEmployee = await Employee.findOne({ employeeCode: code });

    // If the code already exists, recursively call the function to generate a new one
    if (existingEmployee) {
        return generateEmployeeCode();  // Retry if code exists
    }

    return code;
}