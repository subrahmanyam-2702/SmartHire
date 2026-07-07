/**
 * Cosine similarity between two equal-length numeric vectors.
 * Returns a value between -1 and 1. We map it to a 0-100% match score.
 */
function cosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Converts a cosine similarity (-1 to 1) into a friendlier 0-100 match percentage.
 */
function toMatchPercentage(similarity) {
  const clamped = Math.max(-1, Math.min(1, similarity));
  return Math.round(((clamped + 1) / 2) * 100);
}

module.exports = { cosineSimilarity, toMatchPercentage };
