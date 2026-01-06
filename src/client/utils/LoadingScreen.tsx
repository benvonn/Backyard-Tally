// LoadingScreen.tsx
import React, { useState, useEffect, useRef } from "react";

const URL = "bytbe.azurewebsites.net";
const HEALTH_CHECK_URL = `${URL}/api/health`;
const USERS_URL = `${URL}/api/users`;
const POLLING_INTERVAL = 2000;
const TIMEOUT_DURATION = 30000;

interface LoadingScreenProps {
  onHealthCheckComplete: (status: "healthy" | "error", errorDetails?: string) => void;
  userProfileExists: boolean;
}

export default function LoadingScreen({ onHealthCheckComplete, userProfileExists }: LoadingScreenProps) {
  const [status, setStatus] = useState<"checking" | "healthy" | "error">("checking");
  const [message, setMessage] = useState("Checking system status...");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    const fontSize = 10;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => 1);

    const draw = () => {
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let timeoutTimer: NodeJS.Timeout | null = null;

    if (userProfileExists) {
        setMessage("Profile found. Loading application...");
        setTimeout(() => {
          onHealthCheckComplete("healthy");
        }, 10000);
        return;
    }
      
    const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUsers(data);
      localStorage.setItem("allUsers", JSON.stringify(data));
    } catch (err) {
      if (users.length === 0) {
      }
    }
  };

    const checkHealth = async () => {
      try {
        const response = await fetch(HEALTH_CHECK_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === "healthy") {
            setStatus("healthy");
            setMessage("System is healthy. Loading application...");
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
            await fetchUsers();
            onHealthCheckComplete("healthy");
          } else {
             setMessage(`System status: ${data.status || 'unknown'}. Still checking...`);
          }
        } else {
          throw new Error(`Health check failed with status ${response.status}`);
        }
      } catch (err) {
        setStatus("error");
        setMessage("Failed to connect to the system.");
        const errorMessage = (err as Error).message || "Unknown error";
        setErrorDetails(errorMessage);
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        onHealthCheckComplete("error", errorMessage);
      }
    };

    checkHealth();

    pollInterval = setInterval(checkHealth, POLLING_INTERVAL);

    timeoutTimer = setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      if (status === "checking") {
        setStatus("error");
        setMessage("Health check timed out. Please try again later.");
        const timeoutError = "Health check timed out.";
        setErrorDetails(timeoutError);
        onHealthCheckComplete("error", timeoutError);
      }
    }, TIMEOUT_DURATION);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (timeoutTimer) {
        clearTimeout(timeoutTimer);
      }
    };
  }, [onHealthCheckComplete, userProfileExists]);

  const handleRetry = () => {
    setStatus("checking");
    setMessage("Checking system status...");
    setErrorDetails(null);
  };

  if (status === "error") {
    return (
      <div style={styles.container}>
        <canvas ref={canvasRef} style={styles.canvas} />
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

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.content}>
        <h2 style={styles.title}>System Check</h2>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    backgroundColor: "#000",
    fontFamily: "monospace",
    position: "fixed" as const,
    top: 0,
    left: 0,
    overflow: "hidden" as const,
  },
  canvas: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  content: {
    textAlign: "center" as const,
    padding: "2rem",
    backgroundColor: "rgba(0, 0, 0, 1)",
    borderRadius: "0",
    border: 'solid 2px #0f0',
    boxShadow: "none",
    zIndex: 1,
  },
  title: {
    fontSize: "1.5rem",
    color: "#0f0",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1rem",
    color: "#0f0",
    marginBottom: "1.5rem",
  },
  errorDetails: {
    fontSize: "0.9rem",
    color: "#f00",
    fontStyle: "italic" as const,
    marginBottom: "1rem",
  },
  retryButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    backgroundColor: "#0f0",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
