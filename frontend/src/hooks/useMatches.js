import { useEffect, useState, useCallback } from 'react';
import { getMatchesForCandidate } from '../api/match.api';

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getMatchesForCandidate();
      setMatches(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}
