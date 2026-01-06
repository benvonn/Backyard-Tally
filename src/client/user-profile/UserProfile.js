import React, { useState, useEffect } from "react";
import UserDropdown from "../components/userdropdown.tsx";
import isValidOfflineToken from "./ValidToken.js";
import { useNavigate } from "react-router";
import { getUserMetadata, setUserMetadata } from "../utils/onboarding.js";
import { useAuth } from "../contexts/AuthContext.js";
import GameDataTable from "./UploadLocalStorage.tsx";
import Navbar from 'react-bootstrap/Navbar';
import styled from "@emotion/styled";

const URL = "bytbe.azurewebsites.net"; 
const USERS_URL = `${URL}/api/users`;
const LOGIN_URL = `${URL}/api/users/login`;

const LogoutButtonStyle = styled.button`
  background: #000000ff;
  border: 2.5px solid #f00; 
  color: #f00; 
  font-family: VT323;
  font-size: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 18%;
  text-align: center;
  justify-content: start;
  align-items: start;
  transition: all 0.2s ease;

  &:hover {
    background: #f00;
    color: #000;
    border-color: #000;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #ff1a00;
    outline-offset: 2px;
  }
`;

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const navigate = useNavigate();
  const {login} = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(USERS_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setUsers(data);
        localStorage.setItem("allUsers", JSON.stringify(data)); 
      } catch (err) {
        loadUsersFromCache();
      }
    };

    fetchUsers();
  }, []); 

  useEffect(() => {
    const checkOfflineLogin = () => {
      const storedToken = localStorage.getItem("offlineToken");
      const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "null");

      if (storedToken && storedProfile) {
        try {
          if (isValidOfflineToken(storedToken)) {
            setProfile(storedProfile);
            
            const meta = getUserMetadata(storedProfile.id);
            if (!meta.hasCompletedInitialLogin) {
              navigate("/home");
            }
            
            return;
          }
        } catch (e) {
        }

      }

      if (!storedToken || !storedProfile || !isValidOfflineToken(storedToken)) {
        localStorage.removeItem("offlineToken");
        localStorage.removeItem("userProfile");
      }

    };

    checkOfflineLogin();
  }, [navigate]); 


  const loadUsersFromCache = () => {
    const cachedUsers = localStorage.getItem("allUsers");
    if (cachedUsers) {
      const parsedUsers = JSON.parse(cachedUsers);
      setUsers(parsedUsers); 
    } 
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowLoginModal(true);
    setPasscodeInput("");
    setLoginError("");
  };

  const handleLogin = async () => {
    if (!passcodeInput) {
      setLoginError("Please enter a passcode");
      return;
    }

    setLoading(true);
    setLoginError("");

    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedUser.name,
          passcode: passcodeInput,
        })
      });

      if (!res.ok) {
        setLoginError("Invalid passcode");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const userProfile = {
        id: data.id,
        name: data.name
      };

      login(userProfile, data.offlineToken);

      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const userIndex = allUsers.findIndex(u => u.id === data.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = userProfile;
      } else {
        allUsers.push(userProfile);
      }
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
      setUsers(allUsers); 

      setProfile(userProfile);
      setShowLoginModal(false);

      const meta = getUserMetadata(data.id);
      if (!meta.hasCompletedInitialLogin) {
      setShowTour(true);
      setTimeout(() => {
        setUserMetadata(data.id, { 
          hasCompletedInitialLogin: true,
          hasSeenTutorial: true 
        });
        navigate("/home");
      }, 2500);
      }
    } catch (err) {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
    setProfile(null);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setPasscodeInput("");
    setLoginError("");
    setSelectedUser(null);
  };

  return (
    <div style={{fontFamily: 'VT323'
    }}>
      {showTour && profile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          color: 'white',
          fontSize: '28px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Welcome, {profile.name}! <br />
          <span style={{ fontSize: '18px', marginTop: '10px', display: 'block' }}>
            Loading your board...
          </span>
        </div>
      )}

      {profile ? (
        <div>
          <UserDropdown
            users={users}
            currentUserName={profile.name}
            currentUserId={profile.id}
            onUserSelect={handleUserSelect}
            onLogout={handleLogout}
          />
          <LogoutButtonStyle onClick={handleLogout}>Logout</LogoutButtonStyle>
          
        </div>
      ) : (
        <div>
          <p>No user logged in.</p>
          {users.length > 0 ? (
            <UserDropdown
              users={users} 
              currentUserName="Guest"
              onUserSelect={handleUserSelect}
              onLogout={() => {}}
            />
          ) : (
            <p style={{ color: 'orange', marginTop: '10px' }}>
              {users.length === 0 ? "Loading users..." : "No users available."}
            </p>
          )}
        </div>
      )}

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            minWidth: '300px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <h3>Login as {selectedUser?.name}</h3>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Enter Passcode:
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                disabled={loading}
                autoFocus
              />
            </label>
            {loginError && (
              <p style={{ color: 'red', fontSize: '14px' }}>{loginError}</p>
            )}
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button 
                onClick={closeLoginModal}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div id="dataUpload">
        <GameDataTable />
      </div>
    </div>
  );
}
