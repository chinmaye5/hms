const axios = require('axios');
const Hospital = require('../models/Hospital');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  }
  
  // Retrieve context from database
  async getContextForQuery(query) {
    // Simple keyword-based retrieval from hospital data
    const keywords = query.toLowerCase().split(/\s+/);
    
    // Find hospitals that match any of the keywords in various fields
    const relevantHospitals = await Hospital.find({
      $or: [
        { name: { $regex: keywords.join('|'), $options: 'i' } },
        { city: { $regex: keywords.join('|'), $options: 'i' } },
        { specialty: { $regex: keywords.join('|'), $options: 'i' } },
        { 'details.description': { $regex: keywords.join('|'), $options: 'i' } }
      ]
    }).limit(3);
    
    // Format the hospital data as context strings
    const contextStrings = relevantHospitals.map(hospital => {
      return `Hospital: ${hospital.name}
Location: ${hospital.city}
Specialty: ${hospital.specialty}
Rating: ${hospital.rating}/5
${hospital.details?.description ? `Description: ${hospital.details.description}` : ''}
${hospital.details?.numberOfDoctors ? `Number of Doctors: ${hospital.details.numberOfDoctors}` : ''}
${hospital.details?.numberOfDepartments ? `Number of Departments: ${hospital.details.numberOfDepartments}` : ''}`;
    });
    
    return contextStrings;
  }
  
  // Get response from Groq API with context
  async getChatResponse(query, context) {
    try {
      const systemPrompt = `You are a helpful hospital assistant. Use the following hospital information to answer user queries accurately. If you don't know the answer based on the provided context, say so politely.`;
      
      const contextText = context.length > 0 
        ? `CONTEXT:\n${context.join('\n\n')}`
        : 'No specific hospital information available for this query.';
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `${systemPrompt}\n\n${contextText}`
            },
            {
              role: 'user',
              content: query
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error.response?.data || error.message);
      throw new Error('Failed to get response from Groq API');
    }
  }
}

module.exports = new GroqService();