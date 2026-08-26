import React, { useState } from 'react';

/**
 * GoalCard Component — Inline editing, delete, toggle completion
 */
const GoalCard = ({ goal, exercises, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editExerciseId, setEditExerciseId] = useState(goal.linkedExercise?._id || '');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    
    await onUpdate(goal._id, {
      title: editTitle,
      linkedExercise: editExerciseId || null
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(goal.title);
    setEditExerciseId(goal.linkedExercise?._id || '');
    setIsEditing(false);
  };

  const isChecked = goal.isDoneToday;

  return (
    <div className={`mm-card p-3 ${isChecked ? 'bg-light border-success-subtle' : ''}`} style={{ transition: 'all 0.25s ease' }}>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="form-label fw-bold text-muted-sm mb-1">Goal Title</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="e.g., Meditate for 10 minutes"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold text-muted-sm mb-1">Linked Exercise (Optional)</label>
            <select
              className="form-select form-select-sm"
              value={editExerciseId}
              onChange={(e) => setEditExerciseId(e.target.value)}
            >
              <option value="">No linked exercise</option>
              {exercises.map((ex) => (
                <option key={ex.id || ex._id} value={ex.id || ex._id}>
                  {ex.title}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light btn-sm fw-semibold" onClick={handleCancel} style={{ borderRadius: 6 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm fw-semibold" style={{ background: '#4a6fa5', border: 'none', borderRadius: 6 }} disabled={!editTitle.trim()}>
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="d-flex align-items-center gap-3">
          {/* Checkbox */}
          <div className="form-check m-0">
            <input
              className="form-check-input border-2"
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(goal._id)}
              style={{
                width: '1.25rem',
                height: '1.25rem',
                cursor: 'pointer',
                borderColor: isChecked ? '#198754' : '#bdc5cd',
                backgroundColor: isChecked ? '#198754' : ''
              }}
            />
          </div>

          {/* Goal Content */}
          <div className="flex-grow-1 min-w-0">
            <div
              className={`fw-semibold text-truncate ${isChecked ? 'text-decoration-line-through text-muted' : ''}`}
              style={{
                fontSize: '0.92rem',
                color: isChecked ? '#6c757d' : '#1a2332',
                opacity: isChecked ? 0.65 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {goal.title}
            </div>
            
            {goal.linkedExercise && (
              <div className="mt-1 d-flex align-items-center">
                <span 
                  className={`badge border d-inline-flex align-items-center gap-1 py-1 px-2 ${isChecked ? 'bg-light text-muted border-secondary-subtle' : 'bg-info-subtle text-info-emphasis border-info-subtle'}`}
                  style={{ fontSize: '0.72rem', borderRadius: 50, fontWeight: 500 }}
                >
                  <i className="bi bi-peace" style={{ fontSize: '0.8rem' }}></i>
                  {goal.linkedExercise.title}
                </span>
              </div>
            )}
          </div>

          {/* Card Actions */}
          <div className="d-flex gap-1">
            <button
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              title="Edit goal"
              onClick={() => setIsEditing(true)}
              style={{ width: 30, height: 30, borderRadius: 6, padding: 0 }}
            >
              <i className="bi bi-pencil text-primary" style={{ fontSize: '0.85rem' }}></i>
            </button>
            <button
              className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
              title="Delete goal"
              onClick={() => onDelete(goal._id)}
              style={{ width: 30, height: 30, borderRadius: 6, padding: 0 }}
            >
              <i className="bi bi-trash text-danger" style={{ fontSize: '0.85rem' }}></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
