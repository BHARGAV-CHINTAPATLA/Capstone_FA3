import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Bootstrap 5 Navbar — light, clean, human-built look
 */
const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active fw-semibold' : 'nav-link';

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top" style={{ borderBottom: '1px solid #d1d9e0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', zIndex: 1030 }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/dashboard" style={{ color: '#3d5f8f', fontSize: '1.25rem' }}>
          <i className="bi bi-heart-pulse-fill" style={{ color: '#e53e3e' }}></i>
          MindMingle
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <Link className={isActive('/dashboard')} to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/mood-tracker')} to="/mood-tracker">
                <i className="bi bi-emoji-smile me-1"></i>Mood Tracker
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/mindfulness')} to="/mindfulness">
                <i className="bi bi-peace me-1"></i>Mindfulness
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/peer-support')} to="/peer-support">
                <i className="bi bi-people me-1"></i>Peer Support
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/chat')} to="/chat">
                <i className="bi bi-chat-dots me-1"></i>Chat
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/reminders')} to="/reminders">
                <i className="bi bi-alarm me-1"></i>Reminders
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleLogout}
              style={{ borderRadius: 6 }}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
