const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    empId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String }, // 'message', 'task', etc.
    link: { type: String }, // optional - to redirect in frontend
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
