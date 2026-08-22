import React, { useState, useEffect } from 'react';

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'];

const convert24hTo12h = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':');
  let hours = parseInt(h, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
};

const convert12hTo24h = (t) => {
  if (!t) return '';
  const parts = t.split(' ');
  if (parts.length !== 2) return '';
  const [timeStr, ampm] = parts;
  const [h, m] = timeStr.split(':');
  let hours = parseInt(h, 10);
  if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${m}`;
};

/**
 * ReminderForm — Bootstrap light form
 */
const ReminderForm = ({ initialValues, exercises, onSubmit, onCancel }) => {
  const [exercise, setExercise] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [time24, setTime24] = useState('');

  useEffect(() => {
    if (initialValues) {
      setExercise(initialValues.exercise || '');
      setFrequency(initialValues.frequency || 'Daily');
      setTime24(initialValues.time ? convert12hTo24h(initialValues.time) : '');
    } else {
      setExercise('');
      setFrequency('Daily');
      setTime24('');
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!exercise || !frequency || !time24) return;
    onSubmit({ exercise, frequency, time: convert24hTo12h(time24) });
  };

  return (
    <div className="mm-card p-3">
      <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
        <i className={`bi ${initialValues?._id ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: '#4a6fa5' }}></i>
        {initialValues?._id ? 'Edit Reminder' : 'Add New Reminder'}
      </h6>

      <form onSubmit={handleSubmit}>
        {/* Exercise Select */}
        <div className="mb-3">
          <label htmlFor="reminderExercise" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
            Exercise <span className="text-danger">*</span>
          </label>
          <select
            id="reminderExercise"
            className="form-select"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            required
          >
            <option value="">Select an exercise...</option>
            {exercises.map((ex) => (
              <option key={ex.id || ex.title} value={ex.title}>{ex.title}</option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div className="mb-3">
          <label htmlFor="reminderFrequency" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
            Frequency <span className="text-danger">*</span>
          </label>
          <div className="d-flex gap-2">
            {FREQUENCIES.map((freq) => (
              <button
                key={freq}
                type="button"
                className={`btn btn-sm flex-grow-1 ${frequency === freq ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: 7, fontSize: '0.82rem', background: frequency === freq ? '#4a6fa5' : '', borderColor: frequency === freq ? '#4a6fa5' : '' }}
                onClick={() => setFrequency(freq)}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="mb-4">
          <label htmlFor="reminderTime" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
            Reminder Time <span className="text-danger">*</span>
          </label>
          <input
            id="reminderTime"
            type="time"
            className="form-control"
            value={time24}
            onChange={(e) => setTime24(e.target.value)}
            required
          />
          {time24 && (
            <div className="mt-1 text-muted-sm">
              <i className="bi bi-clock me-1"></i>
              Notification will be sent at {convert24hTo12h(time24)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-primary fw-semibold flex-grow-1"
            style={{ background: '#4a6fa5', border: 'none', borderRadius: 8 }}
          >
            <i className={`bi ${initialValues?._id ? 'bi-check-lg' : 'bi-alarm-fill'} me-1`}></i>
            {initialValues?._id ? 'Save Changes' : 'Set Reminder'}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-light fw-semibold" style={{ borderRadius: 8 }} onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReminderForm;
