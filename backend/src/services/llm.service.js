const axios = require('axios');
const { GROQ_BASE_URL, GROQ_API_KEY, GROQ_MODEL } = require('../config/groq');
const logger = require('../utils/logger');

async function callGroq(messages, { json = false, temperature = 0.4, maxTokens = 1024 } = {}) {
  try {
    const body = {
      model: GROQ_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    };
    if (json) body.response_format = { type: 'json_object' };

    const { data } = await axios.post(GROQ_BASE_URL, body, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    return data.choices?.[0]?.message?.content ?? '';
  } catch (err) {
    logger.error('Groq API error:', err.response?.data || err.message);
    throw new Error('AI request failed. Please try again shortly.');
  }
}

/**
 * Parses raw resume text into structured fields: skills, experience summary,
 * inferred career goal, years of experience. Powers the "auto-extract" step
 * on the Profile page.
 */
async function extractResumeData(rawText) {
  const messages = [
    {
      role: 'system',
      content:
        'You extract structured data from resumes. Respond ONLY with a JSON object with keys: ' +
        '"skills" (array of strings, deduplicated, max 25), "experience" (2-3 sentence summary), ' +
        '"careerGoal" (1 sentence, inferred if not explicit), "yearsOfExperience" (number, estimate if unclear).',
    },
    { role: 'user', content: rawText.slice(0, 6000) },
  ];
  const content = await callGroq(messages, { json: true, temperature: 0.2 });
  try {
    return JSON.parse(content);
  } catch {
    return { skills: [], experience: '', careerGoal: '', yearsOfExperience: 0 };
  }
}

/**
 * Generates a short "why this match" explanation for a candidate-job pair.
 */
async function generateMatchExplanation(resumeText, jobText, matchScore) {
  const messages = [
    {
      role: 'system',
      content:
        'You are a recruiting assistant. In 2 short sentences, explain why this candidate ' +
        'is (or is not) a good fit for this job, referencing specific overlapping skills. Be concrete, no fluff.',
    },
    {
      role: 'user',
      content: `Match score: ${matchScore}%\n\nCandidate resume:\n${resumeText.slice(
        0,
        2500
      )}\n\nJob description:\n${jobText.slice(0, 2500)}`,
    },
  ];
  return callGroq(messages, { temperature: 0.5, maxTokens: 200 });
}

/**
 * Generates ATS-style resume feedback: score + strengths + improvements.
 */
async function generateResumeFeedback(rawText) {
  const messages = [
    {
      role: 'system',
      content:
        'You are an ATS resume reviewer. Respond ONLY with a JSON object with keys: ' +
        '"atsScore" (0-100 integer), "summary" (2 sentences), ' +
        '"strengths" (array of 3-5 short strings), "improvements" (array of 3-5 short, actionable strings).',
    },
    { role: 'user', content: rawText.slice(0, 6000) },
  ];
  const content = await callGroq(messages, { json: true, temperature: 0.3 });
  try {
    return JSON.parse(content);
  } catch {
    return { atsScore: 50, summary: '', strengths: [], improvements: [] };
  }
}

/**
 * Generates a step-by-step career growth plan toward the candidate's stated goal.
 */
async function generateCareerGrowthPlan({ careerGoal, skills, yearsOfExperience }) {
  const messages = [
    {
      role: 'system',
      content:
        'You are a career coach. Respond ONLY with a JSON object with keys: ' +
        '"roadmap" (array of 4-6 objects each with "step", "title", "description", "estimatedTime"), ' +
        '"recommendedSkills" (array of 3-6 skill strings the candidate should learn next).',
    },
    {
      role: 'user',
      content: `Career goal: ${careerGoal}\nCurrent skills: ${skills.join(', ')}\nYears of experience: ${yearsOfExperience}`,
    },
  ];
  const content = await callGroq(messages, { json: true, temperature: 0.5, maxTokens: 1200 });
  try {
    return JSON.parse(content);
  } catch {
    return { roadmap: [], recommendedSkills: [] };
  }
}

/**
 * Generates a tailored cover letter for a specific job application.
 */
async function generateCoverLetter(resumeText, jobText, candidateName) {
  const messages = [
    {
      role: 'system',
      content:
        'Write a concise, professional cover letter (max 250 words) tailored to the job description, ' +
        'using only facts present in the resume. No placeholders like [Company Name] unless truly unknown.',
    },
    {
      role: 'user',
      content: `Candidate name: ${candidateName}\n\nResume:\n${resumeText.slice(
        0,
        3000
      )}\n\nJob description:\n${jobText.slice(0, 2500)}`,
    },
  ];
  return callGroq(messages, { temperature: 0.6, maxTokens: 500 });
}

/**
 * Computes which required job skills are missing from the candidate's skill list.
 * Pure logic first, LLM only used to normalize/phrase the gap nicely.
 */
async function generateSkillGapSummary(candidateSkills, jobRequirements) {
  const messages = [
    {
      role: 'system',
      content:
        'Compare the candidate skills to the job requirements. Respond ONLY with a JSON object with keys: ' +
        '"missingSkills" (array of strings from job requirements not covered by candidate skills, allow for synonyms), ' +
        '"matchedSkills" (array of strings).',
    },
    {
      role: 'user',
      content: `Candidate skills: ${candidateSkills.join(', ')}\nJob requirements: ${jobRequirements.join(', ')}`,
    },
  ];
  const content = await callGroq(messages, { json: true, temperature: 0.1, maxTokens: 400 });
  try {
    return JSON.parse(content);
  } catch {
    return { missingSkills: jobRequirements, matchedSkills: [] };
  }
}

module.exports = {
  extractResumeData,
  generateMatchExplanation,
  generateResumeFeedback,
  generateCareerGrowthPlan,
  generateCoverLetter,
  generateSkillGapSummary,
};
