// LandingPage.tsx
import React, { useState } from "react";
// import styled from "@emotion/styled"; // Removed if not used
import Modal from "../components/modal.tsx";
import { useNavigate } from "react-router-dom";
import UserSetup from "../setup/UserSetup.js";
import LoadingScreen from "../utils/LoadingScreen.tsx"; // Adjust path if necessary
import { useAuth } from "../contexts/AuthContext"; // Example: if you have an auth context to check login state
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const navigate = useNavigate(); // Not needed here if LoadingScreen handles navigation
    // const [isLoading, setIsLoading] = useState(false); // Removed: LoadingScreen handles its own state/logic

    // Example: Check if user is already logged in via context
    // const { isLoggedIn } = useAuth(); // Example using a context
    // if (isLoggedIn) {
    //   navigate("/home"); // Or wherever the logged-in user should go
    //   return null; // Or redirect using a different mechanism
    // }

    // Check for user profile in localStorage directly if not using a context
    // const userProfile = localStorage.getItem("userProfile");
    // if (userProfile) {
    //   // If profile exists, you might want to navigate away from LandingPage entirely
    //   // or let LoadingScreen handle it. Letting LoadingScreen handle it is cleaner.
    //   // For now, just render LoadingScreen which will handle navigation internally.
    // }


    // Always render the LoadingScreen as the entry point for this route
    // The LoadingScreen will handle the checks and navigate accordingly.
    return <LoadingScreen />;

    // If you still wanted conditional rendering here based on *something else*,
    // you would do it *before* returning LoadingScreen, like the auth check above.
    // But for the health check + profile check flow, LoadingScreen is the right place.

    // Example of how it might look if you had other conditions here:
    /*
    if (isLoggedIn) {
        // Or if (userProfile) and you want to navigate immediately without a check
        navigate("/home"); // Or use a redirect component
        return null; // Or return a placeholder while navigating
    }

    if (showSetupModal) { // Some other condition
        return (
            <>
                <Modal onClose={() => setShowSetupModal(false)}>
                    <UserSetup />
                </Modal>
            </>
        );
    }

    return <LoadingScreen />;
    */
}