import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Board from "../gameboard/Board";
import { fetchUsersWithFallback } from "../utils/fetchUsers";

export default function Home() {
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsersWithFallback();

        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "null");

        if (!userProfile) {
            setLoading(false);
            return;
        }

        if (userProfile.board) {
            setSelectedBoard(userProfile.board);
        }

        setLoading(false);
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Board />
        </div>
    );
}