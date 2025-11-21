import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pro_Main_Area from "../gameboard/pro_setup/pro_main_area.js";

export default function Home() {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get board from userProfile in localStorage
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        
        console.log("userProfile from localStorage:", userProfile);
        
        if (!userProfile) {
            console.log("No user logged in, redirecting...");
            // Optionally redirect to login
            // navigate('/login');
            setLoading(false);
            return;
        }
        
        if (userProfile.board) {
            console.log("Board found:", userProfile.board);
            setSelectedBoard(userProfile.board);
        } else {
            console.log("No board selected yet");
        }
        
        setLoading(false);
    }, [navigate]);
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            {selectedBoard === "pro" && <Pro_Main_Area />}
            {!selectedBoard && <p>No board selected. Please complete setup.</p>}
        </div>
    );
}