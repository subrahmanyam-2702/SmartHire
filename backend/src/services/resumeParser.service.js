const pdfParse = require('pdf-parse');

/**
 * Extracts raw text from a resume PDF buffer.
 */
async function parseResumePdf(buffer) {
  const result = await pdfParse(buffer);
  return result.text.replace(/\r/g, '').trim();
}

module.exports = { parseResumePdf };
