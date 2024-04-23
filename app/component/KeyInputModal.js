import React, { useState } from 'react';
import './Modal.css'

const KeyInputModal = ({ isOpen, onClose, onSave }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    onSave(inputValue);
    setInputValue(''); // Reset input value
    onClose();
  };

  // Render modal content only when isOpen is true
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Enter Key</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <input
            className='keymodal_input'
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter the key to store the flow"
          />
          <button className="mx-2 btn btn-primary" onClick={handleSave}>Save</button>
          <button className="mx-2 btn btn-primary" onClick={onClose}>Close</button>
          {/* Add additional action buttons if needed */}
        </div>
      </div>
    </div>
  );
};

export default KeyInputModal;
