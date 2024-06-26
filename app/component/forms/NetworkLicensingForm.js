import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file

const NetworkLicensingForm = ({ nodeId }) => {
  const [salCode, setSalCode] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [siteTag, setSiteTag] = useState("");
  const [licenseShared, setLicenseShared] = useState("");

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const { salCode: storedSalCode, networkName: storedNetworkName, siteTag: storedSiteTag, licenseShared: storedLicenseShared } = JSON.parse(storedData);
      setSalCode(storedSalCode);
      setNetworkName(storedNetworkName);
      setSiteTag(storedSiteTag);
      setLicenseShared(storedLicenseShared);
    }
  }, [nodeId]);

  const handleSalCodeChange = (event) => {
    const { value } = event.target;
    setSalCode(value);
    // Update local storage
    updateLocalStorage({ salCode: value });
  };

  const handleNetworkNameChange = (event) => {
    const { value } = event.target;
    setNetworkName(value);
    // Update local storage
    updateLocalStorage({ networkName: value });
  };

  const handleSiteTagChange = (event) => {
    const { value } = event.target;
    setSiteTag(value);
    // Update local storage
    updateLocalStorage({ siteTag: value });
  };

  const handleLicenseSharedChange = (event) => {
    const { value } = event.target;
    setLicenseShared(value);
    // Update local storage
    updateLocalStorage({ licenseShared: value });
  };

  const updateLocalStorage = (data) => {
    const storedData = JSON.parse(localStorage.getItem(nodeId)) || {};
    const newData = { ...storedData, ...data };
    localStorage.setItem(nodeId, JSON.stringify(newData));
  };

  return (
    <div className="network-licensing-form">
      <div className="field">
        <label htmlFor="salCode">SAL Code:</label>
        <input
          id="salCode"
          type="text"
          value={salCode}
          onChange={handleSalCodeChange}
          placeholder="Enter SAL Code"
        />
      </div>
      <div className="field">
        <label htmlFor="networkName">Network Name:</label>
        <input
          id="networkName"
          type="text"
          value={networkName}
          onChange={handleNetworkNameChange}
          placeholder="Enter Network Name"
        />
      </div>
      <div className="field">
        <label htmlFor="siteTag">Site Tag:</label>
        <input
          id="siteTag"
          type="text"
          value={siteTag}
          onChange={handleSiteTagChange}
          placeholder="Enter Site Tag"
        />
      </div>
      <div className="field">
        <label htmlFor="licenseShared">License Shared:</label>
        <select
          id="licenseShared"
          value={licenseShared}
          onChange={handleLicenseSharedChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>
  );
};

export default NetworkLicensingForm;
