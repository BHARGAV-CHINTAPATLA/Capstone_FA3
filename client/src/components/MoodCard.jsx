import React from 'react';

const MOOD_COLORS = {
  Happy:   { bg: '#d1fae5', text: '#065f46' },
  Sad:     { bg: '#dbeafe', text: '#1e40af' },
  Anxious: { bg: '#fef3c7', text: '#92400e' },
  Angry:   { bg: '#fee2e2', text: '#991b1b' },
  Neutral: { bg: '#f3f4f6', text: '#374151' },
};

const MOOD_EMOJI = { Happy: '😊', Sad: '😔', Anxious: '😰', Angry: '😠', Neutral: '😐' };

export const getMoodColor = (mood) => {
  const map = { Happy: '#22c55e', Sad: '#3b82f6', Anxious: '#f59e0b', Angry: '#ef4444', Neutral: '#6b7280' };
  return map[mood] || '#0F5257';
};

/**
 * MoodCard — Bootstrap light list-style card for recent mood entries
 */
const MoodCard = ({ entry }) => {
  const colors = MOOD_COLORS[entry.mood] || MOOD_COLORS.Neutral;
  const emoji = MOOD_EMOJI[entry.mood] || '🙂';
  const dateStr = new Date(entry.date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="d-flex align-items-start gap-2 p-2 rounded mb-2"
      style={{ background: colors.bg, border: `1px solid ${colors.bg}` }}>
      <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{emoji}</span>
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold" style={{ fontSize: '0.85rem', color: colors.text }}>
          {entry.mood}
        </div>
        {entry.affectingMood?.length > 0 && (
          <div style={{ fontSize: '0.75rem', color: colors.text, opacity: 0.8 }}>
            {entry.affectingMood.slice(0, 2).join(', ')}
            {entry.affectingMood.length > 2 && ` +${entry.affectingMood.length - 2}`}
          </div>
        )}
      </div>
      <div style={{ fontSize: '0.7rem', color: colors.text, opacity: 0.7, flexShrink: 0 }}>
        {dateStr}
      </div>
    </div>
  );
};

export default MoodCard;


