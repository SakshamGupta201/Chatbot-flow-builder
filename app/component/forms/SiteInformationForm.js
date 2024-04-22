import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file

const SiteInformationForm = ({ nodeId }) => {
  const [siteName, setSiteName] = useState("");
  const [siteType, setSiteType] = useState("");
  const [siteRegion, setSiteRegion] = useState("");
  const [timeZone, setTimeZone] = useState("");

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const { siteName: storedSiteName, siteType: storedSiteType, siteRegion: storedSiteRegion, timeZone: storedTimeZone } = JSON.parse(storedData);
      setSiteName(storedSiteName);
      setSiteType(storedSiteType);
      setSiteRegion(storedSiteRegion);
      setTimeZone(storedTimeZone);
    }
  }, [nodeId]);

  const handleSiteNameChange = (event) => {
    const { value } = event.target;
    setSiteName(value);
    // Update local storage
    updateLocalStorage({ siteName: value });
  };

  const handleSiteTypeChange = (event) => {
    const { value } = event.target;
    setSiteType(value);
    // Update local storage
    updateLocalStorage({ siteType: value });
  };

  const handleSiteRegionChange = (event) => {
    const { value } = event.target;
    setSiteRegion(value);
    // Update local storage
    updateLocalStorage({ siteRegion: value });
  };

  const handleTimeZoneChange = (event) => {
    const { value } = event.target;
    setTimeZone(value);
    // Update local storage
    updateLocalStorage({ timeZone: value });
  };

  const updateLocalStorage = (data) => {
    const storedData = JSON.parse(localStorage.getItem(nodeId)) || {};
    const newData = { ...storedData, ...data };
    localStorage.setItem(nodeId, JSON.stringify(newData));
  };

  return (
    <div className="site-information-form">
      <div className="field">
        <label htmlFor="siteName">Site Name:</label>
        <input
          id="siteName"
          type="text"
          value={siteName}
          onChange={handleSiteNameChange}
          placeholder="Enter site name"
        />
      </div>
      <div className="field">
        <label htmlFor="siteType">Site Type:</label>
        <input
          id="siteType"
          type="text"
          value={siteType}
          onChange={handleSiteTypeChange}
          placeholder="Enter site type"
        />
      </div>
      <div className="field">
        <label htmlFor="siteRegion">Site Region:</label>
        <input
          id="siteRegion"
          type="text"
          value={siteRegion}
          onChange={handleSiteRegionChange}
          placeholder="Enter site region"
        />
      </div>
      <div className="field">
        <label htmlFor="timeZone">Time Zone:</label>
        <input
          id="timeZone"
          type="text"
          value={timeZone}
          onChange={handleTimeZoneChange}
          placeholder="Enter time zone"
        />
      </div>
    </div>
  );
};

export default SiteInformationForm;
