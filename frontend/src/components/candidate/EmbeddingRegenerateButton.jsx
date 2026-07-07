import { useState } from 'react';
import toast from 'react-hot-toast';
import { regenerateEmbedding } from '../../api/candidateProfile.api';

export default function EmbeddingRegenerateButton({ onRegenerated }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data } = await regenerateEmbedding();
      toast.success('Embedding regenerated — companies can now find you via semantic search');
      onRegenerated?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to regenerate embedding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="font-display font-semibold text-ink">Searchability Embedding</h3>
      <p className="text-sm text-slate-500 mt-1">
        After updating your skills manually, regenerate your embedding so companies can find you
        via AI-powered semantic search. (Uploading a resume does this automatically.)
      </p>
      <button onClick={handleClick} disabled={loading} className="btn-primary w-full mt-4">
        {loading ? 'Regenerating...' : 'Regenerate Embedding'}
      </button>
    </div>
  );
}
