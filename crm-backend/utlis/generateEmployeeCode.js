const Employee = require('../model/employees');

module.exports = async function generateEmployeeCode() {
    const count = await Employee.countDocuments();
    const next = count + 1;
    const code = `EMP${String(next).padStart(4, '0')}`; // e.g., EMP0001
    return code;
}