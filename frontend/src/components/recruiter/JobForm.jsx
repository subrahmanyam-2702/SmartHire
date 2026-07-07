import { useState } from 'react';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'];

export default function JobForm({ initialValues, onSubmit, submitting }) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    companyName: initialValues?.companyName || '',
    category: initialValues?.category || 'Technology',
    description: initialValues?.description || '',
    requirementsText: (initialValues?.requirements || []).join(', '),
    location: initialValues?.location || 'Remote',
    employmentType: initialValues?.employmentType || 'full-time',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      requirements: form.requirementsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Job Title</label>
          <input
            required
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Company Name</label>
          <input
            required
            className="input-field"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
        <textarea
          required
          rows={5}
          className="input-field"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Requirements (comma separated)
        </label>
        <input
          className="input-field"
          placeholder="React, Node.js, MongoDB"
          value={form.requirementsText}
          onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Location</label>
          <input
            className="input-field"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
          <input
            className="input-field"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Employment Type</label>
          <select
            className="input-field"
            value={form.employmentType}
            onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Saving...' : 'Post Job'}
      </button>
    </form>
  );
}
