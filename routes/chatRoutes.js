const express = require('express');
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All chat routes require authentication
router.use(protect);

router.post('/query', chatController.chatWithAssistant);
router.get('/history', chatController.getChatHistory);

module.exports = router;