import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import LandingPage from './client/pages/LandingPage';
import UserProfile from './client/user-profile/UserProfile';
import UserSetup from './client/user-profile/userSetup';
import Home from './client/pages/Home';
import { AuthProvider } from './client/contexts/AuthContext';
import ProtectedRoute from './client/utils/ProtectedRoutes';
import Hamburger from './client/components/hamburgerButton';
import ComingSoon from './client/pages/comingSoon';
import History from './client/pages/history/History'

function App() {
  const darkTheme = {
    background: '#000000ff',
    text: '#0f0',       
    primary: '#0f0',    
    };

  return (
    <div className="App" style={{ 
      background: darkTheme.background,
      color: darkTheme.text,
      minHeight: '100vh',       
      display: 'flex',          
      justifyContent: 'center', 
      alignItems: 'center',     
      margin: 0,
      padding: 0,
      fontFamily: 'VT323'
    }}>
      <div id='borderApp' style={{border: `5px solid ${darkTheme.primary}`,
        width: '99vw',           
        height: '98vh',          
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px', }}>
      <AuthProvider>
      <div style={{
        position: 'absolute',
        top: '2.5vh',
        right: '1.5vw',
        zIndex: 10
      }}>
        <Hamburger />
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/setup/profile" element={<UserSetup />} />
        
        <Route path="/user/profile" element={<UserProfile />} />
        
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