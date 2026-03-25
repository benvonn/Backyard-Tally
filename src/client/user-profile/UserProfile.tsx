import React, { useState, useEffect } from "react";
import UserDropdown from "../components/userdropdown.tsx";
import isValidOfflineToken from "./ValidToken.js";
import { useNavigate } from "react-router";
import { getUserMetadata, setUserMetadata } from "../utils/onboarding.tsx";
import { useAuth } from "../contexts/AuthContext.js";
import GameDataTable from "./UploadLocalStorage.tsx";
import styled from "@emotion/styled";

const URL = "";
const USERS_URL = `${URL}/api/users`;
const LOGIN_URL = `${URL}/api/users/login`;

interface UserProfile {
  id: number | string
  name: string;
}
interface User {
  id: number | string;
  name: string;
}

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
  transition: all 0.2s ease;

  &:hover {
    background: #f00;
    color: #000;
    border-color: #000;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(USERS_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

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
        } catch (e) {}
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
      setUsers(JSON.parse(cachedUsers));
    }
  };
  const togglePanel = (panel: string) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }

  const handleUserSelect = (user: User) => {
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
          name: selectedUser!.name,
          passcode: passcodeInput,
        }),
      });

      if (!res.ok) {
        setLoginError("Invalid passcode");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const userProfile = { id: data.id, name: data.name };

      login(userProfile, data.offlineToken);

      const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const userIndex = allUsers.findIndex((u: User) => u.id === data.id);
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
            hasSeenTutorial: true,
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
    <div style={{ fontFamily: "VT323" }}>
      {showTour && profile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            color: "white",
            fontSize: "28px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          Welcome, {profile.name}! <br />
          <span style={{ fontSize: "18px", marginTop: "10px", display: "block" }}>
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
            isOpen={activePanel === "dropdown"}
            onToggle={() => togglePanel("dropdown")}
          />
          <LogoutButtonStyle onClick={handleLogout}>Logout</LogoutButtonStyle>
        </div>
      ) : (
        <div>
          <p>No user logged in.</p>
          <UserDropdown
            users={users}
            currentUserName="Guest"
            onUserSelect={handleUserSelect}
            isOpen={activePanel === "dropdown"}
            onToggle={() => togglePanel("dropdown")}
            onLogout={() => {}}
          />
        </div>
      )}

      {showLoginModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#000000ff",
              padding: "24px",
              border: "5px solid #0f0",
              minWidth: "300px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              color: "#0f0",
              fontFamily: "VT323",
              position: "relative",
            }}
          >
            <button
              onClick={closeLoginModal}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                width: "25px",
                height: "25px",
                background: "#000000ff",
                color: "#0f0",
                border: "2.5px solid #0f0",
                fontFamily: "VT323",
                cursor: "pointer",
              }}
            >
              X
            </button>
            <h3 style={{ color: "#0f0" }}>Login as {selectedUser?.name}</h3>
            <label style={{ display: "block", marginBottom: "8px", color: "#0f0" }}>
              Enter Passcode:
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  background: "#000000ff",
                  border: "2.5px solid #0f0",
                  color: "#0f0",
                  fontFamily: "VT323",
                }}
                disabled={loading}
                autoFocus
              />
            </label>
            {loginError && (
              <p style={{ color: "#f00", fontSize: "14px" }}>{loginError}</p>
            )}
            <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
              <button
                onClick={handleLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background: "#000000ff",
                  color: "#0f0",
                  border: "2.5px solid #0f0",
                  fontFamily: "VT323",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                onClick={closeLoginModal}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background: "#000000ff",
                  color: "#f00",
                  border: "2.5px solid #f00",
                  fontFamily: "VT323",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    {activePanel !== 'dropdown' && (
      <div id="dataUpload">
        <GameDataTable isOpen={activePanel === "gamedata"}
        onToggle={() => togglePanel("gamedata")} />
      </div>
    )}
    </div>
  );
}