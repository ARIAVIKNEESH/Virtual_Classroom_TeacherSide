import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./livesessions.css";

const LiveSession = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    link: "",
  });
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const teacherId = localStorage.getItem("teacherId");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchSessions = useCallback(async () => {
    if (!teacherId) {
      alert("Teacher ID not found in local storage. Please log in again.");
      return;
    }
      
    try {
      const response = await fetch(
        `http://localhost:5000/api/live-sessions/${teacherId}`
      );

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        const errorText = await response.text();
        alert(`Error fetching sessions: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch live sessions. Please check your network or server.");
    }
  }, [teacherId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherId) {
      alert("Teacher ID not found in local storage. Please log in again.");
      return;
    }

    const payload = { ...formData, teacherId };

    try {
      const response = await fetch("http://localhost:5000/api/live-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Live session created successfully!");
        setFormData({ name: "", date: "", time: "", link: "" });
        setShowForm(false);
        fetchSessions(); // Refresh the sessions list
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create live session. Please try again.");
    }
  };

  const handleSessionClick = (session) => {
    navigate(`/session-details/${session._id}`, { state: session });
  };

  return (
    <div className="livesession-container">
      <button
        className="livesession-create-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Back to Sessions" : "Create New Session"}
      </button>

      {showForm ? (
        <form onSubmit={handleSubmit} className="livesession-form">
          <h1 className="livesession-title">Create Live Session</h1>
          <div className="livesession-form-group">
            <label className="livesession-label">Session Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="livesession-input"
              required
            />
          </div>
          <div className="livesession-form-group">
            <label className="livesession-label">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="livesession-input"
              required
            />
          </div>
          <div className="livesession-form-group">
            <label className="livesession-label">Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="livesession-input"
              required
            />
          </div>
          <div className="livesession-form-group">
            <label className="livesession-label">Link:</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="livesession-input"
              required
            />
          </div>
          <button type="submit" className="livesession-submit-button">
            Create Session
          </button>
        </form>
      ) : (
        <div className="livesession-sessions-list">
          <h1 className="livesession-title">Your Live Sessions</h1>
          {sessions.length === 0 ? (
            <p className="livesession-no-sessions">No live sessions found.</p>
          ) : (
            sessions.map((session) => (
              <div key={session._id} className="livesession-session-box">
                <button
                  className="livesession-session-button"
                  onClick={() => handleSessionClick(session)}
                >
                  {session.name}
                </button>
                <p>
                  Start Date: {new Date(session.date).toLocaleDateString()}
                </p>
                <p>Time: {session.time}</p>
                <button
                  className="livesession-link-button"
                  onClick={() => window.open(session.link, "_blank")}
                >
                  Open Link
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default LiveSession;