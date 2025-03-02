const chatService = require('../services/chatService');

exports.chatWithAssistant = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    const chatResponse = await chatService.processChat(req.user.id, query);
    
    res.status(200).json({
      success: true,
      data: chatResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong with the chat service'
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chatHistory = await chatService.getUserChatHistory(req.user.id);
    
    res.status(200).json({
      success: true,
      count: chatHistory.length,
      data: chatHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};