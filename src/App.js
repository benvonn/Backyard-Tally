// App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import LandingPage from './client/pages/LandingPage.js';
import UserProfile from './client/user-profile/UserProfile.js';
import UserSetup from './client/setup/UserSetup.js';
import Home from './client/pages/Home.js';
// Remove ThemeContext import since we're not using it for the main styles anymore
// import { ThemeContext } from './client/components/themes.tsx';
import History from './client/history/History.js';
import { AuthProvider } from './client/contexts/AuthContext.js';
import ProtectedRoute from './client/components/ProtectedRoutes.js';
import Hamburg from './client/components/hamburg.tsx';

function App() { // Remove toggleTheme and currentTheme props
  // Define the dark theme colors directly
  const darkTheme = {
    background: '#121212', // Example dark background
    text: '#1aff00ff',       // Example light text
    primary: '#bb86fc',    // Example primary color
    // Add other dark theme properties here as needed
  };

  return (
    <div className="App" style={{ 
      background: darkTheme.background, // Apply dark background
      color: darkTheme.text,            // Apply light text
      minHeight: '100vh'
    }}>
      <AuthProvider>
      {/* Remove the theme toggle button entirely */}
      <Hamburg />
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
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;