const axios = require('axios');
const { HF_API_URL, HF_API_KEY } = require('../config/huggingface');
const logger = require('../utils/logger');

/**
 * Mean-pool a 2D array (tokens x dims) into a single 1D vector.
 */
function meanPool(matrix) {
  const dim = matrix[0].length;
  const pooled = new Array(dim).fill(0);
  for (const row of matrix) {
    for (let i = 0; i < dim; i++) pooled[i] += row[i];
  }
  return pooled.map((v) => v / matrix.length);
}

/**
 * Get a semantic embedding vector for a piece of text using Hugging Face's
 * free Inference API (sentence-transformers/all-MiniLM-L6-v2 by default).
 * Free tier: rate-limited but no billing required.
 */
async function getEmbedding(text) {
  if (!text || !text.trim()) {
    throw new Error('Text is required to generate an embedding');
  }

  // Keep payload small — free inference API has input size limits.
  const cleaned = text.replace(/\s+/g, ' ').trim().slice(0, 4000);

  try {
    const { data } = await axios.post(
      HF_API_URL,
      { inputs: cleaned, options: { wait_for_model: true } },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    let vector = data;

    // Response shapes vary by model/pipeline:
    // - [num, num, ...]              -> already a pooled sentence embedding
    // - [[num, num, ...]]            -> batch of 1 pooled embedding
    // - [[[num,...], [num,...]]]     -> token-level embeddings, needs pooling
    if (Array.isArray(vector) && Array.isArray(vector[0])) {
      if (Array.isArray(vector[0][0])) {
        vector = meanPool(vector[0]);
      } else {
        vector = meanPool(vector);
      }
    }

    if (!Array.isArray(vector) || vector.length === 0) {
      throw new Error('Unexpected embedding response shape from Hugging Face');
    }

    return vector;
  } catch (err) {
    logger.error('Hugging Face embedding error:', err.response?.data || err.message);
    throw new Error('Failed to generate embedding. Please try again shortly.');
  }
}

module.exports = { getEmbedding };
