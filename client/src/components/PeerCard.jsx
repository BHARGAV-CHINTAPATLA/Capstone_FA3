import React from 'react';

const MOOD_COLORS = {
  Happy:   { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  Sad:     { bg: '#dbeafe', text: '#1e40af', border: '#bfdbfe' },
  Anxious: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  Angry:   { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  Neutral: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
};

const MOOD_EMOJI = { Happy: '😊', Sad: '😔', Anxious: '😰', Angry: '😠', Neutral: '😐' };

/**
 * PeerCard — Bootstrap light card with highlighted mood tag at top
 */
const PeerCard = ({ peer, onChatStart }) => {
  const colors = MOOD_COLORS[peer.mood] || MOOD_COLORS.Neutral;
  const emoji = MOOD_EMOJI[peer.mood] || '🙂';

  return (
    <div className="peer-card">
      {/* Mood Tag at top — prominently highlighted */}
      <div
        className="peer-card-header d-flex align-items-center gap-2"
        style={{ background: colors.bg, color: colors.text, borderBottom: `1px solid ${colors.border}` }}
      >
        <span style={{ fontSize: '1rem' }}>{emoji}</span>
        <span>{peer.mood}</span>
      </div>

      <div className="peer-card-body d-flex flex-column flex-grow-1">
        {/* Anonymous Username */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{ width: 36, height: 36, background: '#4a6fa5', fontSize: '0.82rem', flexShrink: 0 }}>
            {peer.anonymousUsername?.charAt(peer.anonymousUsername.length - 4) || 'A'}
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: '0.88rem', color: '#1a2332' }}>
              {peer.anonymousUsername}
            </div>
            <div className="text-muted-sm">Anonymous User</div>
          </div>
        </div>

        {/* What's Affecting Their Mood */}
        {peer.affectingMood?.length > 0 && (
          <div className="mb-3">
            <div className="text-muted-sm fw-semibold mb-1">What's affecting their mood:</div>
            <div className="d-flex flex-wrap gap-1">
              {peer.affectingMood.map((factor, i) => (
                <span key={i} className="badge bg-light text-muted border" style={{ fontSize: '0.72rem', fontWeight: 500 }}>
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* What's On Their Mind */}
        {peer.description && (
          <div className="mb-3 flex-grow-1">
            <div className="text-muted-sm fw-semibold mb-1">What's on their mind:</div>
            <p className="mb-0" style={{ fontSize: '0.82rem', color: '#4a5568', lineHeight: 1.5 }}>
              "{peer.description.length > 120 ? peer.description.slice(0, 120) + '...' : peer.description}"
            </p>
          </div>
        )}

        {/* Start Chat Button */}
        <button
          className="btn btn-primary btn-sm w-100 fw-semibold mt-auto"
          style={{ background: '#4a6fa5', border: 'none', borderRadius: 8 }}
          onClick={() => onChatStart(peer.anonymousUsername)}
        >
          <i className="bi bi-chat-dots me-1"></i>Start Chat
        </button>
      </div>
    </div>
  );
};

export default PeerCard;
