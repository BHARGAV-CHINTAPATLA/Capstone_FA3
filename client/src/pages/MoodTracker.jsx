import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveMood } from '../api';
import MoodSelector from '../components/MoodSelector';

const FACTORS = [
  'Studies', 'Work', 'Family', 'Relationships',
  'Sleep', 'Health', 'Social Life', 'Other'
];

const HELP_OPTIONS = [
  { value: 'mindfulness', label: 'A mindfulness exercise', emoji: '🧘' },
  { value: 'peerSupport', label: 'Anonymous peer support', emoji: '💬' },
  { value: 'trackOnly', label: 'Just track my mood', emoji: '📊' },
  { value: 'reflect', label: 'A space to reflect', emoji: '✍️' }
];

/**
 * MoodTracker Page Component implementing the enhanced Mood Check-in flow.
 */
const MoodTracker = () => {
  const navigate = useNavigate();

  // Core required fields
  const [mood, setMood] = useState('');
  const [intensity, setIntensity] = useState(3);

  // Optional fields
  const [description, setDescription] = useState(''); // What's on your mind? (Note)
  const [selectedFactors, setSelectedFactors] = useState([]); // Factors Affecting Mood
  const [energyLevel, setEnergyLevel] = useState(3); // Optional energy level scale
  const [sleepQuality, setSleepQuality] = useState(3); // Optional sleep quality scale
  const [needRightNow, setNeedRightNow] = useState('trackOnly'); // What Do You Need Right Now?

  // UI state
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const handleToggleFactor = (factor) => {
    setSelectedFactors(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!mood) {
      setError('Please select how you are feeling today.');
      return;
    }
    if (!intensity) {
      setError('Please rate the intensity of your feeling.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 2. Build the mood check-in payload matching the structure requested
      const payload = {
        mood,
        intensity: Number(intensity),
        description: description.trim(), // maps to description on backend
        affectingMood: selectedFactors, // maps to affectingMood on backend
        energyLevel: Number(energyLevel),
        sleepQuality: Number(sleepQuality),
        needRightNow
      };

      await saveMood(payload);

      // 3. Set confirmation message
      setSuccess('Your check-in has been saved. Thank you for taking a moment for yourself.');

      // 4. Handle post-save routing after a slight delay for user feedback
      setTimeout(() => {
        if (needRightNow === 'mindfulness') {
          navigate('/mindfulness', { state: { mood } });
        } else if (needRightNow === 'peerSupport') {
          navigate('/peer-support', { state: { mood } });
        } else if (needRightNow === 'reflect') {
          setReflectionSaved(true);
          setSuccess(''); // clear alert since we are transitioning to dedicated view
          setLoading(false);
        } else {
          // Default: trackOnly
          navigate('/dashboard');
        }
      }, 1500);

    } catch (err) {
      console.error('Error saving mood check-in:', err);
      setError(err.response?.data?.error || 'Failed to save your check-in. Please try again.');
      setLoading(false);
    }
  };

  // Dedicated Reflection / Journaling View (if 'reflect' is selected)
  if (reflectionSaved) {
    return (
      <div className="container py-4" style={{ maxWidth: 650 }}>
        <div className="card border-0 shadow-sm text-center p-4 p-md-5" style={{ borderRadius: 14 }}>
          <div className="mb-3 text-success" style={{ fontSize: '3rem' }}>
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <h2 className="fw-bold mb-3" style={{ color: '#1A2E35' }}>Reflective Journal Saved</h2>
          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Taking time to reflect is a powerful step in processing your emotions. Your thoughts have been recorded safely in your private journal history.
          </p>

          <div className="p-3 mb-4 rounded border text-start bg-light">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 fw-semibold" style={{ fontSize: '0.8rem' }}>
                Mood: {mood} (Intensity: {intensity}/5)
              </span>
              <span className="text-muted-sm">{new Date().toLocaleDateString()}</span>
            </div>
            {description ? (
              <p className="mb-0 text-dark font-monospace" style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                "{description}"
              </p>
            ) : (
              <p className="mb-0 text-muted italic small">No written reflection notes added for this check-in.</p>
            )}
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              className="btn btn-primary py-2 fw-semibold"
              onClick={() => {
                // Reset form to start a new check-in
                setMood('');
                setIntensity(3);
                setDescription('');
                setSelectedFactors([]);
                setEnergyLevel(3);
                setSleepQuality(3);
                setNeedRightNow('trackOnly');
                setReflectionSaved(false);
              }}
              style={{ background: '#0F5257', border: 'none', borderRadius: 8 }}
            >
              Start New Check-in
            </button>
            <div className="row g-2">
              <div className="col">
                <button
                  className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                  style={{ borderRadius: 8 }}
                  onClick={() => navigate('/dashboard')}
                >
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-outline-secondary w-100 py-2 fw-semibold"
                  style={{ borderRadius: 8 }}
                  onClick={() => navigate('/mindfulness')}
                >
                  <i className="bi bi-peace me-1"></i> Exercises
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold" style={{ color: '#1A2E35', fontSize: '1.8rem' }}>
          How are you feeling today?
        </h1>
        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
          Take a moment to check in with yourself. Your feelings matter.
        </p>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
        <div className="card-body p-4 p-md-5">

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3" role="alert" style={{ fontSize: '0.88rem' }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3" role="alert" style={{ fontSize: '0.88rem' }}>
              <i className="bi bi-check-circle-fill"></i> {success}
            </div>
          )}

          <form onSubmit={handleSave}>
            
            {/* 1. Mood Selector (Required) */}
            <div className="mb-4">
              <MoodSelector selectedMood={mood} onChange={setMood} />
            </div>

            {/* 2. Intensity Selection (Required) */}
            <div className="mb-4">
              <label htmlFor="moodIntensityRange" className="form-label fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#374151' }}>
                How intense is this feeling? <span className="text-danger">*</span>
              </label>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted-sm">Low (1)</span>
                <input
                  id="moodIntensityRange"
                  type="range"
                  className="form-range flex-grow-1"
                  min="1"
                  max="5"
                  step="1"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  style={{ accentColor: '#0F5257' }}
                />
                <span className="text-muted-sm">High (5)</span>
                <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.9rem', minWidth: 40, background: '#0F5257' }}>
                  {intensity}
                </span>
              </div>
            </div>

            {/* Collapsible Trigger for Optional Fields */}
            <div className="mb-4">
              <button
                type="button"
                className="btn btn-link text-decoration-none ps-0 fw-semibold text-primary d-flex align-items-center gap-1"
                onClick={() => setShowOptional(!showOptional)}
                aria-expanded={showOptional}
              >
                {showOptional ? (
                  <>Hide optional metrics <i className="bi bi-chevron-up"></i></>
                ) : (
                  <>Add optional details (Sleep, Energy, Factors) <i className="bi bi-chevron-down"></i></>
                )}
              </button>
            </div>

            {/* Optional Fields Container */}
            {showOptional && (
              <div className="p-3 mb-4 rounded border" style={{ background: '#F0F9F7', borderColor: '#e2e8f0' }}>
                
                {/* 3. Factors Affecting Mood (Optional) */}
                <div className="mb-4">
                  <label className="form-label fw-semibold d-block mb-1" style={{ fontSize: '0.9rem', color: '#374151' }}>
                    What's affecting your mood? <span className="text-muted-sm fw-normal">(Optional)</span>
                  </label>
                  <p className="text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                    Select any areas that currently influence how you feel.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {FACTORS.map((factor) => {
                      const isSelected = selectedFactors.includes(factor);
                      return (
                        <button
                          key={factor}
                          type="button"
                          className={`factor-tag${isSelected ? ' active' : ''}`}
                          onClick={() => handleToggleFactor(factor)}
                        >
                          {isSelected && <i className="bi bi-check2 me-1"></i>}
                          {factor}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. What's on your mind? (Optional Note) */}
                <div className="mb-4">
                  <label htmlFor="descriptionInput" className="form-label fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#374151' }}>
                    What's on your mind? <span className="text-muted-sm fw-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="descriptionInput"
                    className="form-control"
                    rows="3"
                    placeholder="Share anything you'd like to reflect on..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: 'vertical', fontSize: '0.88rem' }}
                  ></textarea>
                </div>

                {/* 5. Energy Level Slider (Optional) */}
                <div className="mb-4">
                  <label htmlFor="energyRange" className="form-label fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#374151' }}>
                    How is your energy level? <span className="text-muted-sm fw-normal">(Optional)</span>
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted-sm" style={{ fontSize: '0.78rem' }}>Low</span>
                    <input
                      id="energyRange"
                      type="range"
                      className="form-range flex-grow-1"
                      min="1"
                      max="5"
                      step="1"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(Number(e.target.value))}
                      style={{ accentColor: '#0F5257' }}
                    />
                    <span className="text-muted-sm" style={{ fontSize: '0.78rem' }}>High</span>
                    <span className="badge bg-secondary px-2.5 py-1.5" style={{ fontSize: '0.8rem', minWidth: 32 }}>
                      {energyLevel}
                    </span>
                  </div>
                </div>

                {/* 6. Sleep Quality Slider (Optional) */}
                <div>
                  <label htmlFor="sleepRange" className="form-label fw-semibold mb-1" style={{ fontSize: '0.9rem', color: '#374151' }}>
                    How did you sleep? <span className="text-muted-sm fw-normal">(Optional)</span>
                  </label>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-muted-sm" style={{ fontSize: '0.78rem' }}>Poor</span>
                    <input
                      id="sleepRange"
                      type="range"
                      className="form-range flex-grow-1"
                      min="1"
                      max="5"
                      step="1"
                      value={sleepQuality}
                      onChange={(e) => setSleepQuality(Number(e.target.value))}
                      style={{ accentColor: '#0F5257' }}
                    />
                    <span className="text-muted-sm" style={{ fontSize: '0.78rem' }}>Great</span>
                    <span className="badge bg-secondary px-2.5 py-1.5" style={{ fontSize: '0.8rem', minWidth: 32 }}>
                      {sleepQuality}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* 7. What Do You Need Right Now? */}
            <div className="mb-4 pb-2">
              <label className="form-label fw-semibold mb-2" style={{ fontSize: '0.95rem', color: '#374151' }}>
                What would help you right now?
              </label>
              <div className="row g-2">
                {HELP_OPTIONS.map((opt) => {
                  const isActive = needRightNow === opt.value;
                  return (
                    <div className="col-12 col-sm-6" key={opt.value}>
                      <button
                        type="button"
                        className={`w-100 btn btn-sm p-3 text-start d-flex align-items-center gap-2 border fw-semibold ${isActive ? 'btn-primary border-primary' : 'btn-light border-secondary-subtle bg-white'}`}
                        style={{
                          borderRadius: '10px',
                          color: isActive ? '#fff' : '#4a5568',
                          background: isActive ? '#0F5257' : '#fff',
                          borderColor: isActive ? '#0F5257' : '#e2e8f0',
                          transition: 'all 0.15s'
                        }}
                        onClick={() => setNeedRightNow(opt.value)}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{opt.emoji}</span>
                        <span style={{ fontSize: '0.85rem' }}>{opt.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 8. Action Buttons */}
            <div className="d-flex align-items-center gap-2 mt-4 pt-2">
              <button
                type="submit"
                className="btn btn-primary px-4 py-2.5 fw-semibold flex-grow-1 flex-sm-grow-0"
                disabled={loading}
                style={{ background: '#0F5257', border: 'none', borderRadius: 8 }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
                ) : (
                  'Save Check-in'
                )}
              </button>
              <button
                type="button"
                className="btn btn-light px-4 py-2.5 fw-semibold"
                style={{ borderRadius: 8 }}
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default MoodTracker;


