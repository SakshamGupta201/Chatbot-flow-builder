import React, { useState, useEffect } from "react";
import countryList from "./country_list.json"; // Importing country list JSON
import "./styles.css";

const OrganizationForm = ({ nodeId }) => {
  const [organizationName, setOrganizationName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [siteAddress, setSiteAddress] = useState("");

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const {
        organizationName: storedOrganizationName,
        country: storedCountry,
        city: storedCity,
        siteAddress: storedSiteAddress,
      } = JSON.parse(storedData);
      setOrganizationName(storedOrganizationName);
      setCountry(storedCountry);
      setCity(storedCity);
      setSiteAddress(storedSiteAddress);
    }
  }, [nodeId]);

  const handleOrganizationNameChange = (event) => {
    const { value } = event.target;
    setOrganizationName(value);
    // Update local storage
    updateLocalStorage({ organizationName: value });
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

  const updateLocalStorage = (data) => {
    const storedData = JSON.parse(localStorage.getItem(nodeId)) || {};
    const newData = { ...storedData, ...data };
    localStorage.setItem(nodeId, JSON.stringify(newData));
  };

  return (
    <div className="dynamic-form">
      <div className="field">
        <label htmlFor="organizationName">Organization Name:</label>
        <select
          id="organizationName"
          value={organizationName}
          onChange={handleOrganizationNameChange}
        >
          <option value="">Select Organization</option>
          <option value="OBS-LAB-GGN">OBS-LAB-GGN</option>
          <option value="OBS_TEST_CUSTOMER">OBS_TEST_CUSTOMER</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="country">Country:</label>
        <select id="country" value={country} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countryList.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
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
    </div>
  );
};

export default OrganizationForm;
