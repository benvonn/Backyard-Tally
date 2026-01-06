import React, { useState, useEffect } from "react";
import Modal from "../components/modal.tsx"; 
import { useNavigate } from "react-router-dom";
import UserSetup from "../setup/UserSetup.js"; 
import LoadingScreen from "../utils/LoadingScreen.tsx"; 
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

    // Main LandingPage content is rendered here after health check
    return (
        <div>
            <h1>Welcome to Backyard Tally</h1>
            <p>Here's a tutorial.....</p>
            {/* Clicking this button opens the UserSetup modal directly */}
            <StyledButton onClick={() => setIsModalOpen(true)}>Sign Up</StyledButton>
            <StyledButton onClick={() => navigate('/user/profile')}>Login</StyledButton>
            
            {/* Modal for UserSetup - opens on LandingPage */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <UserSetup 
                        onComplete={() => {
                            // Close the modal
                            setIsModalOpen(false); 
                            // Optionally, navigate to home or profile after setup
                            // navigate('/home'); // Or navigate('/user-profile');
                        }} 
                    />
                </Modal>
            )}
        </div>
    );
}