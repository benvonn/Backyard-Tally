import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMetadata, setUserMetadata } from "../utils/onboarding.tsx";

interface UserSetupProps {
  onComplete?: () => void;
}

export default function UserSetup({ onComplete }: UserSetupProps) { 
    const URL = '';
    const [name, setName] = useState<string>("");
    const [passcode, setPasscode] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
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
                body: JSON.stringify({ name: name.trim(), passcode })
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
            setError((err as Error).message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = loading || !name.trim() || passcode.length < 4;

    return (
       <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'VT323', color: '#0f0' }}>
            <h1>Create Your Account</h1>
            {error && <p style={{ color: '#f00' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <h2>Name</h2>
                  <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Alex"
                      required
                      minLength={2}
                      maxLength={24}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#000',
                        border: '2.5px solid #0f0',
                        color: '#0f0',
                        fontFamily: 'VT323',
                        fontSize: '20px',
                      }}
                  />
                </label>

                <label style={{ display: 'block', marginBottom: '16px' }}>
                  <h2>Passcode</h2>
                  <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="4–6 digits"
                      required
                      minLength={4}
                      maxLength={6}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#000',
                        border: '2.5px solid #0f0',
                        color: '#0f0',
                        fontFamily: 'VT323',
                        fontSize: '20px',
                      }}
                  />
                </label>

                <button
                  type="submit"
                  disabled={isDisabled}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.background = '#000';
                      e.currentTarget.style.color = '#0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.background = '#0f0';
                      e.currentTarget.style.color = '#000';
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '20px',
                    fontFamily: 'VT323',
                    background: isDisabled ? '#000' : '#0f0',
                    color: isDisabled ? '#0f0' : '#000',
                    border: '2.5px solid #0f0',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled ? 0.5 : 1,
                    marginTop: '16px',
                  }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>
            </form>
        </div>
    );
}