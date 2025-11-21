import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export function SetupConfirmation() {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [Profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedPasscode, setEditedPasscode] = useState("");
    const [editedBoard, setEditedBoard] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedBoard = localStorage.getItem("selectedBoard");
        const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
        
        if (storedBoard) {
            setSelectedBoard(storedBoard);
            setEditedBoard(storedBoard);
        }
        if (storedProfile) {
            setProfile(storedProfile);
            setEditedName(storedProfile.name);
            setEditedPasscode(storedProfile.passcode);
        }
    }, []);

    const handleSave = () => {
        const updatedProfile = {
            name: editedName,
            passcode: editedPasscode
        };
        
        // Save to localStorage
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        localStorage.setItem("selectedBoard", editedBoard);
        
        // Update state
        setProfile(updatedProfile);
        setSelectedBoard(editedBoard);
        setEditMode(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Setup confirmed!");
    };

    return (
        <div>
            <h1>Setup Confirmation</h1>
            <form onSubmit={handleSubmit}>
                {Profile ? (
                    <>
                        {editMode ? (
                            <>
                                <h2>Edit Profile</h2>
                                <label>
                                    Name:
                                    <input 
                                        type="text" 
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    Passcode:
                                    <input 
                                        type="text" 
                                        value={editedPasscode}
                                        onChange={(e) => setEditedPasscode(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    Board:
                                </label>
                                <br />
                                <button type="button" onClick={handleSave}>Save</button>
                                <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p>Name: {Profile.name}</p>
                                <p>Passcode: {Profile.passcode}</p>
                                <button type="button" onClick={() => setEditMode(true)}>Edit</button>
                            </>
                        )}
                    </>
                ) : (
                    <p>No user profile found.</p>
                )}
                
                {selectedBoard ? (
                    <p>You have selected the {selectedBoard} board.</p>
                ) : (
                    <p>No board selected.</p>
                )}
            </form>
            
            <button onClick={() => {navigate("/home")}}>
                Confirm and Proceed
            </button>
        </div>
    );
}