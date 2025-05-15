const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  taskId: {
    type: Schema.ObjectId,
    ref: "ToDo", // your todo task model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  
});

module.exports = mongoose.model('Notification', notificationSchema);