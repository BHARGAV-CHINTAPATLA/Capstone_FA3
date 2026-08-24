import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { getMoodHistory } from '../api';
import NotificationPermissionPrompt from '../components/NotificationPermissionPrompt';
import { Link } from 'react-router-dom';

const getMoodColor = (mood) => {
  const colors = {
    Happy: '#22c55e',
    Calm: '#06b6d4',
    Neutral: '#6b7280',
    Sad: '#3b82f6',
    Anxious: '#f59e0b',
    Stressed: '#a855f7',
    Angry: '#ef4444',
    Tired: '#64748b'
  };
  return colors[mood] || '#4a6fa5';
};

const getMoodEmoji = (mood) => {
  const emojis = {
    Happy: '😊',
    Calm: '😌',
    Neutral: '😐',
    Sad: '😔',
    Anxious: '😰',
    Stressed: '😫',
    Angry: '😠',
    Tired: '😴'
  };
  return emojis[mood] || '🙂';
};

/**
 * Dashboard — Bootstrap layout, MUI for charts
 */
const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMoodHistory()
      .then(res => setHistory(res.data.moodHistory || []))
      .catch(() => setError('Could not load wellness records.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <CircularProgress style={{ color: '#4a6fa5' }} />
      </div>
    );
  }

  const totalEntries = history.length;
  const latestEntry = history[0];
  const currentMood = latestEntry?.mood || null;

  const moodCounts = {
    Happy: 0,
    Calm: 0,
    Neutral: 0,
    Sad: 0,
    Anxious: 0,
    Stressed: 0,
    Angry: 0,
    Tired: 0
  };
  history.forEach(item => {
    if (moodCounts[item.mood] !== undefined) moodCounts[item.mood]++;
  });

  const chartData = Object.keys(moodCounts)
    .filter(k => moodCounts[k] > 0)
    .map(name => ({ name, count: moodCounts[name] }));

  return (
    <div className="container py-4">
      <NotificationPermissionPrompt />

      {/* Page Header */}
      <div className="mb-4">
        <h1 className="page-title">Wellness Dashboard</h1>
        <p className="page-subtitle">Here's a summary of your mental wellness journey.</p>
      </div>

      {error && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}

      {/* ── Stat Cards Row ── */}
      <div className="row g-3 mb-4">
        {/* Current Mood */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="mm-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, background: '#e8f4fd', fontSize: '1rem' }}>
                <i className="bi bi-emoji-smile text-primary"></i>
              </div>
              <span className="text-muted-sm fw-semibold">Current Mood</span>
            </div>
            {currentMood ? (
              <>
                <div style={{ fontSize: '2rem' }}>{getMoodEmoji(currentMood)}</div>
                <div className="fw-bold mt-1" style={{ color: getMoodColor(currentMood), fontSize: '1.1rem' }}>
                  {currentMood}
                </div>
                <div className="text-muted-sm mt-1">
                  {new Date(latestEntry.date).toLocaleDateString()}
                </div>
              </>
            ) : (
              <div className="text-muted-sm mt-2">No entries yet</div>
            )}
          </div>
        </div>

        {/* Total Entries */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="mm-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, background: '#f0fdf4', fontSize: '1rem' }}>
                <i className="bi bi-journal-check" style={{ color: '#22c55e' }}></i>
              </div>
              <span className="text-muted-sm fw-semibold">Total Logs</span>
            </div>
            <div className="fw-bold" style={{ fontSize: '2rem', color: '#1a2332' }}>{totalEntries}</div>
            <div className="text-muted-sm">mood entries recorded</div>
          </div>
        </div>

        {/* Most frequent mood */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="mm-card p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-2">
              <div className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 36, height: 36, background: '#fef9ec', fontSize: '1rem' }}>
                <i className="bi bi-bar-chart-fill" style={{ color: '#f59e0b' }}></i>
              </div>
              <span className="text-muted-sm fw-semibold">Most Frequent</span>
            </div>
            {totalEntries > 0 ? (
              <>
                <div style={{ fontSize: '1.8rem' }}>
                  {getMoodEmoji(Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b))}
                </div>
                <div className="fw-bold" style={{ fontSize: '1rem', color: '#374151' }}>
                  {Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)}
                </div>
              </>
            ) : (
              <div className="text-muted-sm mt-2">No data</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="mm-card p-3 h-100 d-flex flex-column justify-content-between">
            <div className="text-muted-sm fw-semibold mb-3">Quick Actions</div>
            <div className="d-flex flex-column gap-2">
              <Link to="/mood-tracker" className="btn btn-sm btn-primary fw-semibold"
                style={{ background: '#4a6fa5', border: 'none', borderRadius: 7 }}>
                <i className="bi bi-plus-circle me-1"></i> Log Mood
              </Link>
              <Link to="/peer-support" className="btn btn-sm btn-outline-secondary fw-semibold"
                style={{ borderRadius: 7 }}>
                <i className="bi bi-people me-1"></i> Find Peers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="row g-3">
        {/* Bar Chart */}
        <div className="col-12 col-lg-7">
          <div className="mm-card p-3 h-100">
            <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
              <i className="bi bi-bar-chart me-2" style={{ color: '#4a6fa5' }}></i>
              Mood Frequency Breakdown
            </h6>
            {chartData.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
                <i className="bi bi-graph-up" style={{ fontSize: '2.5rem', opacity: 0.3 }}></i>
                <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                  No mood data yet. <Link to="/mood-tracker">Log your first mood</Link>
                </p>
              </div>
            ) : (
              <Box sx={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
                      cursor={{ fill: 'rgba(74,111,165,0.06)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((item, idx) => (
                        <Cell key={`cell-${idx}`} fill={getMoodColor(item.name)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </div>
        </div>

        {/* Recent Entries */}
        <div className="col-12 col-lg-5">
          <div className="mm-card p-3 h-100" style={{ maxHeight: 360, overflowY: 'auto' }}>
            <h6 className="fw-semibold mb-3" style={{ color: '#374151' }}>
              <i className="bi bi-clock-history me-2" style={{ color: '#4a6fa5' }}></i>
              Recent Entries
            </h6>
            {history.length === 0 ? (
              <div className="text-center text-muted py-4" style={{ fontSize: '0.85rem' }}>
                No entries yet.
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                {history.slice(0, 8).map((entry, i) => (
                  <div key={entry._id || i} className="d-flex align-items-center gap-2 p-2 rounded"
                    style={{ background: '#f8fafc', border: '1px solid #e8ecf0' }}>
                    <span style={{ fontSize: '1.3rem' }}>{getMoodEmoji(entry.mood)}</span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: '0.85rem', color: getMoodColor(entry.mood) }}>
                        {entry.mood}
                      </div>
                      <div className="text-muted-sm">
                        {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    {entry.affectingMood?.length > 0 && (
                      <span className="badge bg-light text-muted border" style={{ fontSize: '0.65rem' }}>
                        {entry.affectingMood[0]}
                        {entry.affectingMood.length > 1 && ` +${entry.affectingMood.length - 1}`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { getMoodColor };
export default Dashboard;
