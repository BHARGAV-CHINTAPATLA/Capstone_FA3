import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Page — Bootstrap light card form
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#9CA57D' }}>
      <div className="w-100" style={{ maxWidth: 410 }}>
        {/* Brand header */}
        <div className="text-center mb-4">
          <div className="mb-2" style={{ fontSize: '2.4rem' }}>
            <i className="bi bi-heart-pulse-fill" style={{ color: '#e53e3e' }}></i>
          </div>
          <h1 className="h3 fw-bold" style={{ color: '#1A2E35' }}>MindMingle</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Log in to continue your wellness journey</p>
        </div>

        <div className="card shadow-sm" style={{ borderRadius: 12, border: '1px solid #dde3ea' }}>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2" role="alert">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="loginPassword" className="form-label fw-semibold" style={{ fontSize: '0.88rem' }}>
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
                style={{ background: '#0F5257', border: 'none', borderRadius: 8 }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Logging in...</>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="fw-semibold text-decoration-none" style={{ color: '#0F5257' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;



