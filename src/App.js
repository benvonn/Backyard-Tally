import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import LandingPage from './client/pages/LandingPage.js';
import UserProfile from './client/user-profile/UserProfile.js';
import UserSetup from './client/setup/UserSetup.js';
import Home from './client/pages/Home.js';
import { SetupConfirmation } from './client/setup/SetupConfirmation.js';
import { ThemeContext } from './client/components/themes.tsx';
import History from './client/history/History.js';
import { AuthProvider } from './client/contexts/AuthContext.js';
import ProtectedRoute from './client/components/ProtectedRoutes.js';
import Hamburg from './client/components/hamburg.tsx';

function App({ toggleTheme, currentTheme }) {
  const theme = useContext(ThemeContext);

  return (
    <div className="App" style={{ 
      background: theme.background, 
      color: theme.text,
      minHeight: '100vh'
    }}>
      <AuthProvider>
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 99999,
          padding: '10px 20px',
          background: theme.primary,
          color: theme.background,
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        🌓 {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <Hamburg />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/setup/profile" element={<UserSetup />} />
        <Route path="/user/profile" element={<ProtectedRoute>
                                                <UserProfile />
                                              </ProtectedRoute>} />
        <Route path="/user/setup/confirmation" element={<SetupConfirmation />} />
        <Route path="/home" element={<ProtectedRoute>
                                      <Home />
                                      </ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute>
                                          <History/>
                                        </ProtectedRoute>} />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;