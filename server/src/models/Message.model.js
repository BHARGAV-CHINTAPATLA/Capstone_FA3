const { Message } = require('../utilities/connection');

/**
 * Finds all messages for a specific chat sorted chronologically
 * @param {string} chatId 
 * @returns {Promise<Array>} List of message documents
 */
const findMessagesByChatId = async (chatId) => {
  return Message.find({ chatId }).sort({ createdAt: 1 });
};

/**
 * Creates and saves a new message
 * @param {string} chatId 
 * @param {string} senderId 
 * @param {string} messageText 
 * @returns {Promise<Object>} Created message document
 */
const createMessage = async (chatId, senderId, messageText) => {
  const msg = new Message({
    chatId,
    senderId,
    message: messageText
  });
  return msg.save();
};

module.exports = {
  findMessagesByChatId,
  createMessage
};
