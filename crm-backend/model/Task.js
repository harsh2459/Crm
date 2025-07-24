const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    assignedTo: {
        type: String,
    },
    employeeCode: {
        type: String,
    },
    taskDescription: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    assignedBy: {
        type: String,  
        required: true
    },
    SendAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Task', taskSchema);
