const express = require('express');
const router = express.Router();
const chatController = require('../controller/ChatController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

// Create or fetch one-on-one chat room
router.post('/chat_room', verifyToken,chatController.createOrGetChatRoom);

// Send message (text or file)
router.post('/send/:chatRoomId', verifyToken,upload.single('file'), chatController.sendMessage);

// Get messages from room
router.get('/messages/:chatRoomId', verifyToken,chatController.getMessages);

// Get all rooms where empId is participant
router.get('/chat_rooms/:empId', verifyToken,chatController.getChatRoomsForUser);

router.get('/sent/:empId', verifyToken,chatController.getSentMessages);
router.get('/received/:empId', verifyToken,chatController.getReceivedMessages);

router.get('/latest-messages/:empId', verifyToken,chatController.getLatestMessagesForInbox);

router.put('/read/:chatRoomId/:empId', verifyToken, chatController.markAsRead);
router.delete('/message/:messageId', verifyToken, chatController.deleteMessage);


module.exports = router;
