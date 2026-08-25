import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../api';

/**
 * SignUp Page — Bootstrap light card form
 */
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signupUser(email, password);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#eef1f6' }}>
      <div className="w-100" style={{ maxWidth: 410 }}>
        {/* Brand header */}
        <div className="text-center mb-4">
          <div className="mb-2" style={{ fontSize: '2.4rem' }}>
            <i className="bi bi-heart-pulse-fill" style={{ color: '#e53e3e' }}></i>
          </div>
          <h1 className="h3 fw-bold" style={{ color: '#1e2a3a' }}>MindMingle</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Sign up to track your mood and support peers anonymously</p>
        </div>

        <div className="card shadow-sm" style={{ borderRadius: 12, border: '1px solid #dde3ea' }}>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-check-circle-fill"></i>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="signupEmail" className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  id="signupEmail"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="signupPassword" className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  id="signupPassword"
                  type="password"
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="signupConfirmPassword" className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  id="signupConfirmPassword"
                  type="password"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
                style={{ background: '#3d5f8f', border: 'none', borderRadius: 8 }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creating account...</>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#3d5f8f' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
