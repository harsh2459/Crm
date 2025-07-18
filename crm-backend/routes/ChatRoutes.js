const express = require('express');
const router = express.Router();
const chatController = require('../controller/ChatController');
const upload = require('../middleware/upload');

// Create or fetch one-on-one chat room
router.post('/chat_room', chatController.createOrGetChatRoom);

// Send message (text or file)
router.post('/send/:chatRoomId', upload.single('file'), chatController.sendMessage);

// Get messages from room
router.get('/messages/:chatRoomId', chatController.getMessages);

// Get all rooms where empId is participant
router.get('/chat_rooms/:empId', chatController.getChatRoomsForUser);

router.get('/sent/:empId', chatController.getSentMessages);
router.get('/received/:empId', chatController.getReceivedMessages);

router.get('/latest-messages/:empId', chatController.getLatestMessagesForInbox);

module.exports = router;
