import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { saveMyProfile } from '../../api/candidateProfile.api';

export default function ProfileForm({ profile, onSaved }) {
  const [form, setForm] = useState({
    fullName: '',
    careerGoal: '',
    yearsOfExperience: 0,
    skillsText: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || '',
        careerGoal: profile.careerGoal || '',
        yearsOfExperience: profile.yearsOfExperience || 0,
        skillsText: (profile.skills || []).join(', '),
      });
    }
  }, [profile]);

  const skillCount = form.skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = form.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const { data } = await saveMyProfile({
        fullName: form.fullName,
        careerGoal: form.careerGoal,
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        skills,
      });
      toast.success('Profile saved');
      onSaved?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="font-display font-semibold text-ink">Profile Details</h3>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
        <input
          className="input-field"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Career Goal</label>
        <input
          className="input-field"
          value={form.careerGoal}
          onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
          placeholder="e.g. Full Stack Developer specializing in web development"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Years of Experience
        </label>
        <input
          type="number"
          min="0"
          className="input-field"
          value={form.yearsOfExperience}
          onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Skills (comma separated)
        </label>
        <textarea
          rows={3}
          className="input-field"
          value={form.skillsText}
          onChange={(e) => setForm({ ...form, skillsText: e.target.value })}
        />
        <p className="text-xs text-slate-400 mt-1">{skillCount} skills</p>
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  );
}
