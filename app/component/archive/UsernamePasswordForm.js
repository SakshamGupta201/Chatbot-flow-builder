import React, { useState, useEffect } from "react";
// import "./UsernamePasswordForm.css"; // Import the CSS file

const UsernamePasswordForm = ({ nodeId }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const { username: storedUsername, password: storedPassword } = JSON.parse(storedData);
      setUsername(storedUsername);
      setPassword(storedPassword);
    }
  }, [nodeId]);

  const handleUsernameChange = (event) => {
    const { value } = event.target;
    setUsername(value);
    // Update local storage
    localStorage.setItem(nodeId, JSON.stringify({ username: value, password }));
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    // Update local storage
    localStorage.setItem(nodeId, JSON.stringify({ username, password: value }));
  };

  return (
    <div className="dynamic-form">
      <div className="field">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
        />
      </div>
      <div className="field">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter your password"
        />
      </div>
    </div>
  );
};

export default UsernamePasswordForm;
