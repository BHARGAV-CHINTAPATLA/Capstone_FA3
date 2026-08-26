import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getReminders, createReminder, updateReminder, deleteReminder, getMindfulnessExercises } from '../api';
import ReminderForm from '../components/ReminderForm';

/**
 * Reminders Page — Bootstrap light layout
 */
const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [editingReminder, setEditingReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const location = useLocation();
  const prefilledExercise = location.state?.prefilledExercise;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [remRes, exRes] = await Promise.all([getReminders(), getMindfulnessExercises()]);
      setReminders(remRes.data.reminders || []);
      setExercises(exRes.data.mindfulnessExercises || []);
    } catch {
      setError('Could not load reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFormSubmit = async (formData) => {
    setError('');
    setSuccess('');
    try {
      if (editingReminder) {
        await updateReminder(editingReminder._id, formData);
        setSuccess('Reminder updated successfully!');
      } else {
        await createReminder(formData);
        setSuccess('Reminder scheduled!');
      }
      setEditingReminder(null);
      const res = await getReminders();
      setReminders(res.data.reminders || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save reminder.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return;
    try {
      await deleteReminder(id);
      setSuccess('Reminder deleted.');
      setReminders(reminders.filter(r => r._id !== id));
    } catch {
      setError('Failed to delete reminder.');
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="page-title">
          <i className="bi bi-alarm me-2" style={{ color: '#0F5257' }}></i>
          Wellness Reminders
        </h1>
        <p className="page-subtitle">
          Set reminders for mindfulness exercises and receive browser notifications when they're due.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill"></i> {success}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <CircularProgress style={{ color: '#0F5257' }} />
        </div>
      ) : (
        <div className="row g-4">
          {/* Reminder Form */}
          <div className="col-12 col-md-5">
            <ReminderForm
              initialValues={editingReminder || (prefilledExercise ? { exercise: prefilledExercise } : null)}
              exercises={exercises}
              onSubmit={handleFormSubmit}
              onCancel={editingReminder ? () => setEditingReminder(null) : null}
            />
          </div>

          {/* Reminder List */}
          <div className="col-12 col-md-7">
            <div className="mm-card p-3" style={{ minHeight: 300 }}>
              <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
                <i className="bi bi-list-check me-2" style={{ color: '#0F5257' }}></i>
                Your Scheduled Reminders
              </h6>

              {reminders.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-alarm" style={{ fontSize: '2.5rem', opacity: 0.25 }}></i>
                  <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                    No reminders set yet. Use the form to schedule one.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {reminders.map((reminder) => (
                    <div key={reminder._id} className="d-flex align-items-center gap-3 p-3 rounded border bg-white">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 42, height: 42, background: '#e8f4fd', flexShrink: 0 }}>
                        <i className="bi bi-alarm" style={{ color: '#0F5257', fontSize: '1.1rem' }}></i>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-semibold text-truncate" style={{ fontSize: '0.88rem', color: '#1A2E35' }}>
                          {reminder.exercise}
                        </div>
                        <div className="text-muted-sm">
                          <i className="bi bi-repeat me-1"></i>{reminder.frequency}
                          <span className="mx-1">·</span>
                          <i className="bi bi-clock me-1"></i>{reminder.time}
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-light btn-sm"
                          title="Edit"
                          onClick={() => setEditingReminder(reminder)}
                          style={{ borderRadius: 7 }}
                        >
                          <i className="bi bi-pencil text-primary"></i>
                        </button>
                        <button
                          className="btn btn-light btn-sm"
                          title="Delete"
                          onClick={() => handleDelete(reminder._id)}
                          style={{ borderRadius: 7 }}
                        >
                          <i className="bi bi-trash text-danger"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;


