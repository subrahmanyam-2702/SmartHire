const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { success, failure } = require('../utils/apiResponse');

/**
 * @route GET /api/messages/conversations
 * Powers the Messages page's "Conversations" list (candidate or recruiter).
 */
const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate('participants', 'name role')
    .populate('job', 'title companyName')
    .sort({ lastMessageAt: -1 });
  return success(res, 200, 'Conversations fetched', conversations);
});

/**
 * @route POST /api/messages/conversations
 * body: { recipientId, jobId?, firstMessage }
 * Used by recruiters to "invite" a candidate — creates a conversation + first message.
 */
const startConversation = asyncHandler(async (req, res) => {
  const { recipientId, jobId, firstMessage } = req.body;
  if (!recipientId || !firstMessage) {
    return failure(res, 400, 'recipientId and firstMessage are required');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [req.user._id, recipientId] },
    ...(jobId && { job: jobId }),
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user._id, recipientId],
      job: jobId || undefined,
    });
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text: firstMessage,
  });

  conversation.lastMessage = firstMessage;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  await Notification.create({
    user: recipientId,
    type: 'new_message',
    message: `New message from ${req.user.name}`,
    link: '/messages',
  });

  return success(res, 201, 'Conversation started', { conversation, message });
});

/**
 * @route GET /api/messages/conversations/:id
 */
const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return failure(res, 404, 'Conversation not found');
  if (!conversation.participants.map(String).includes(String(req.user._id))) {
    return failure(res, 403, 'Not authorized to view this conversation');
  }

  const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });

  await Message.updateMany(
    { conversation: req.params.id, sender: { $ne: req.user._id }, readAt: null },
    { readAt: new Date() }
  );

  return success(res, 200, 'Messages fetched', messages);
});

/**
 * @route POST /api/messages/conversations/:id
 * body: { text }
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return failure(res, 400, 'Message text is required');

  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) return failure(res, 404, 'Conversation not found');
  if (!conversation.participants.map(String).includes(String(req.user._id))) {
    return failure(res, 403, 'Not authorized');
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    text,
  });

  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  const recipientId = conversation.participants.find((p) => String(p) !== String(req.user._id));
  if (recipientId) {
    await Notification.create({
      user: recipientId,
      type: 'new_message',
      message: `New message from ${req.user.name}`,
      link: '/messages',
    });
  }

  return success(res, 201, 'Message sent', message);
});

module.exports = { getConversations, startConversation, getMessages, sendMessage };
