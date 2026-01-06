// App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import LandingPage from './client/pages/LandingPage.js';
import UserProfile from './client/user-profile/UserProfile.js';
import UserSetup from './client/setup/UserSetup.js';
import Home from './client/pages/Home.js';
import History from './client/history/History.js';
import { AuthProvider } from './client/contexts/AuthContext.js';
import ProtectedRoute from './client/components/ProtectedRoutes.js';
import Hamburg from './client/components/hamburg.tsx';
import ComingSoon from './client/pages/comingSoon.tsx';

function App() { // Remove toggleTheme and currentTheme props
  // Define the dark theme colors directly
  const darkTheme = {
    background: '#000000ff', // Example dark background
    text: '#0f0',       // Example light text
    primary: '#0f0',    // Example primary color
    // Add other dark theme properties here as needed
  };

  return (
    <div className="App" style={{ 
      background: darkTheme.background,
      color: darkTheme.text,
      minHeight: '100vh',       // full viewport height
      display: 'flex',          // enable flexbox
      justifyContent: 'center', // center horizontally
      alignItems: 'center',     // center vertically
      margin: 0,
      padding: 0,
      fontFamily: 'VT323'
    }}>
      <div id='borderApp' style={{border: `5px solid ${darkTheme.primary}`,
        width: '99vw',           // responsive width
        height: '98vh',          // responsive height      // optional
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px', }}>
      <AuthProvider>
      {/* Remove the theme toggle button entirely */}
      <div style={{
        position: 'absolute',
        top: '2.5vh',
        right: '1.5vw',
        zIndex: 10
      }}>
        <Hamburg />
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/setup/profile" element={<UserSetup />} />
        
        {/* ✅ REMOVE ProtectedRoute from UserProfile - it's the LOGIN page! */}
        <Route path="/user/profile" element={<UserProfile />} />
        
        {/* ✅ Keep ProtectedRoute only for actual protected pages */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <History/>
          </ProtectedRoute>
        } />
        <Route path="/comingSoon" element={<ComingSoon />} />
      </Routes>
      </AuthProvider>
      </div>
    </div>
  );
}

export default App;