const Employee = require('../model/employees');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEmployeeByCode = async (req, res) => {
    try {
        const { employeeCode } = req.params;

        const employee = await Employee.findOne({ employeeCode })

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json
            (employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { employeeCode } = req.params;
        const updates = req.body;

        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeCode },
            { $set: updates, $currentDate: { updatedAt: true } },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { employeeCode } = req.params;

        // Find and delete employee by employee code
        const deletedEmployee = await Employee.findOneAndDelete({ employeeCode });

        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully', employee: deletedEmployee });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
