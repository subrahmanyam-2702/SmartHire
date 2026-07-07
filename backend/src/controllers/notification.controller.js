const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const { success, failure } = require('../utils/apiResponse');

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  return success(res, 200, 'Notifications fetched', notifications);
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return failure(res, 404, 'Notification not found');
  return success(res, 200, 'Marked as read', notification);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return success(res, 200, 'All notifications marked as read');
});

module.exports = { getMyNotifications, markAsRead, markAllAsRead };
