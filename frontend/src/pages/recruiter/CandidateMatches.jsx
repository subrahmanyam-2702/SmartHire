import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCandidatesForJob } from '../../api/match.api';
import { startConversation } from '../../api/message.api';
import CandidateMatchCard from '../../components/recruiter/CandidateMatchCard';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';

export default function CandidateMatches() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteTarget, setInviteTarget] = useState(null);
  const [inviteText, setInviteText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCandidatesForJob(jobId);
        setCandidates(data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load candidates');
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const handleInvite = async () => {
    if (!inviteText.trim()) return toast.error('Write a message first');
    setSending(true);
    try {
      await startConversation({
        recipientId: inviteTarget.candidateId,
        jobId,
        firstMessage: inviteText,
      });
      toast.success('Invitation sent');
      setInviteTarget(null);
      setInviteText('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Candidate Matches</h1>

      {candidates.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">
          No candidates with embeddings found yet.
        </p>
      ) : (
        <div className="space-y-4">
          {candidates.map((c) => (
            <CandidateMatchCard key={c.candidateId} candidate={c} onMessage={setInviteTarget} />
          ))}
        </div>
      )}

      <Modal
        open={!!inviteTarget}
        onClose={() => setInviteTarget(null)}
        title={`Message ${inviteTarget?.name || ''}`}
      >
        <textarea
          rows={4}
          className="input-field"
          placeholder="Hi! We'd love to have you interview for this role..."
          value={inviteText}
          onChange={(e) => setInviteText(e.target.value)}
        />
        <button onClick={handleInvite} disabled={sending} className="btn-primary w-full mt-3">
          {sending ? 'Sending...' : 'Send Invitation'}
        </button>
      </Modal>
    </div>
  );
}
