import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BASE_URL from "../../config";

interface UserSetupProps {
  onComplete?: () => void;
}

function generateOfflineToken(daysValid = 30): string {
  // isValidOfflineToken only checks shape and expiry, no signature check
  // so this satisfies it without needing a real signed JWT
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + daysValid * 24 * 60 * 60,
    offline: true,
  }));
  return `${header}.${payload}.offline`;
}

function generateOfflineId(): string {
  // temporary id, gets replaced with the real db id once synced
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? `offline-${crypto.randomUUID()}`
    : `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function UserSetup({ onComplete }: UserSetupProps) {
  const [name, setName] = useState<string>("");
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const createOfflineAccount = () => {
    const id = generateOfflineId();
    const profile = {
      id,
      name: name.trim(),
      passcode, // kept until synced, needed to create the real account later
      synced: false,
    };

    login(profile, generateOfflineToken());
    // do not set hasCompletedInitialLogin here
    // UserProfile.checkOfflineLogin redirects to /home only while this is unset
    // setting it now would skip that redirect and strand the user on /user/profile

    navigate("/user/profile");
    onComplete?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || passcode.length < 4) {
      setError("Name and a 4+ digit passcode are required.");
      return;
    }

    setLoading(true);

    // health check already confirmed no connection, skip the request entirely
      const knownOffline = sessionStorage.getItem("isOffline") === "true";
      if (knownOffline) {
        createOfflineAccount();
        setLoading(false);
        return;
      }

      let response: Response;
      try {
        response = await fetch(`${BASE_URL}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), passcode }),
        });
      } catch (networkErr) {
        // wifi dropped between health check and submit, same fallback
        createOfflineAccount();
        setLoading(false);
        return;
      }

    try {
      if (!response.ok) {
        // server responded but rejected the request, e.g. name taken
        // this is a real validation error, not a connectivity issue
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create account.");
      }

      const data = await response.json().catch(() => ({}));
      const id = data.id ?? generateOfflineId();

      login({ name: name.trim(), id, synced: true }, data.token ?? generateOfflineToken());
      // same reason as offline path, leave hasCompletedInitialLogin unset here

      navigate("/user/profile");
      onComplete?.();
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