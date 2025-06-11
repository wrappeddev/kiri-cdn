import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MediaProvider } from './contexts/MediaContext';
import Layout from './components/Layout/Layout';
import ModalProvider from './components/UI/ModalProvider';

// Pages
import Homepage from './pages/Homepage';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import MediaLibrary from './pages/MediaLibrary';
import Upload from './pages/Upload';
import MediaViewer from './pages/MediaViewer';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';


// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <MediaProvider>
        <ModalProvider>
          <Router>
            <Layout>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />


              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/media"
                element={
                  <ProtectedRoute>
                    <MediaLibrary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/media/:id"
                element={
                  <ProtectedRoute>
                    <MediaViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
          </Router>
        </ModalProvider>
      </MediaProvider>
    </AuthProvider>
  );
}

export default App;
