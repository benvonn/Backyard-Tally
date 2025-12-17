import React, { useState, useEffect } from "react";
import UserDropdown from "../components/userdropdown.tsx";
import isValidOfflineToken from "./ValidToken.js";
import { useNavigate } from "react-router";
import { getUserMetadata, setUserMetadata } from "../utils/onboarding.js";
import { useAuth } from "../contexts/AuthContext.js";
import GameDataTable from "./UploadLocalStorage.tsx";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedBoard, setEditedBoard] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const navigate = useNavigate();
  const URL = 'https://localhost:7157';
  const boards = ["pro"];
  const {login} = useAuth();

  useEffect(() => {
  const checkOfflineLogin = () => {
    const storedToken = localStorage.getItem("offlineToken");
    const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "null");

    if (storedToken && storedProfile) {
      try {
        if (isValidOfflineToken(storedToken)) {
          setProfile(storedProfile);
          setEditedBoard(storedProfile.board || "");
          console.log("Logged in offline using cached token");
          
          const meta = getUserMetadata(storedProfile.id);
          if (!meta.hasCompletedInitialLogin) {
            // First login - go to home
            navigate("/home");
          }
          
          return;
        }
      } catch (e) {
        console.warn("Invalid offline token", e);
      }
    }

    // Only clean up if no valid session exists
    if (!storedToken || !storedProfile || !isValidOfflineToken(storedToken)) {
      localStorage.removeItem("offlineToken");
      localStorage.removeItem("userProfile");
    }

    // Load users
    loadUsersFromCache();
    fetchUsers();
  };

  checkOfflineLogin();
}, []);

  const loadUsersFromCache = () => {
    const cachedUsers = localStorage.getItem("allUsers");
    if (cachedUsers) {
      const parsedUsers = JSON.parse(cachedUsers);
      setUsers(parsedUsers);
      console.log("Loaded users from cache:", parsedUsers);
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
      const res = await fetch(`${URL}/api/users/login`, {
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
        name: data.name,
        board: data.board
      };

      // Save auth data
      login(userProfile, data.offlineToken);

      // Update allUsers cache
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const userIndex = allUsers.findIndex(u => u.id === data.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = userProfile;
      } else {
        allUsers.push(userProfile);
      }
      localStorage.setItem("allUsers", JSON.stringify(allUsers));

      // Set state and handle navigation
      setProfile(userProfile);
      setEditedBoard(data.board || "");
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
      console.error("Login failed:", err);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("offlineToken");
    setProfile(null);
    setEditedBoard("");
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      const res = await fetch(`${URL}/api/users/${profile.id}/board`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: editedBoard })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedProfile = { ...profile, board: editedBoard };
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

      // Update allUsers cache
      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const userIndex = allUsers.findIndex(u => u.id === profile.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedProfile;
        localStorage.setItem("allUsers", JSON.stringify(allUsers));
      }

      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Board updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save changes");
    }
  };

  const handleCancel = () => {
    setEditedBoard(profile?.board || "");
    setIsEditing(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setPasscodeInput("");
    setLoginError("");
    setSelectedUser(null);
  };

  return (
    <div>
      {/* Tour Overlay */}
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
          Welcome, {profile.name}! 🎯<br />
          <span style={{ fontSize: '18px', marginTop: '10px', display: 'block' }}>
            Loading your board...
          </span>
        </div>
      )}

      {/* Main Content */}
      {profile ? (
        !isEditing ? (
          <div>
            <UserDropdown
              users={users}
              currentUserName={profile.name}
              onUserSelect={handleUserSelect}
              onLogout={handleLogout}
            />
            {profile.board && <p>Current board: {profile.board}</p>}
            <button onClick={() => setIsEditing(true)}>Edit Board</button>
          </div>
        ) : (
          <div>
            <h3>Edit Board</h3>
            <label>
              Board:
              <select
                value={editedBoard}
                onChange={(e) => setEditedBoard(e.target.value)}
              >
                <option value="">-- Select a Board --</option>
                {boards.map((board) => (
                  <option key={board} value={board}>{board}</option>
                ))}
              </select>
            </label>
            <br />
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        )
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
              No users available. Please connect to internet to load users.
            </p>
          )}
        </div>
      )}

      {/* Login Modal */}
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