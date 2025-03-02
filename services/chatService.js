const ChatMessage = require('../models/ChatMessage');
const groqService = require('../utils/groqService');

exports.processChat = async (userId, query) => {
  try {
    // Retrieve context from database
    const context = await groqService.getContextForQuery(query);
    
    // Get response from Groq
    const response = await groqService.getChatResponse(query, context);
    
    // Save the conversation
    const chatMessage = await ChatMessage.create({
      user: userId,
      query,
      response,
      context
    });
    
    return {
      messageId: chatMessage._id,
      query,
      response,
      timestamp: chatMessage.createdAt
    };
  } catch (error) {
    throw error;
  }
};

exports.getUserChatHistory = async (userId) => {
  try {
    const chatHistory = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('query response createdAt');
    
    return chatHistory;
  } catch (error) {
    throw error;
  }
};