import React, { useMemo, useEffect } from "react";
import "./Modal.css";
import OrganizationForm from "./forms/OrganizationForm";
import NetworkLicensingForm from "./forms/NetworkLicensingForm";
import SiteInformationForm from "./forms/SiteInformationForm";

const Modal = ({ isOpen, onClose, node }) => {
  // Memoize the renderForm function
  const renderForm = useMemo(() => {
    if (!node) return null;

    switch (node.type) {
      case "orgnizationForm":
        return <OrganizationForm nodeId={node.id} />;
      case "networkLicensingForm":
        return <NetworkLicensingForm nodeId={node.id} />;
      case "siteInformationForm":
        return <SiteInformationForm nodeId={node.id} />;
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
  let formTitle;
  debugger
  switch (node.type) {
    case "orgnizationForm":
      formTitle = "Organization Data Form";
      break;
    case "networkLicensingForm":
      formTitle = "Network Licensing Form";
      break;
    case "siteInformationForm":
      formTitle = "Site Information Form";
      break;
    default:
      formTitle = "";
  }
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
        <h2 className="modal-title">{formTitle} :</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
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
