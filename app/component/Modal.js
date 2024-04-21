import React from "react";
import "./Modal.css"; // Import CSS file for modal styling

const Modal = ({ isOpen, onClose, node }) => {
  if (!isOpen || !node) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Node Details</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="node-info">
            <p><strong>ID:</strong> {node.id}</p>
            <p><strong>Type:</strong> {node.type}</p>
            <p><strong>Label:</strong> {node.data.label}</p>
            {/* Add more node details here */}
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
            {/* Add additional action buttons if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
