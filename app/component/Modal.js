// Modal.js

import React, { useState } from "react";

const Modal = ({ isOpen, onClose, type, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
            <h2>{type === "node1" ? "Node 1 Form" : "Node 2 Form"}</h2>
            <form onSubmit={handleSubmit}>
              {type === "node1" ? (
                <>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </>
              ) : (
                <>
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </>
              )}
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
