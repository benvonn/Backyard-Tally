import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pro_Main_Area from "../gameboard/pro_setup/pro_main_area.js";

export default function Home() {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const URL = 'https://localhost:7157';
    
    useEffect(() => {
        // Fetch and cache users when home loads
        fetchAndCacheUsers();
        
        // Get board from userProfile in localStorage
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        
        console.log("userProfile from localStorage:", userProfile);
        
        if (!userProfile) {
            console.log("No user logged in");
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
    
    const fetchAndCacheUsers = async () => {
        try {
            const res = await fetch(`${URL}/api/users`);
            if (res.ok) {
                const data = await res.json();
                // Save all users to localStorage
                localStorage.setItem("allUsers", JSON.stringify(data));
                console.log("Users cached to localStorage:", data);
            }
        } catch (err) {
            console.log("Failed to fetch users (offline mode):", err);
        }
    };
    
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