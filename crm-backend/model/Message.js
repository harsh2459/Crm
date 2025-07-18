const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  senderEmpId: { type: String, required: true },
  receiverEmpId: { type: String, required: true },
  content: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
