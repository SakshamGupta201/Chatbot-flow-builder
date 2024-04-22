import React, { useState, useEffect } from "react";
import timezone from "./timezone.json";
import "./styles.css"; // Import the CSS file

const SiteInformationForm = ({ nodeId }) => {
  const [siteName, setSiteName] = useState("");
  const [siteType, setSiteType] = useState("");
  const [siteRegion, setSiteRegion] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [hubId, setHubId] = useState(null); // Initialize hubId to null

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const { siteName: storedSiteName, siteType: storedSiteType, siteRegion: storedSiteRegion, timeZone: storedTimeZone, hubId: storedHubId } = JSON.parse(storedData);
      setSiteName(storedSiteName);
      setSiteType(storedSiteType);
      setSiteRegion(storedSiteRegion);
      setTimeZone(storedTimeZone);
      setHubId(storedHubId); // Set hubId state
    }
  }, [nodeId]);

  const handleSiteNameChange = (event) => {
    const { value } = event.target;
    setSiteName(value);
    updateLocalStorage({ siteName: value });
  };

  const handleSiteTypeChange = (event) => {
    const { value } = event.target;
    setSiteType(value);
    updateLocalStorage({ siteType: value });
    // If siteType is Spoke, set hubId to null
    if (value === "Spoke") {
      setHubId(null);
      updateLocalStorage({ hubId: null });
    }
  };

  const handleSiteRegionChange = (event) => {
    const { value } = event.target;
    setSiteRegion(value);
    updateLocalStorage({ siteRegion: value });
  };

  const handleTimeZoneChange = (event) => {
    const { value } = event.target;
    setTimeZone(value);
    updateLocalStorage({ timeZone: value });
  };

  const handleHubIdChange = (event) => {
    const { value } = event.target;
    setHubId(value);
    updateLocalStorage({ hubId: value });
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
        <select
          id="siteType"
          value={siteType}
          onChange={handleSiteTypeChange}
        >
          <option value="">Select Site Type</option>
          <option value="Hub">Hub</option>
          <option value="Spoke">Spoke</option>
        </select>
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
        <select
          id="timeZone"
          value={timeZone}
          onChange={handleTimeZoneChange}
        >
          <option value="">Select Time Zone</option>
          {timezone.map(zone => (
            <option key={zone.zone} value={zone.zone}>{zone.name} {zone.gmt}</option>
          ))}
        </select>
      </div>
      {siteType === "Hub" && (
        <div className="field">
          <label htmlFor="hubId">Hub ID:</label>
          <input
            id="hubId"
            type="text"
            value={hubId || ""}
            onChange={handleHubIdChange}
            placeholder="Enter Hub ID"
          />
        </div>
      )}
    </div>
  );
};

export default SiteInformationForm;
