"use client";

import React, { useEffect, useState } from "react";
import { createFeedbackLog, generateOTP, verifyPhoneNumber } from "../services/feedbackService";
import { getAllVehicles } from "../services/vehicleService";

const FeedbackForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState("initial");
  const [busNumber, setBusNumber] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [feedbackLogsId, setFeedbackLogsId] = useState<number | null>(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available buses
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const busList = await getAllVehicles();
        setBuses(busList);
      } catch (error) {
        alert("Failed to fetch bus list. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  // Submit feedback data
  const handleSubmitFeedback = async () => {
    if (!busNumber || rating === 0 || !comments.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const feedbackData = { vehicle_id: busNumber, rating, comments };
      const response = await createFeedbackLog(feedbackData);
      setFeedbackLogsId(response.feedback_logs_id);
      setCurrentStep("phoneInput");
    } catch (error) {
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for phone number verification
  const handlePhoneInputSubmit = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
      setLoading(true);
      await generateOTP({ phone_number: phoneNumber, feedback_logs_id: feedbackLogsId });
      setCurrentStep("verification");
    } catch (error) {
      alert("Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify the phone number using OTP
  const handleVerificationSubmit = async () => {
    if (!verificationCode.trim()) {
      alert("Please enter the verification code.");
      return;
    }
    try {
      setLoading(true);
      await verifyPhoneNumber(feedbackLogsId, { phone_number: phoneNumber, otp: verificationCode });
      setCurrentStep("thankYou");
    } catch (error) {
      alert("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="h-screen w-full flex justify-center items-center"
      style={{ background: "linear-gradient(135deg, #e0f7fa, #d1c4e9)" }}
    >
      <div className="w-full h-full flex flex-col justify-center items-center">
        {currentStep === "initial" && (
          <div style={styles.container}>
            <h2 style={styles.title}>Welcome to TransitTrack Feedback</h2>
            <button onClick={() => setCurrentStep("feedback")} style={styles.submitButton}>
              Send Feedback
            </button>
          </div>
        )}

        {currentStep === "feedback" && (
          <div style={styles.container}>
            <h2 style={styles.title}>Give Feedback</h2>
            <div style={styles.dropdown}>
              <label>Select Bus Number</label>
              <select
                value={busNumber}
                onChange={(e) => setBusNumber(e.target.value)}
                style={styles.input}
              >
                <option value="">Select Bus Number</option>
                {buses.map((bus) => (
                  <option key={bus.vehicle_id} value={bus.vehicle_id}>
                    {bus.plate_number || `Bus ${bus.vehicle_id}`}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.ratingSection}>
              <label>How was your experience?</label>
              <div style={styles.stars}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <span
                    key={index}
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      color: rating >= index ? "#FFD700" : "#CCCCCC",
                    }}
                    onClick={() => setRating(index)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Your comments..."
              style={styles.textarea}
            />
            <button onClick={handleSubmitFeedback} style={styles.submitButton}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        )}

        {currentStep === "phoneInput" && (
          <div style={styles.container}>
            <h2 style={styles.title}>Phone Number</h2>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              style={styles.input}
            />
            <button onClick={handlePhoneInputSubmit} style={styles.submitButton}>
              {loading ? "Sending OTP..." : "Next"}
            </button>
          </div>
        )}

        {currentStep === "verification" && (
          <div style={styles.container}>
            <h2 style={styles.title}>Verify Phone Number</h2>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the verification code"
              style={styles.input}
            />
            <button onClick={handleVerificationSubmit} style={styles.submitButton}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {currentStep === "thankYou" && (
          <div style={styles.thankYouContainer}>
            <h2 style={styles.thankYouTitle}>Thank you for your feedback!</h2>
            <button onClick={() => setCurrentStep("initial")} style={styles.submitButton}>
              Done
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    height: 'auto',
    padding: '40px',
    background: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  logo: {
    maxWidth: '150%',
    height: 'auto',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: '10px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  ratingSection: {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  commentsSection: {
    marginBottom: '10px',
    textAlign: 'left',
    width: '100%',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #cccccc',
  },
  submitButton: {
    padding: '12px',
    width: '100%',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #cccccc', 
  },
  thankYouContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '500px',
    padding: '50px', 
    background: '#ffffff', 
    borderRadius: '12px', 
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  thankYouTitle: {
    fontSize: '28px', 
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  feedbackLink: {
    marginTop: '15px',
    color: '#007BFF',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
};

export default FeedbackForm;

