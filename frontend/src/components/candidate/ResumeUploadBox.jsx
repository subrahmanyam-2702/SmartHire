import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { uploadResume } from '../../api/resume.api';

export default function ResumeUploadBox({ onUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const { data } = await uploadResume(file);
      toast.success('Resume uploaded — profile auto-filled by AI');
      onUploaded?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-ink">Upload Resume (PDF)</h3>
      <p className="text-sm text-slate-500 mt-1">
        AI will auto-extract your skills, experience, and career goal — no manual entry needed.
      </p>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-4 w-full border-2 border-dashed border-slate-300 rounded-lg py-10 text-center hover:border-brand-400 hover:bg-brand-50/40 transition-colors"
      >
        <p className="font-medium text-ink">
          {uploading ? 'Uploading & analyzing...' : 'Click to upload your resume'}
        </p>
        <p className="text-xs text-slate-400 mt-1">PDF only, max 5MB</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
