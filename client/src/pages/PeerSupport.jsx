import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getPeers, startChat } from '../api';
import PeerCard from '../components/PeerCard';

const MOODS = ['Happy', 'Sad', 'Anxious', 'Angry', 'Neutral', 'Calm', 'Stressed', 'Tired'];
const FACTORS = ['Exams', 'Career', 'Family', 'Relationships', 'Health', 'Sleep', 'Work', 'Finance'];

/**
 * PeerSupport Page — Bootstrap light search + cards
 */
const PeerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [peers, setPeers] = useState([]);
  const [selectedMood, setSelectedMood] = useState(location.state?.mood || '');
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chatStarting, setChatStarting] = useState(false);

  const fetchPeers = async () => {
    setLoading(true);
    setError('');
    try {
      const filters = {
        mood: selectedMood || undefined,
        affectingMood: selectedFactors.length > 0 ? selectedFactors : undefined,
      };
      const res = await getPeers(filters);
      setPeers(res.data.users || []);
    } catch {
      setError('Could not load matching peers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPeers(); }, [selectedMood, selectedFactors]);

  const handleToggleMood = (mood) => setSelectedMood(prev => prev === mood ? '' : mood);
  const handleToggleFactor = (factor) =>
    setSelectedFactors(prev => prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]);

  const handleStartChat = async (anonymousUsername) => {
    setChatStarting(true);
    setError('');
    try {
      const res = await startChat(anonymousUsername);
      navigate(`/chat?chatId=${res.data.chatId}&peer=${encodeURIComponent(anonymousUsername)}`);
    } catch {
      setError('Failed to start chat. Please try again.');
    } finally {
      setChatStarting(false);
    }
  };

  const filteredPeers = peers.filter(p => {
    const q = searchQuery.toLowerCase();
    return !q || p.description?.toLowerCase().includes(q) || p.anonymousUsername.toLowerCase().includes(q);
  });

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="page-title">
          <i className="bi bi-people me-2" style={{ color: '#0F5257' }}></i>
          Peer Support
        </h1>
        <p className="page-subtitle">
          Find anonymous users experiencing similar moods or situations. All identities are kept private.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </div>
      )}
      {chatStarting && (
        <div className="alert alert-info d-flex align-items-center gap-2" role="alert">
          <span className="spinner-border spinner-border-sm me-1"></span> Opening private chat...
        </div>
      )}

      {/* ── Filter Panel ── */}
      <div className="mm-card p-3 mb-4">
        {/* Search */}
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by keywords or anonymous username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mood Filter */}
        <div className="mb-2">
          <div className="text-muted-sm fw-semibold mb-2">Filter by Mood:</div>
          <div className="d-flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`factor-tag${selectedMood === mood ? ' active' : ''}`}
                onClick={() => handleToggleMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Factor Filter */}
        <div>
          <div className="text-muted-sm fw-semibold mb-2">Filter by Affecting Factor:</div>
          <div className="d-flex flex-wrap gap-2">
            {FACTORS.map((factor) => (
              <button
                key={factor}
                type="button"
                className={`factor-tag${selectedFactors.includes(factor) ? ' active' : ''}`}
                onClick={() => handleToggleFactor(factor)}
              >
                {factor}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter display */}
        {(selectedMood || selectedFactors.length > 0) && (
          <div className="mt-3 d-flex align-items-center gap-2">
            <span className="text-muted-sm">Active filters:</span>
            {selectedMood && <span className="badge bg-primary">{selectedMood}</span>}
            {selectedFactors.map(f => <span key={f} className="badge bg-secondary">{f}</span>)}
            <button
              className="btn btn-link btn-sm text-danger p-0 text-decoration-none"
              onClick={() => { setSelectedMood(''); setSelectedFactors([]); }}
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <CircularProgress style={{ color: '#0F5257' }} />
        </div>
      ) : filteredPeers.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-people" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
          <p className="mt-2 mb-0">No matching peers found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="text-muted-sm mb-3">
            Showing {filteredPeers.length} anonymous peer{filteredPeers.length !== 1 ? 's' : ''}
          </div>
          <div className="row g-3">
            {filteredPeers.map((peer) => (
              <div className="col-12 col-md-6 col-lg-4" key={peer.anonymousUsername}>
                <PeerCard peer={peer} onChatStart={handleStartChat} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PeerSupport;


