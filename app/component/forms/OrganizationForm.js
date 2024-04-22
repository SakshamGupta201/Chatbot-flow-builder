import React, { useState, useEffect } from "react";
import "./styles.css";

const OrganizationForm = ({ nodeId }) => {
  const [organization, setOrganization] = useState(""); // State for organization
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [hubId, setHubId] = useState("");

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const { organization: storedOrganization, country: storedCountry, city: storedCity, siteAddress: storedSiteAddress, hubId: storedHubId } = JSON.parse(storedData);
      setOrganization(storedOrganization);
      setCountry(storedCountry);
      setCity(storedCity);
      setSiteAddress(storedSiteAddress);
      setHubId(storedHubId);
    }
  }, [nodeId]);

  const handleOrganizationChange = (event) => {
    const { value } = event.target;
    setOrganization(value);
    // Update local storage
    updateLocalStorage({ organization: value });
  };

  const handleCountryChange = (event) => {
    const { value } = event.target;
    setCountry(value);
    // Update local storage
    updateLocalStorage({ country: value });
  };

  const handleCityChange = (event) => {
    const { value } = event.target;
    setCity(value);
    // Update local storage
    updateLocalStorage({ city: value });
  };

  const handleSiteAddressChange = (event) => {
    const { value } = event.target;
    setSiteAddress(value);
    // Update local storage
    updateLocalStorage({ siteAddress: value });
  };

  const handleHubIdChange = (event) => {
    const { value } = event.target;
    setHubId(value);
    // Update local storage
    updateLocalStorage({ hubId: value });
  };

  const updateLocalStorage = (data) => {
    const storedData = JSON.parse(localStorage.getItem(nodeId)) || {};
    const newData = { ...storedData, ...data };
    localStorage.setItem(nodeId, JSON.stringify(newData));
  };

  return (
    <div className="dynamic-form">
      <div className="field">
        <label htmlFor="organization">Organization:</label>
        <select
          id="organization"
          value={organization}
          onChange={handleOrganizationChange}
        >
          <option value="">Select an organization</option>
          <option value="Org 1">Org 1</option>
          <option value="Org 2">Org 2</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="field">
        <label htmlFor="country">Country:</label>
        <input
          id="country"
          type="text"
          value={country}
          onChange={handleCountryChange}
          placeholder="Enter country"
        />
      </div>
      <div className="field">
        <label htmlFor="city">City:</label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city"
        />
      </div>
      <div className="field">
        <label htmlFor="siteAddress">Site Address:</label>
        <input
          id="siteAddress"
          type="text"
          value={siteAddress}
          onChange={handleSiteAddressChange}
          placeholder="Enter site address"
        />
      </div>
      <div className="field">
        <label htmlFor="hubId">Hub ID:</label>
        <input
          id="hubId"
          type="text"
          value={hubId}
          onChange={handleHubIdChange}
          placeholder="Enter hub ID"
        />
      </div>
    </div>
  );
};

export default OrganizationForm;
