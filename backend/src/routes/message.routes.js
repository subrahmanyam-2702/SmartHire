const express = require('express');
const router = express.Router();
const {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} = require('../controllers/message.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations', startConversation);
router.get('/conversations/:id', getMessages);
router.post('/conversations/:id', sendMessage);

module.exports = router;
