import React, { useState, useEffect } from "react";
import UserDropdown from "../components/userdropdown.tsx";

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

  const URL = 'https://localhost:7157';
  const boards = ["pro"];

  useEffect(() => {
    // Load profile from localStorage
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
    if (storedProfile) {
      setProfile(storedProfile);
      setEditedBoard(storedProfile.board || "");
    }

    // Fetch all users for dropdown
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${URL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedUser.name,
          passcode: passcodeInput
        })
      });

      if (!res.ok) {
        setLoginError("Invalid passcode");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Login successful:", data);

      // Store user profile in localStorage
      const userProfile = {
        id: data.id,
        name: data.name,
        board: data.board
      };
      
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
      
      setProfile(userProfile);
      setEditedBoard(data.board || "");
      setShowLoginModal(false);
      setPasscodeInput("");
      
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    setProfile(null);
    setEditedBoard("");
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    try {
      const res = await fetch(`${URL}/api/users/${profile.id}/board`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ board: editedBoard })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Update userProfile in localStorage
      const updatedProfile = {
        ...profile,
        board: editedBoard
      };
      
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
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
      {profile ? (
        <>
          {!isEditing ? (
            <div>
              <UserDropdown
                users={users}
                currentUserName={profile.name}
                onUserSelect={handleUserSelect}
                onLogout={handleLogout}
              />

              {profile.board && (
                <p>Current board: {profile.board}</p>
              )}
              
              <button onClick={() => setIsEditing(true)}>
                Edit Board
              </button>
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
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
              </label>
              <br />

              <button type="button" onClick={handleSave}>Save</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <p>No user logged in.</p>
          {users.length > 0 && (
            <UserDropdown
              users={users}
              currentUserName="Guest"
              onUserSelect={handleUserSelect}
              onLogout={() => {}}
            />
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
    </div>
  );
}