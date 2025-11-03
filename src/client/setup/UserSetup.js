import {react, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

export default function UserSetup() {
    const [formData, setFormData] = useState({
        name: "",
        passcode: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }
    useEffect(() => {
            localStorage.setItem("userProfile", JSON.stringify(formData));
        }, [formData]);
    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log("Profile saved:", formData);
        navigate("/user/setup/board");
    }
    const navigate = useNavigate();
    return (
        <>
        <h1>User Profile</h1>
        <form onSubmit={handleSubmit}>
            <h2>Name:</h2>
            <input type="text" required minLength={2} maxLength={24} name="name" value={formData.name} onChange={handleChange} placeholder="Enter a name" />
            <h2>Passcode:</h2>
            <input required minLength={4} maxLength={6} type="password" name="passcode" value={formData.passcode} onChange={handleChange} placeholder="Enter a passcode(4-6 digits" />
            <p>Example: 1234</p>
            <button type="submit">Save Profile</button>
        </form>
        </>
    )
}