// Hugging Face free Inference API for sentence embeddings.
// Get a free token at https://huggingface.co/settings/tokens
const MODEL = process.env.HF_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';

module.exports = {
  HF_API_URL: `https://router.huggingface.co/hf-inference/models/${MODEL}/pipeline/feature-extraction`,
  HF_API_KEY: process.env.HUGGINGFACE_API_KEY,
  EMBEDDING_DIM: 384,
};
