import './App.css';
import {Routes, Route} from 'react-router-dom';
import LandingPage from './client/gameboard/LandingPage.js';
import UserProfile from './client/user-profile/UserProfile.js';
import UserSetup from './client/setup/UserSetup.js';
import BoardSetup from './client/setup/UserBoard.js';

function App() {
  return(
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/setup/profile" element={<UserSetup />} />
        <Route path="/user/setup/board" element={<BoardSetup />} />
        <Route path="/user/profile" element={<UserProfile />} />
      </Routes>
    </div>
  )
}

export default App;
