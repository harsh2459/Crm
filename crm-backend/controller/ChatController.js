const ChatRoom = require('../model/ChatRoom ');
const Message = require('../model/Message');

exports.createOrGetChatRoom = async (req, res) => {
    const { senderEmpId, receiverEmpId } = req.body;
    try {
        let room = await ChatRoom.findOne({
            participants: { $all: [senderEmpId, receiverEmpId], $size: 2 }
        });

        if (!room) {
            room = new ChatRoom({ participants: [senderEmpId, receiverEmpId] });
            await room.save();
        }

        res.json({ chatRoomId: room._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send text/file message
exports.sendMessage = async (req, res) => {
    const { senderEmpId, receiverEmpId, content } = req.body;
    const { chatRoomId } = req.params;
    const file = req.file;

    try {
        const message = new Message({
            chatRoomId,
            senderEmpId,
            receiverEmpId,
            content: content || null,
            fileUrl: file ? `/uploads/${file.filename}` : null,
            fileType: file ? file.mimetype : null
        });

        await message.save();
        res.status(201).json({ message: 'Message sent', data: message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages in chat room
exports.getMessages = async (req, res) => {
    const { chatRoomId } = req.params;

    try {
        const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all chat rooms for one employee
exports.getChatRoomsForUser = async (req, res) => {
    const { empId } = req.params;
    try {
        const rooms = await ChatRoom.find({ participants: empId });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSentMessages = async (req, res) => {
    const { empId } = req.params;
    try {
        const sentMessages = await Message.find({ senderEmpId: empId }).sort({ timestamp: 1 });
        res.json(sentMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all messages RECEIVED by employeeCode
exports.getReceivedMessages = async (req, res) => {
    const { empId } = req.params;
    try {
        const receivedMessages = await Message.find({ receiverEmpId: empId }).sort({ timestamp: 1 });
        res.json(receivedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getLatestMessagesForInbox = async (req, res) => {
    const { empId } = req.params;
    try {

        const rooms = await ChatRoom.find({ participants: empId });

        const latestMessages = [];

        for (const room of rooms) {
            // Step 2: Get latest message in each room
            const latest = await Message.findOne({ chatRoomId: room._id })
                .sort({ timestamp: -1 })
                .limit(1);

            if (latest) {
                // Step 3: Identify other participant
                const otherParticipant = room.participants.find(p => p !== empId);
                latestMessages.push({
                    chatRoomId: room._id,
                    otherUser: otherParticipant,
                    lastMessage: latest
                });
            }
        }

        res.json(latestMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};