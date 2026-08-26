import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { getGoals, createGoal, updateGoal, toggleGoalDone, deleteGoal, getMindfulnessExercises } from '../api';
import GoalCard from '../components/GoalCard';

/**
 * Goals Page — stand-alone feature matching the MindMingle look and feel
 */
const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newExerciseId, setNewExerciseId] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [goalsRes, exercisesRes] = await Promise.all([
        getGoals(),
        getMindfulnessExercises()
      ]);
      setGoals(goalsRes.data.goals || []);
      setExercises(exercisesRes.data.mindfulnessExercises || []);
    } catch (err) {
      setError('Could not load goals or exercises.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const goalData = {
        title: newTitle.trim(),
        linkedExercise: newExerciseId || null
      };

      const res = await createGoal(goalData);
      setGoals([...goals, res.data.goal]);
      setNewTitle('');
      setNewExerciseId('');
      setSuccess('Goal added successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleGoal = async (id) => {
    setError('');
    setSuccess('');
    try {
      const res = await toggleGoalDone(id);
      setGoals(goals.map(g => g._id === id ? res.data.goal : g));
    } catch (err) {
      setError('Failed to update goal completion status.');
    }
  };

  const handleUpdateGoal = async (id, updatedFields) => {
    setError('');
    setSuccess('');
    try {
      const res = await updateGoal(id, updatedFields);
      setGoals(goals.map(g => g._id === id ? res.data.goal : g));
      setSuccess('Goal updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update goal.');
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    setError('');
    setSuccess('');
    try {
      await deleteGoal(id);
      setGoals(goals.filter(g => g._id !== id));
      setSuccess('Goal deleted successfully.');
    } catch (err) {
      setError('Failed to delete goal.');
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="page-title">
          <i className="bi bi-check2-circle me-2" style={{ color: '#4a6fa5' }}></i>
          Daily Goals
        </h1>
        <p className="page-subtitle">
          Set custom personal goals and link them to mindfulness exercises. Your checklist resets automatically every day.
        </p>
      </div>

      {/* Notifications */}
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
          <CircularProgress style={{ color: '#4a6fa5' }} />
        </div>
      ) : (
        <div className="row g-4">
          {/* Top/Left Section: Add Goal Form */}
          <div className="col-12 col-md-5">
            <div className="mm-card p-3">
              <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
                <i className="bi bi-plus-circle-fill me-2" style={{ color: '#4a6fa5' }}></i>
                Add New Goal
              </h6>

              <form onSubmit={handleAddGoal}>
                <div className="mb-3">
                  <label htmlFor="goalTitle" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
                    What is your goal? <span className="text-danger">*</span>
                  </label>
                  <input
                    id="goalTitle"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Meditate before sleeping"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="goalLinkedExercise" className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>
                    Link to Mindfulness Exercise (Optional)
                  </label>
                  <select
                    id="goalLinkedExercise"
                    className="form-select"
                    value={newExerciseId}
                    onChange={(e) => setNewExerciseId(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">No linked exercise</option>
                    {exercises.map((ex) => (
                      <option key={ex.id || ex._id} value={ex.id || ex._id}>
                        {ex.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary fw-semibold w-100"
                  style={{ background: '#4a6fa5', border: 'none', borderRadius: 8 }}
                  disabled={submitting || !newTitle.trim()}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={18} className="me-2" style={{ color: '#fff' }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-lg me-1"></i>
                      Add Goal
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Section: Goals Checklist */}
          <div className="col-12 col-md-7">
            <div className="mm-card p-3" style={{ minHeight: 300 }}>
              <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
                <i className="bi bi-list-check me-2" style={{ color: '#4a6fa5' }}></i>
                Today's Checklist
              </h6>

              {goals.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-journal-check" style={{ fontSize: '3rem', opacity: 0.25, color: '#4a6fa5' }}></i>
                  <p className="mt-3 mb-0" style={{ fontSize: '0.88rem' }}>
                    No goals defined yet. Use the form on the left to set your first goal!
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      exercises={exercises}
                      onToggle={handleToggleGoal}
                      onUpdate={handleUpdateGoal}
                      onDelete={handleDeleteGoal}
                    />
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

export default Goals;
