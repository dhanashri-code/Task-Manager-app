const express = require('express');
const { createNotification, getUserNotifications , markAsRead , getUnreadCount , checkDeadlines , deleteAllNotifications , deleteNotification} = require('../controllers/notificationController');
const authenticateToken = require("../middleware/authJwt");

const router = express.Router();

// Create notification
router.post('/createNoti', authenticateToken, createNotification);

// Get user's notifications
router.get('/user/:userId', authenticateToken , getUserNotifications);

// In routes/notificationRoutes.js
router.get('/user/:userId/unread-count', authenticateToken, getUnreadCount);

// Route for marking notification as read
//router.patch('/markAsRead/:notificationId', markAsRead);
router.put('/mark-read/:id', markAsRead);

router.get("/check-deadlines", authenticateToken , checkDeadlines); // no :userId


router.delete('/delete/:notificationId',authenticateToken, deleteNotification);

router.delete('/deleteAll/:userId', authenticateToken, deleteAllNotifications);

module.exports = router;
