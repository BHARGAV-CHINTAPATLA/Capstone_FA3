import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

/**
 * NotificationPermissionPrompt — Bootstrap light banner
 */
const NotificationPermissionPrompt = () => {
  const { permission, isSubscribed, subscribe } = useNotifications();

  if ((permission === 'granted' && isSubscribed) || permission === 'denied') {
    return null;
  }

  return (
    <div className="alert alert-info d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4" role="alert"
      style={{ borderRadius: 10, border: '1px solid #bfdbfe', background: '#eff6ff' }}>
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-bell-fill" style={{ color: '#3b82f6', fontSize: '1.2rem' }}></i>
        <div>
          <div className="fw-semibold" style={{ fontSize: '0.88rem', color: '#1e40af' }}>
            Stay on top of your wellness!
          </div>
          <div style={{ fontSize: '0.78rem', color: '#3b82f6' }}>
            Enable notifications to get mindfulness reminders and chat alerts.
          </div>
        </div>
      </div>
      <button
        className="btn btn-sm btn-primary fw-semibold"
        style={{ background: '#3b82f6', border: 'none', borderRadius: 7, whiteSpace: 'nowrap' }}
        onClick={subscribe}
      >
        <i className="bi bi-bell-fill me-1"></i>Enable Notifications
      </button>
    </div>
  );
};

export default NotificationPermissionPrompt;
