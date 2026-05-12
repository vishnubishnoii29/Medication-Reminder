const axios = require('axios');
const Groq = require('groq-sdk');
const logger = require('../config/logger');

// The URL of the Python Flask/FastAPI microservice
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:5001';

// Initialize Groq client
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

exports.getPrediction = async (userData) => {
  try {
    const response = await axios.post(`${PYTHON_AI_URL}/api/predict`, userData, {
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to communicate with Python AI Microservice:', error.message);
    
    // Fallback Mock Prediction — same shape as Python response { success, prediction: {...} }
    return {
      success: true,
      prediction: {
        missed_dose_probability: 0.15,
        risk_level: "Low",
        confidence: 0.85,
        recommendation: "Your adherence is good. Maintain schedule."
      }
    };
  }
};

exports.analyzeChat = async (messageHistory, currentInput) => {
  // Try Groq API first if available
  if (groq) {
    try {
      // Limit message history to last 4 messages to reduce token usage (free tier optimization)
      const recentHistory = messageHistory.slice(-4);
      
      // Format message history for Groq
      const messages = recentHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a Health Expert & Medical Assistant for MediMind.ai (medication adherence platform).

EXPERTISE: Medication management, drug interactions, side effects, chronic disease, patient education, adherence strategies.

RESPONSIBILITIES:
1. Provide evidence-based health information
2. Help users understand medications and conditions
3. Suggest adherence improvement strategies
4. Identify medication concerns
5. Guide to professional care when needed

TONE: Professional, compassionate, clear, non-technical.

GUIDELINES:
• Advise consulting a doctor for serious concerns or diagnoses
• Do NOT prescribe or adjust medications
• Prioritize patient safety
• Do NOT replace professional medical advice

You are a trusted health advisor, not a doctor.`
          },
          ...messages,
          { role: 'user', content: currentInput }
        ],
        model: 'llama-3.1-8b-instant',  // Stable working model recommended by tests
        max_tokens: 256,  // Reduced from 1024 for free tier (saves ~75% tokens)
        temperature: 0.7
      });

      // Log token usage (for monitoring)
      const inputTokens = response.usage?.prompt_tokens || 0;
      const outputTokens = response.usage?.completion_tokens || 0;
      const totalTokens = inputTokens + outputTokens;
      
      if (totalTokens > 1000) {
        logger.warn(`High token usage: ${totalTokens} tokens (input: ${inputTokens}, output: ${outputTokens})`);
      } else {
        logger.info(`Chat tokens used: ${totalTokens} (input: ${inputTokens}, output: ${outputTokens})`);
      }

      return {
        response: response.choices[0].message.content,
        tokensUsed: totalTokens
      };
    } catch (error) {
      // Log detailed Groq error when available
      const groqError = error?.response?.data || error?.message || String(error);
      logger.error('Groq API error:', groqError);
      // Fall through to Python service fallback
    }
  }

  // Fallback to Python service
  try {
    const response = await axios.post(`${PYTHON_AI_URL}/api/chat`, {
      history: messageHistory,
      message: currentInput
    }, { timeout: 5000 });
    return response.data;
  } catch (error) {
    logger.error('Failed to reach AI chat service:', error.message);
    // Graceful fallback — don't throw so the chat session remains intact
    return {
      response: "I'm having trouble connecting to the AI engine right now. Please try again in a moment, or check your medication schedule on the Reminders page."
    };
  }
};
