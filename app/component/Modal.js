import React, { useMemo, useEffect } from "react";
import "./Modal.css";
import DynamicForm from "./DynamicForm";
import UsernamePasswordForm from "./UsernamePasswordForm";

const Modal = ({ isOpen, onClose, node }) => {
  // Memoize the renderForm function
  const renderForm = useMemo(() => {
    if (!node) return null;

    switch (node.type) {
      case "textnode":
        return <DynamicForm nodeId={node.id} />;
      case "node2":
        return <UsernamePasswordForm nodeId={node.id} />;
      default:
        return null;
    }
  }, [node]);

  useEffect(() => {
    // Function to populate form fields from local storage
    const populateFormFields = () => {
      const storedData = localStorage.getItem(node.id);
      if (storedData) {
        const formData = JSON.parse(storedData);
        // Update form fields with stored values
        // Example: setFields(formData);
      }
    };

    if (isOpen && node) {
      populateFormFields();
    }
  }, [isOpen, node]);

  const handleClose = () => {
    // Additional cleanup if needed before closing modal
    onClose();
  };

  if (!isOpen || !node) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Node Details</h2>
          <button className="close-btn" onClick={handleClose}>
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
          {renderForm}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleClose}>
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
