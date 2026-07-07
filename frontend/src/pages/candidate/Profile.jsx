import { useEffect, useState } from 'react';
import { getMyProfile } from '../../api/candidateProfile.api';
import ResumeUploadBox from '../../components/candidate/ResumeUploadBox';
import ProfileForm from '../../components/candidate/ProfileForm';
import EmbeddingRegenerateButton from '../../components/candidate/EmbeddingRegenerateButton';
import Loader from '../../components/common/Loader';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const { data } = await getMyProfile();
      setProfile(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-ink">My Profile</h1>
        <p className="text-slate-500 mt-1">
          Keep your profile updated so the AI can match you with the best opportunities.
        </p>
      </div>

      <ResumeUploadBox onUploaded={({ profile }) => setProfile(profile)} />
      <ProfileForm profile={profile} onSaved={setProfile} />
      <EmbeddingRegenerateButton onRegenerated={loadProfile} />
    </div>
  );
}
