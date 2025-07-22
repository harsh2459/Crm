const mongoose = require('mongoose');

const employes = new mongoose.Schema({
    name: String,
    employeeCode: { type: String, unique: true ,sparse: true },
    department: {
        type: String,
    },
    designation: {
        type: String,
    },
    dateOfJoining: {
        type: Date,
    },
    salary: {
        type: Number,
    },
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift', 
    },
    contact: {
        phone: {
            type: String,           
        },
        email: {
            type: String,          
        },
        address: {
            type: String,
        }
    },
    profileImageUrl: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},);

module.exports = mongoose.model('employes', employes);