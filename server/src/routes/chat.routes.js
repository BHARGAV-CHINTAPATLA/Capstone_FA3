const express = require('express');
const router = express.Router();
const chatService = require('../services/chatService');
const authenticateJWT = require('../utilities/authenticateJWT');
const { validateMessage } = require('../utilities/validateRequest');
const asyncHandler = require('../utilities/asyncHandler');

router.post('/chats', authenticateJWT, asyncHandler(async (req, res) => {
  const { anonymousUsername } = req.body;
  const result = await chatService.createOrGetChatWithPeer(req.user._id, anonymousUsername);
  res.status(200).json(result);
}));

router.get('/chats', authenticateJWT, asyncHandler(async (req, res) => {
  const chats = await chatService.getUserActiveChats(req.user._id);
  res.status(200).json({ chats });
}));

router.get('/chats/:chatId/messages', authenticateJWT, asyncHandler(async (req, res) => {
  const messages = await chatService.getChatMessages(req.params.chatId, req.user._id);
  res.status(200).json({ messages });
}));

router.post('/chats/:chatId/messages', authenticateJWT, validateMessage, asyncHandler(async (req, res) => {
  const { message } = req.body;
  const data = await chatService.sendChatMessage(req.params.chatId, req.user._id, message);
  res.status(201).json({
    message: 'Message sent successfully',
    data
  });
}));

module.exports = router;
