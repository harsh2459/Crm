const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  participants: {
    type: [String], // Array of employee IDs
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
