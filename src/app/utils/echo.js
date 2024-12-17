// utils/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Ensure Pusher is available globally (only on the client side)
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

// Create Echo instance only if window is available (to ensure server-side rendering compatibility)
const echo = typeof window !== "undefined"
  ? new Echo({
      broadcaster: "pusher",
      key: "97e12b5f39c1e3b65007", // Use environment variables
      cluster: "ap1",
      encrypted: true,
      forceTLS: true, // Always use HTTPS
      debug: process.env.NODE_ENV === "development", // Optional: Enable debugging in development
    })
  : null;

// Log a message if Echo is not initialized
if (!echo) {
  console.warn("Echo is not initialized. Ensure you're running in a browser environment.");
}

export default echo;
