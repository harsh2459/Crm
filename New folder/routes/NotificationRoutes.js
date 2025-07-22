const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/notificationController');
const { verifyToken } = require('../middleware/auth');


// get notification 
router.get('/:empId', verifyToken,NotificationController.getNotificationsByEmpId);
// separte notification
router.get('/separated/:empId', verifyToken,NotificationController.getSeparatedNotifications);
// set all notifications to read
router.put('/mark_all_seen/:empId', verifyToken,NotificationController.markAllNotificationsSeen);


module.exports = router;
