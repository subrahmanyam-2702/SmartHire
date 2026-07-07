const { cosineSimilarity, toMatchPercentage } = require('../utils/cosineSimilarity');

/**
 * Ranks a list of jobs against a candidate's embedding.
 * Returns jobs annotated with matchScore, sorted descending.
 */
function rankJobsForCandidate(candidateEmbedding, jobs) {
  return jobs
    .filter((job) => Array.isArray(job.embedding) && job.embedding.length > 0)
    .map((job) => {
      const sim = cosineSimilarity(candidateEmbedding, job.embedding);
      return { job, matchScore: toMatchPercentage(sim) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Ranks a list of candidate profiles against a job's embedding.
 * Returns candidates annotated with matchScore, sorted descending.
 */
function rankCandidatesForJob(jobEmbedding, candidateProfiles) {
  return candidateProfiles
    .filter((c) => Array.isArray(c.embedding) && c.embedding.length > 0)
    .map((profile) => {
      const sim = cosineSimilarity(jobEmbedding, profile.embedding);
      return { profile, matchScore: toMatchPercentage(sim) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { rankJobsForCandidate, rankCandidatesForJob };
