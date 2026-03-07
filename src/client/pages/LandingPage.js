import React, { useState, useEffect } from "react";
import Modal from "../components/modal.tsx"; 
import { useNavigate } from "react-router-dom";
import UserSetup from "../setup/UserSetup.js"; 
import LoadingScreen from "../utils/LoadingScreen.tsx"; 
import isValidOfflineToken from "./ValidToken.js";   // ← added
import styled from "@emotion/styled";

const StyledButton = styled.button`
  background: #000000ff;
  border: 2.5px solid #0f0;
  color: #0f0;
  font-family: VT323;
  font-size: 25px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background: #0f0;
    color: #000;
    border-color: #000;
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid #1aff00;
    outline-offset: 2px;
  }
`;

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [healthCheckStatus, setHealthCheckStatus] = useState("checking"); 
    const [errorDetails, setErrorDetails] = useState(null); 
    const navigate = useNavigate();

    // ==================== ONLY CHANGE ====================
    // Auto-redirect if valid offline session exists
    useEffect(() => {
        if (healthCheckStatus !== "healthy") return;   // wait for health check first

        console.log("=== LANDING OFFLINE CHECK STARTED ===");

        const storedToken = localStorage.getItem("offlineToken");
        const storedProfileStr = localStorage.getItem("userProfile");
        const storedProfile = storedProfileStr ? JSON.parse(storedProfileStr) : null;

        console.log("Token exists:", !!storedToken);
        console.log("Profile exists:", !!storedProfile);

        if (storedToken && storedProfile) {
            try {
                const isValid = isValidOfflineToken(storedToken);
                console.log("Token valid?", isValid);

                if (isValid) {
                    console.log("✅ Valid offline session → redirecting to /home");
                    navigate("/home", { replace: true });
                    return;
                }
            } catch (e) {
                console.error("Token validation failed:", e);
            }
        }

        console.log("❌ No valid offline session — showing login screen");
    }, [healthCheckStatus, navigate]);
    // ====================================================

    useEffect(() => {
        if (healthCheckStatus === "checking" && sessionStorage.getItem("healthCheckCompleted") === "true") {
            setHealthCheckStatus("healthy");
        }
    }, [healthCheckStatus]);

    const handleHealthCheckComplete = (status, details) => {
        console.log("Health check reported status:", status, details);
        setHealthCheckStatus(status);
        if (status === "healthy") {
            sessionStorage.setItem("healthCheckCompleted", "true");
        } else {
            setErrorDetails(details || "An error occurred during the system check.");
        }
    };

    const userProfileExists = localStorage.getItem("userProfile") !== null;

    if (healthCheckStatus === "error") {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>System Check Failed</h2>
                <p>{errorDetails || "An error occurred during the system check."}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (healthCheckStatus === "checking") { 
        return (
            <LoadingScreen
                onHealthCheckComplete={handleHealthCheckComplete}
                userProfileExists={userProfileExists}
            />
        );
    }

    // Main LandingPage content (only shows if no offline session)
    return (
        <div>
            <h1>Welcome to Backyard Tally</h1>
            
            <StyledButton onClick={() => setIsModalOpen(true)}>Sign Up</StyledButton>
            <StyledButton onClick={() => navigate('/user/profile')}>Login</StyledButton>
            
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <UserSetup 
                        onComplete={() => {
                            setIsModalOpen(false); 
                        }} 
                    />
                </Modal>
            )}
        </div>
    );
}