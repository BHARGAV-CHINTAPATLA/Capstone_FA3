import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXERCISE_ICONS = {
  'Deep Breathing': 'bi-wind',
  'Box Breathing': 'bi-wind',
  'Guided Meditation': 'bi-peace',
  'Body Scan': 'bi-person-arms-up',
  'Progressive Muscle Relaxation': 'bi-activity',
  'Mindful Walking': 'bi-person-walking',
  'Journaling': 'bi-journal-text',
  'Visualization': 'bi-eye',
  'Gratitude': 'bi-stars',
  'Stretching': 'bi-activity',
};

const getIcon = (title) => {
  for (const [key, icon] of Object.entries(EXERCISE_ICONS)) {
    if (title?.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'bi-heart-pulse';
};

/**
 * ExerciseCard — Bootstrap light card
 */
const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const icon = getIcon(exercise.title);

  return (
    <div className="mm-card h-100 d-flex flex-column overflow-hidden">
      {/* Colored top strip */}
      <div style={{ height: 5, background: 'linear-gradient(90deg, #4a6fa5, #56b870)' }}></div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Icon + Title */}
        <div className="d-flex align-items-start gap-2 mb-2">
          <div className="rounded d-flex align-items-center justify-content-center"
            style={{ width: 40, height: 40, background: '#f0f5fb', flexShrink: 0 }}>
            <i className={`bi ${icon}`} style={{ color: '#4a6fa5', fontSize: '1.2rem' }}></i>
          </div>
          <h6 className="fw-semibold mb-0 lh-sm" style={{ color: '#1a2332', fontSize: '0.95rem' }}>
            {exercise.title}
          </h6>
        </div>

        {/* Description */}
        <p className="text-muted flex-grow-1" style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
          {exercise.description}
        </p>

        {/* Duration badge if present */}
        {exercise.duration && (
          <div className="mb-2">
            <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
              <i className="bi bi-clock me-1"></i>{exercise.duration}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="d-flex gap-2 mt-auto pt-2">
          <button
            className="btn btn-sm btn-outline-primary fw-semibold flex-grow-1"
            style={{ borderRadius: 7, fontSize: '0.8rem' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`bi ${isOpen ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
            {isOpen ? 'Hide Details' : 'View Details'}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary fw-semibold"
            style={{ borderRadius: 7, fontSize: '0.8rem' }}
            onClick={() => navigate('/reminders', { state: { prefilledExercise: exercise.title } })}
          >
            <i className="bi bi-alarm me-1"></i>Remind
          </button>
        </div>
      </div>

      {/* Collapsible steps */}
      {exercise.instructions && exercise.instructions.length > 0 && (
        <div className={`collapse border-top ${isOpen ? 'show' : ''}`} id={`steps-${exercise.id}`}>
          <div className="p-3" style={{ background: '#f8fafc' }}>
            <div className="fw-semibold mb-2" style={{ fontSize: '0.82rem', color: '#374151' }}>Instructions:</div>
            <ol className="ps-3 mb-0" style={{ fontSize: '0.8rem', color: '#5a6a7e' }}>
              {exercise.instructions.map((step, i) => (
                <li key={i} className="mb-1">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
