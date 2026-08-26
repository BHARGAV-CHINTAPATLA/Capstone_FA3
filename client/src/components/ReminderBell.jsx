import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReminders } from '../api';

const frequencyOrder = ['Daily', 'Monthly', 'Weekly'];

export const sortRemindersByTime = (reminders) => [...reminders].sort((first, second) => {
  const firstMinutes = Number(first.time?.split(':')[0] || 0) * 60 + Number(first.time?.split(':')[1] || 0);
  const secondMinutes = Number(second.time?.split(':')[0] || 0) * 60 + Number(second.time?.split(':')[1] || 0);
  return secondMinutes - firstMinutes;
});

export const groupReminders = (reminders) => frequencyOrder.reduce((groups, frequency) => {
  groups[frequency] = sortRemindersByTime(reminders.filter(reminder => reminder.frequency === frequency));
  return groups;
}, {});

const ReminderBell = () => {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchReminders = async () => {
    try {
      const response = await getReminders();
      setReminders(response.data.reminders || []);
      setError('');
    } catch {
      setError('Could not load reminders.');
    }
  };

  useEffect(() => {
    fetchReminders();
    window.addEventListener('reminders-updated', fetchReminders);
    return () => window.removeEventListener('reminders-updated', fetchReminders);
  }, []);

  const groupedReminders = groupReminders(reminders);

  return (
    <div className="dropdown position-relative">
      <button
        type="button"
        className="btn btn-light position-relative"
        aria-label="Open reminders"
        aria-expanded={open}
        onClick={() => setOpen(current => !current)}
        style={{ borderRadius: 8 }}
      >
        <i className="bi bi-bell" aria-hidden="true"></i>
        {reminders.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {reminders.length}
          </span>
        )}
      </button>

      {open && (
        <div className="dropdown-menu dropdown-menu-end show p-0 shadow" style={{ width: 320, maxWidth: 'calc(100vw - 2rem)' }}>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <span className="fw-semibold">Your reminders</span>
            <Link to="/reminders" className="small text-decoration-none" onClick={() => setOpen(false)}>
              Manage
            </Link>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {error ? (
              <p className="text-danger small px-3 py-3 mb-0">{error}</p>
            ) : reminders.length === 0 ? (
              <p className="text-muted small px-3 py-3 mb-0">No reminders scheduled.</p>
            ) : (
              frequencyOrder.map(frequency => groupedReminders[frequency].length > 0 && (
                <div key={frequency}>
                  <div className="px-3 pt-3 pb-1 text-uppercase text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                    {frequency}
                  </div>
                  {groupedReminders[frequency].map(reminder => (
                    <div key={reminder._id} className="d-flex align-items-center gap-2 px-3 py-2 border-bottom">
                      <i className="bi bi-alarm text-primary" aria-hidden="true"></i>
                      <div className="flex-grow-1 min-w-0">
                        <div className="text-truncate small fw-semibold">{reminder.exercise}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{reminder.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderBell;
