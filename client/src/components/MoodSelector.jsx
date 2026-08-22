import React from 'react';

const MOOD_OPTIONS = [
  { label: 'Happy',    emoji: '😊', key: 'happy',    value: 'Happy' },
  { label: 'Calm',     emoji: '😌', key: 'calm',     value: 'Calm' },
  { label: 'Neutral',  emoji: '😐', key: 'neutral',  value: 'Neutral' },
  { label: 'Sad',      emoji: '😔', key: 'sad',      value: 'Sad' },
  { label: 'Anxious',  emoji: '😰', key: 'anxious',  value: 'Anxious' },
  { label: 'Stressed', emoji: '😫', key: 'stressed', value: 'Stressed' },
  { label: 'Angry',    emoji: '😠', key: 'angry',    value: 'Angry' },
  { label: 'Tired',    emoji: '😴', key: 'tired',    value: 'Tired' },
];

/**
 * MoodSelector — Emoji-based mood picker with Bootstrap-styled buttons for all 8 moods.
 */
const MoodSelector = ({ selectedMood, onChange }) => {
  return (
    <div className="mb-4">
      <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem', color: '#374151' }}>
        Primary Mood <span className="text-danger">*</span>
      </label>
      <div className="d-row row row-cols-2 row-cols-sm-4 g-2">
        {MOOD_OPTIONS.map((opt) => {
          const isActive = selectedMood === opt.value;
          return (
            <div className="col" key={opt.key}>
              <button
                type="button"
                className={`w-100 mood-btn mood-${opt.key}${isActive ? ' active' : ''}`}
                onClick={() => onChange(opt.value)}
                aria-pressed={isActive}
                style={{
                  borderWidth: '2px',
                  borderRadius: '12px',
                  padding: '12px 6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="mood-emoji" style={{ fontSize: '1.6rem' }}>{opt.emoji}</span>
                <span style={{ fontSize: '0.8rem' }}>{opt.label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
export { MOOD_OPTIONS };
