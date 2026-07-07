const cloudinary = require('../config/cloudinary');
const streamifier = require('stream');

/**
 * Uploads a PDF buffer to Cloudinary (free tier) and returns the secure URL.
 */
function uploadPdfBuffer(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'smarthire/resumes',
        public_id: `${Date.now()}-${filename.replace(/\.[^/.]+$/, '')}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.Readable.from(buffer).pipe(uploadStream);
  });
}

module.exports = { uploadPdfBuffer };
