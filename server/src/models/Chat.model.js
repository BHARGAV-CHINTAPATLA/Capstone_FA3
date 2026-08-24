const { Chat } = require('../utilities/connection');

/**
 * Finds a chat containing both participants
 * @param {string} userId1 
 * @param {string} userId2 
 * @returns {Promise<Object|null>} Chat document
 */
const findChatByParticipants = async (userId1, userId2) => {
  return Chat.findOne({
    participants: { $all: [userId1, userId2] }
  });
};

/**
 * Finds all active chats for a user
 * @param {string} userId 
 * @returns {Promise<Array>} List of chat documents
 */
const findChatsByUserId = async (userId) => {
  return Chat.find({
    participants: userId
  });
};

/**
 * Finds a chat by ID
 * @param {string} chatId 
 * @returns {Promise<Object|null>} Chat document
 */
const findChatById = async (chatId) => {
  return Chat.findById(chatId);
};

/**
 * Creates a new chat session
 * @param {Array<string>} participantIds 
 * @returns {Promise<Object>} Created chat document
 */
const createChat = async (participantIds) => {
  const chat = new Chat({
    participants: participantIds
  });
  return chat.save();
};

module.exports = {
  findChatByParticipants,
  findChatsByUserId,
  findChatById,
  createChat
};
