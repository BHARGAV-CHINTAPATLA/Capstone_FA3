const ChatModel = require('../models/Chat.model');
const MessageModel = require('../models/Message.model');
const UserModel = require('../models/User.model');
const generateAnonymousUsername = require('../utilities/anonymousUsernameGenerator');
const { sendPushNotification } = require('./notificationService');

/**
 * Resolve User ID from an anonymous username
 * @param {string} anonymousName 
 * @returns {Promise<string|null>} User ID or null
 */
const resolveUserIdByAnonymousName = async (anonymousName) => {
  const users = await UserModel.findAllUsersExcept(null);
  for (const u of users) {
    if (generateAnonymousUsername(u._id) === anonymousName) {
      return u._id;
    }
  }
  return null;
};

/**
 * Create or get a chat with an anonymous peer
 * @param {string} currentUserId 
 * @param {string} anonymousUsername 
 * @returns {Promise<Object>} Chat details
 */
const createOrGetChatWithPeer = async (currentUserId, anonymousUsername) => {
  if (!anonymousUsername) {
    const error = new Error('anonymousUsername is required');
    error.statusCode = 400;
    throw error;
  }

  // Resolve peer ID
  const peerId = await resolveUserIdByAnonymousName(anonymousUsername);
  if (!peerId) {
    const error = new Error('Peer user not found');
    error.statusCode = 404;
    throw error;
  }

  if (peerId.toString() === currentUserId.toString()) {
    const error = new Error('You cannot start a chat with yourself');
    error.statusCode = 400;
    throw error;
  }

  // Check if chat already exists
  let chat = await ChatModel.findChatByParticipants(currentUserId, peerId);

  if (!chat) {
    chat = await ChatModel.createChat([currentUserId, peerId]);
  }

  return {
    chatId: chat._id,
    participants: chat.participants,
    peerAnonymousUsername: anonymousUsername
  };
};

/**
 * Get all active chats for a user
 * @param {string} currentUserId 
 * @returns {Promise<Array>} List of user chats
 */
const getUserActiveChats = async (currentUserId) => {
  const chats = await ChatModel.findChatsByUserId(currentUserId);

  return chats.map(chat => {
    const peerId = chat.participants.find(p => p.toString() !== currentUserId.toString());
    return {
      chatId: chat._id,
      peerAnonymousUsername: generateAnonymousUsername(peerId),
      createdAt: chat.createdAt
    };
  });
};

/**
 * Get messages inside a chat
 * @param {string} chatId 
 * @param {string} currentUserId 
 * @returns {Promise<Array>} Messages list
 */
const getChatMessages = async (chatId, currentUserId) => {
  const chat = await ChatModel.findChatById(chatId);
  if (!chat) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify participation
  const isParticipant = chat.participants.some(p => p.toString() === currentUserId.toString());
  if (!isParticipant) {
    const error = new Error('Forbidden: You are not a participant in this chat');
    error.statusCode = 403;
    throw error;
  }

  const messages = await MessageModel.findMessagesByChatId(chatId);

  return messages.map(msg => ({
    id: msg._id,
    chatId: msg.chatId,
    senderId: msg.senderId,
    senderAnonymousUsername: generateAnonymousUsername(msg.senderId),
    message: msg.message,
    createdAt: msg.createdAt
  }));
};

/**
 * Send a message inside a chat
 * @param {string} chatId 
 * @param {string} currentUserId 
 * @param {string} message 
 * @returns {Promise<Object>} Sent message details
 */
const sendChatMessage = async (chatId, currentUserId, message) => {
  const chat = await ChatModel.findChatById(chatId);
  if (!chat) {
    const error = new Error('Chat not found');
    error.statusCode = 404;
    throw error;
  }

  // Verify participation
  const isParticipant = chat.participants.some(p => p.toString() === currentUserId.toString());
  if (!isParticipant) {
    const error = new Error('Forbidden: You are not a participant in this chat');
    error.statusCode = 403;
    throw error;
  }

  // Save message
  const msg = await MessageModel.createMessage(chatId, currentUserId, message);

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

  return {
    id: msg._id,
    chatId: msg.chatId,
    senderId: msg.senderId,
    senderAnonymousUsername: senderHandle,
    message: msg.message,
    createdAt: msg.createdAt
  };
};

module.exports = {
  createOrGetChatWithPeer,
  getUserActiveChats,
  getChatMessages,
  sendChatMessage
};
