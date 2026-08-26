import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXERCISE_ICONS = {
  'Deep Breathing': 'bi-wind',
  'Guided Meditation': 'bi-peace',
  'Body Scan': 'bi-person-arms-up',
  'Progressive Muscle Relaxation': 'bi-activity',
  'Mindful Walking': 'bi-person-walking',
  'Journaling': 'bi-journal-text',
  'Visualization': 'bi-eye',
  'Gratitude': 'bi-stars',
};

const getIcon = (title) => {
  for (const [key, icon] of Object.entries(EXERCISE_ICONS)) {
    if (title?.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return 'bi-heart-pulse';
};

/**
 * ExerciseCard
 * Cards stay equal height always.
 * "View Steps" opens a modal overlay — nothing is pushed or covered.
 */
const ExerciseCard = ({ exercise }) => {
  const navigate = useNavigate();
  const icon = getIcon(exercise.title);
  const [showModal, setShowModal] = useState(false);

  const hasSteps = exercise.instructions && exercise.instructions.length > 0;

  return (
    <>
      {/* ---- Card ---- */}
      <div className="mm-card h-100 d-flex flex-column overflow-hidden">
        {/* Top accent strip */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #5B86A6, #0891b2)' }}></div>

        <div className="p-3 d-flex flex-column flex-grow-1">
          {/* Icon + Title */}
          <div className="d-flex align-items-start gap-2 mb-2">
            <div
              className="rounded d-flex align-items-center justify-content-center"
              style={{ width: 38, height: 38, background: '#E6F4F1', flexShrink: 0 }}
            >
              <i className={`bi ${icon}`} style={{ color: '#0F5257', fontSize: '1.15rem' }}></i>
            </div>
            <h6 className="fw-semibold mb-0 lh-sm" style={{ color: '#1A2E35', fontSize: '0.93rem' }}>
              {exercise.title}
            </h6>
          </div>

          {/* Description */}
          <p className="text-muted flex-grow-1" style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
            {exercise.description}
          </p>

          {/* Duration badge */}
          {exercise.duration && (
            <div className="mb-3">
              <span className="badge bg-light text-muted border" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-clock me-1"></i>{exercise.duration}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="d-flex gap-2 mt-auto">
            {hasSteps && (
              <button
                className="btn btn-sm fw-semibold flex-grow-1"
                style={{
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  border: '1px solid #5B86A6',
                  color: '#0F5257',
                  background: 'transparent',
                }}
                onClick={() => setShowModal(true)}
              >
                View Steps
              </button>
            )}
            <button
              className="btn btn-sm btn-outline-secondary fw-semibold"
              style={{ borderRadius: 6, fontSize: '0.8rem' }}
              onClick={() => navigate('/reminders', { state: { prefilledExercise: exercise.title } })}
            >
              <i className="bi bi-alarm me-1"></i>Remind
            </button>
          </div>
        </div>
      </div>

      {/* ---- Modal overlay — rendered in place, does not affect grid layout ---- */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.45)',
            }}
          />

          {/* Dialog */}
          <div
            style={{
              position: 'relative',
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
              width: '100%',
              maxWidth: 480,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="d-flex align-items-center justify-content-between p-3"
              style={{ borderBottom: '1px solid #e5e7eb' }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded d-flex align-items-center justify-content-center"
                  style={{ width: 34, height: 34, background: '#E6F4F1', flexShrink: 0 }}
                >
                  <i className={`bi ${icon}`} style={{ color: '#0F5257', fontSize: '1rem' }}></i>
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.93rem', color: '#1A2E35' }}>
                    {exercise.title}
                  </div>
                  {exercise.duration && (
                    <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-clock me-1"></i>{exercise.duration}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="btn btn-sm btn-light"
                style={{ borderRadius: 6 }}
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="p-3 overflow-auto">
              <div className="fw-semibold mb-2" style={{ fontSize: '0.85rem', color: '#374151' }}>
                Steps to follow:
              </div>
              <ol style={{ fontSize: '0.85rem', color: '#4b5563', paddingLeft: '1.25rem', margin: 0 }}>
                {exercise.instructions.map((step, i) => (
                  <li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.55 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Modal footer */}
            <div className="p-3 d-flex justify-content-end gap-2" style={{ borderTop: '1px solid #e5e7eb' }}>
              <button
                className="btn btn-sm btn-outline-secondary fw-semibold"
                style={{ borderRadius: 6 }}
                onClick={() => {
                  setShowModal(false);
                  navigate('/reminders', { state: { prefilledExercise: exercise.title } });
                }}
              >
                <i className="bi bi-alarm me-1"></i>Set Reminder
              </button>
              <button
                className="btn btn-sm btn-primary fw-semibold"
                style={{ borderRadius: 6, background: '#0F5257', border: 'none' }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseCard;


