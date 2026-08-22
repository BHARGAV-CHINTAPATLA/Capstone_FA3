const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const generateAnonymousUsername = require('../utils/anonymousUsernameGenerator');
const { sendPushNotification } = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Resolve User ID from an anonymous username
 */
const resolveUserIdByAnonymousName = async (anonymousName) => {
  const users = await User.find({}, '_id');
  for (const u of users) {
    if (generateAnonymousUsername(u._id) === anonymousName) {
      return u._id;
    }
  }
  return null;
};

/**
 * Create or get a chat with an anonymous peer
 * POST /api/v1/chats
 */
const createOrGetChat = asyncHandler(async (req, res) => {
  const { anonymousUsername } = req.body;
  const currentUserId = req.user._id;

  if (!anonymousUsername) {
    return res.status(400).json({ error: 'anonymousUsername is required' });
  }

  // Resolve peer ID
  const peerId = await resolveUserIdByAnonymousName(anonymousUsername);
  if (!peerId) {
    return res.status(404).json({ error: 'Peer user not found' });
  }

  if (peerId.toString() === currentUserId.toString()) {
    return res.status(400).json({ error: 'You cannot start a chat with yourself' });
  }

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [currentUserId, peerId] }
  });

  if (!chat) {
    chat = new Chat({
      participants: [currentUserId, peerId]
    });
    await chat.save();
  }

  // Return chat details, including anonymous representation of peer
  res.status(200).json({
    chatId: chat._id,
    participants: chat.participants,
    peerAnonymousUsername: anonymousUsername
  });
});

/**
 * Get all active chats for the current user
 * GET /api/v1/chats
 */
const getUserChats = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;

  const chats = await Chat.find({
    participants: currentUserId
  });

  const formattedChats = chats.map(chat => {
    const peerId = chat.participants.find(p => p.toString() !== currentUserId.toString());
    return {
      chatId: chat._id,
      peerAnonymousUsername: generateAnonymousUsername(peerId),
      createdAt: chat.createdAt
    };
  });

  res.status(200).json({ chats: formattedChats });
});

/**
 * Get messages inside a chat
 * GET /api/v1/chats/:chatId/messages
 */
const getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const currentUserId = req.user._id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  // Verify participation
  const isParticipant = chat.participants.some(p => p.toString() === currentUserId.toString());
  if (!isParticipant) {
    return res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
  }

  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

  const formattedMessages = messages.map(msg => ({
    id: msg._id,
    chatId: msg.chatId,
    senderId: msg.senderId,
    senderAnonymousUsername: generateAnonymousUsername(msg.senderId),
    message: msg.message,
    createdAt: msg.createdAt
  }));

  res.status(200).json({ messages: formattedMessages });
});

/**
 * Send a message inside a chat
 * POST /api/v1/chats/:chatId/messages
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const currentUserId = req.user._id;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(404).json({ error: 'Chat not found' });
  }

  // Verify participation
  const isParticipant = chat.participants.some(p => p.toString() === currentUserId.toString());
  if (!isParticipant) {
    return res.status(403).json({ error: 'Forbidden: You are not a participant in this chat' });
  }

  // Save message
  const msg = new Message({
    chatId,
    senderId: currentUserId,
    message
  });
  await msg.save();

  // Find recipient ID
  const recipientId = chat.participants.find(p => p.toString() !== currentUserId.toString());
  
  // Trigger Push Notification to recipient
  const senderHandle = generateAnonymousUsername(currentUserId);
  await sendPushNotification(recipientId, {
    title: 'Mindmingle Chat',
    body: `${senderHandle} sent you a message.`,
    data: {
      chatId: chatId,
      url: `/chats/${chatId}`
    }
  });

  res.status(201).json({
    message: 'Message sent successfully',
    data: {
      id: msg._id,
      chatId: msg.chatId,
      senderId: msg.senderId,
      senderAnonymousUsername: senderHandle,
      message: msg.message,
      createdAt: msg.createdAt
    }
  });
});

module.exports = {
  createOrGetChat,
  getUserChats,
  getChatMessages,
  sendMessage
};
