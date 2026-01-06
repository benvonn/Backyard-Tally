import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMetadata, setUserMetadata } from "../utils/onboarding";

export default function UserSetup({ onComplete }) { 
    const URL = 'bytbe.azurewebsites.net';
    const [name, setName] = useState("");
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError("");

        if (!name.trim() || passcode.length < 4) {
            setError("Name and a 4+ digit passcode are required.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${URL}/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), passcode, Board: "pro" })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || "Failed to create account.");
            }
            navigate("/user/profile"); 
            if (onComplete) {
              onComplete(); 
            }
        } catch (err) { 
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Create Your Account</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <label>
                    <h2>Name</h2>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Alex"
                        required
                        minLength={2}
                        maxLength={24}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </label>

                <label>
                    <h2>Passcode</h2>
                    <input
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="4–6 digits"
                        required
                        minLength={4}
                        maxLength={6}
                        style={{ width: '100%', padding: '8px' }}
                    />
                    <p><small>Example: 1234</small></p>
                </label>

                <button 
                    type="submit" 
                    disabled={loading || !name.trim() || passcode.length < 4}
                    style={{ padding: '10px 20px', fontSize: '16px' }}
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}
