// Groq is OpenAI-API-compatible. Free, fast inference.
// Get a free key at https://console.groq.com/keys
module.exports = {
  GROQ_BASE_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
};
