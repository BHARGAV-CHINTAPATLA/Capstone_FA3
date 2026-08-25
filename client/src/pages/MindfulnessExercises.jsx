import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { getMindfulnessExercises } from '../api';
import ExerciseCard from '../components/ExerciseCard';

/**
 * MindfulnessExercises Page — Bootstrap light card grid
 */
const MindfulnessExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMindfulnessExercises()
      .then(res => setExercises(res.data.mindfulnessExercises || []))
      .catch(() => setError('Could not retrieve mindfulness exercises.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="page-title">
          <i className="bi bi-peace me-2" style={{ color: '#4a6fa5' }}></i>
          Mindfulness Exercises
        </h1>
        <p className="page-subtitle">
          Nurture your calm. Browse relaxation guides and schedule reminders for regular practice.
        </p>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <CircularProgress style={{ color: '#4a6fa5' }} />
        </div>
      ) : (
        <div className="row g-3">
          {exercises.map((exercise) => (
            <div className="col-12 col-md-6 col-lg-4" key={exercise._id}>
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MindfulnessExercises;
