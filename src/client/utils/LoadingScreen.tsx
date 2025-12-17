// LoadingScreen.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing after health check

const HEALTH_CHECK_URL = "https://localhost:7157/api/health"; // Replace with your actual backend URL and endpoint
const POLLING_INTERVAL = 2000; // Poll every 2 seconds
const TIMEOUT_DURATION = 30000; // Timeout after 30 seconds

export default function LoadingScreen() {
  const [status, setStatus] = useState<"checking" | "healthy" | "error">("checking");
  const [message, setMessage] = useState("Checking system status...");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // Hook to navigate after successful health check

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let timeoutTimer: NodeJS.Timeout | null = null;

    // Check for existing user profile in localStorage
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
        console.log("User profile found in localStorage. Navigating to home...");
        // If profile exists, navigate to home immediately, skipping health checks
        navigate("/home");
        return; // Exit the effect early
    }
    console.log("No user profile found in localStorage. Proceeding with health checks...");
      
    const fetchUsers = async () => {
    try {
      const res = await fetch(`${URL}/api/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
      localStorage.setItem("allUsers", JSON.stringify(data));
      console.log("Users fetched and cached:", data);
    } catch (err) {
      console.error("Failed to fetch users (using cached data):", err);
      if (users.length === 0) {
        console.log("No cached users available");
      }
    }
  };

    const checkHealth = async () => {
      try {
        console.log("Polling health check endpoint..."); // Debug log
        const response = await fetch(HEALTH_CHECK_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any necessary headers for your health check endpoint (e.g., auth if required)
          },
        });

        console.log("Health check response:", response); // Debug log

        if (response.ok) {
          const data = await response.json();
          console.log("Health check ", data); // Debug log
          // Assume a simple healthy response structure like { status: 'healthy' }
          if (data.status === "healthy") {
            setStatus("healthy");
            setMessage("System is healthy. Loading application...");
            // Clear polling interval as health check passed
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            // Navigate after a short delay to show the success message
            // Use the default "/" route if no profile was found initially
            setTimeout(() => {
              navigate("/"); 
            }, 1000);
          } else {
             // If the status is not 'healthy' but the request was successful,
             // you might want to update the message or handle specific sub-statuses
             console.warn("Health check returned non-healthy status:", data);
             setMessage(`System status: ${data.status || 'unknown'}. Still checking...`);
          }
        } else {
          console.error("Health check request failed:", response.status, response.statusText);
          throw new Error(`Health check failed with status ${response.status}`);
        }
      } catch (err) {
        console.error("Error during health check:", err);
        setStatus("error");
        setMessage("Failed to connect to the system.");
        setErrorDetails((err as Error).message || "Unknown error");
        // Clear polling interval on error
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      }
    };

    // Start polling immediately (only if no profile was found)
    checkHealth();

    // Set up the polling interval
    pollInterval = setInterval(checkHealth, POLLING_INTERVAL);

    // Set up the timeout timer
    timeoutTimer = setTimeout(() => {
      console.warn("Health check timeout reached.");
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (status === "checking") { // Only update if still checking
        setStatus("error");
        setMessage("Health check timed out. Please try again later.");
      }
    }, TIMEOUT_DURATION);

    // Cleanup function to clear intervals/timers if component unmounts
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
    };
  }, [navigate]); // Depend on navigate if it's required for navigation after health check

  const handleRetry = () => {
    // Reset state to trigger useEffect again
    setStatus("checking");
    setMessage("Checking system status...");
    setErrorDetails(null);
  };

  if (status === "healthy") {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>Loading...</h2>
          <p style={styles.message}>{message}</p>
          {/* Optional: Show a different spinner or animation for loading completion */}
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>System Check Failed</h2>
          <p style={styles.message}>{message}</p>
          {errorDetails && <p style={styles.errorDetails}>Error: {errorDetails}</p>}
          <button onClick={handleRetry} style={styles.retryButton}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Default: status === "checking" (or if navigating to home)
  // This part will render briefly if navigating to home due to profile,
  // or during the health check process if no profile exists.
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.title}>System Check</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.spinner}></div>
      </div>
    </div>
  );
}

// Basic styles for the loading screen
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5", // Light background
    fontFamily: "Arial, sans-serif",
  },
  content: {
    textAlign: "center" as const,
    padding: "2rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "1.5rem",
  },
  errorDetails: {
    fontSize: "0.9rem",
    color: "#d32f2f", // Red for errors
    fontStyle: "italic" as const,
    marginBottom: "1rem",
  },
  spinner: {
    // Simple CSS spinner
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3", // Light grey
    borderTop: "4px solid #3498db", // Blue
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto", // Center the spinner
  },
  retryButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  // Inject the keyframes animation for the spinner
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

// Apply the keyframes animation using a style tag if needed in a real project
// For this code snippet, we assume the CSS is applied correctly by the framework