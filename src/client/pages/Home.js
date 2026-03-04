import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pro_Main_Area from "../gameboard/pro_setup/pro_main_area.js";

const URL = ""; 
const USERS_URL = `/api/users`;

export default function Home() {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchAndCacheUsers();
        
        const userProfile = JSON.parse(localStorage.getItem("userProfile"));
        
        if (!userProfile) {
            setLoading(false);
            return;
        }
        
        if (userProfile.board) {
            setSelectedBoard(userProfile.board);
        } 
        
        setLoading(false);
    }, [navigate]);
    
    const fetchAndCacheUsers = async () => {
        try {
            const res = await fetch(USERS_URL);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("allUsers", JSON.stringify(data));
            }
        } catch (err) {
        }
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <div>
            <Pro_Main_Area />
        </div>
    );
}
