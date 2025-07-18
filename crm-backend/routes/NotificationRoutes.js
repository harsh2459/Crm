const express = require('express');
const router = express.Router();
const NotificationController = require('../controller/notificationController');


// get notification 
router.get('/:empId', NotificationController.getNotificationsByEmpId);
// separte notification
router.get('/separated/:empId', NotificationController.getSeparatedNotifications);
// set all notifications to read
router.put('/mark_all_seen/:empId', NotificationController.markAllNotificationsSeen);


module.exports = router;
