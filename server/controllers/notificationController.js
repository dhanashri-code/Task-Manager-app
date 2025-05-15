const Notification = require('../models/Notification');
const ToDo = require('../models/toDoList'); // Ensure ToDo model is required

exports.createNotification = async (req, res) => {
  try {
    const { userId, taskId, message } = req.body;

    console.log("Creating notification with:", { userId, taskId, message });

    const notification = new Notification({ userId, taskId, message });
    await notification.save();

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Create Notification Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch existing notifications
    const notifications = await Notification.find({ userId })
      .populate('taskId')
      .sort({ createdAt: -1 });

    const currentDate = new Date();

    // Find tasks nearing deadline in next 24 hours
    const nearDeadlineTasks = await ToDo.find({
      createdBy: userId,
      deadLine: {
        $gte: currentDate,
        $lte: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
      },
      isCompleted: false,
    });

    for (const task of nearDeadlineTasks) {
      // ✅ Check if a notification already exists for this task
      const existingNotification = await Notification.findOne({
        userId,
        taskId: task._id,
        message: { $regex: /due soon/i }, // or exact match, if preferred
      });

      if (!existingNotification) {
        await Notification.create({
          userId,
          taskId: task._id,
          message: `Your task "${task.title}" is due soon!`,
        });
      }
    }

    res.status(200).json({ success: true, notifications });

  } catch (error) {
    console.error("Fetch Notification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// In controllers/notificationController.js
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await Notification.countDocuments({ userId, read: false });
    res.status(200).json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.checkDeadlines = async (req, res) => { 
  try {
    const { userId } = req.params;
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

    const tasks = await ToDo.find({
      createdBy: userId,
      deadLine: { $lte: inOneHour, $gte: now },
      isCompleted: false,
      notified: false, // Make sure this exists on task model
    });

    for (const task of tasks) {
      try {
        // Create the notification
        await Notification.create({
          userId,
          taskId: task._id,
          message: `Deadline is near for: ${task.title}`,
        });

        // ✅ Mark the task as notified to prevent duplicates
        await ToDo.findByIdAndUpdate(task._id, { $set: { notified: true } });
        console.log('notification flag --- ' , notified);
      } catch (notificationErr) {
        console.error('Notification error for task', task._id, notificationErr);
      }
    }

    res.status(200).json({ message: "Checked deadlines and sent notifications." });

  } catch (err) {
    console.error("Deadline check error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a single notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ success: true, message: "Notification deleted." });
  } catch (error) {
    console.error("Delete Notification Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete notification." });
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.deleteMany({ userId });
    res.status(200).json({ success: true, message: "All notifications deleted." });
  } catch (error) {
    console.error("Delete All Notifications Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete all notifications." });
  }
};
