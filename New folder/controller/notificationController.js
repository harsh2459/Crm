const Notification = require('../model/Notification');

exports.createNotification = async ({ empId, title, description, type, link }) => {
  try {
    const notification = new Notification({
      empId,
      title,
      description,
      type,
      link
    });
    await notification.save();
    return notification;
  } catch (err) {
    console.error("Notification Error:", err);
  }
};

// get notifications for a specific employee
exports.getNotificationsByEmpId = async (req, res) => {
  const { empId } = req.params;

  try {
    const notifications = await Notification.find({ empId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.markAllNotificationsSeen = async (req, res) => {
  const { empId } = req.params;

  try {
    const result = await Notification.updateMany(
      { empId: empId, seen: false },
      { $set: { seen: true } }
    );

    res.json({
      message: 'All unseen notifications marked as seen',
      updatedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Error updating notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSeparatedNotifications = async (req, res) => {
  const { empId } = req.params;

  try {
    const seen = await Notification.find({ empId, seen: true }).sort({ createdAt: -1 });
    const unseen = await Notification.find({ empId, seen: false }).sort({ createdAt: -1 });

    res.json({ seen, unseen });
  } catch (err) {
    console.error("Error fetching separated notifications:", err);
    res.status(500).json({ error: err.message });
  }
};
