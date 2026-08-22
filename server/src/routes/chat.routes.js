const express = require('express');
const router = express.Router();
const { createOrGetChat, getUserChats, getChatMessages, sendMessage } = require('../controllers/chat');
const authenticateJWT = require('../middleware/authenticateJWT');
const { validateMessage } = require('../middleware/validateRequest');

router.post('/chats', authenticateJWT, createOrGetChat);
router.get('/chats', authenticateJWT, getUserChats);
router.get('/chats/:chatId/messages', authenticateJWT, getChatMessages);
router.post('/chats/:chatId/messages', authenticateJWT, validateMessage, sendMessage);

module.exports = router;
