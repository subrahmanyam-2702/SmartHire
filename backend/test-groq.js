require('dotenv').config();
const axios = require('axios');

async function test() {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: 'Say hello in one sentence.'
          }
        ],
        max_tokens: 30
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('SUCCESS:');
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.log('FAILED:');
    console.log(error.response?.data || error.message);
  }
}

test();