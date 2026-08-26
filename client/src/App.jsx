import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import PeerSupport from './pages/PeerSupport';
import MindfulnessExercises from './pages/MindfulnessExercises';
import Reminders from './pages/Reminders';
import ChatPage from './pages/ChatPage';
import Goals from './pages/Goals';

/**
 * App Root — Bootstrap layout + light MUI theme for charts/dialogs
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100" style={{ background: '#f5f7fa' }}>
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracker /></ProtectedRoute>} />
                <Route path="/peer-support" element={<ProtectedRoute><PeerSupport /></ProtectedRoute>} />
                <Route path="/mindfulness" element={<ProtectedRoute><MindfulnessExercises /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
