import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DynamicForm.css"; // Import the CSS file

const DynamicForm = ({ nodeId }) => {
  const [fields, setFields] = useState([{ label: "", value: "" }]);

  // Load data from local storage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem(nodeId);
    if (storedData) {
      const formData = JSON.parse(storedData);
      setFields(formData);
    }
  }, [nodeId]);

  const handleChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);

    // Update local storage
    localStorage.setItem(nodeId, JSON.stringify(newFields));
  };

  const handleAddField = () => {
    setFields([...fields, { label: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);

    // Update local storage
    localStorage.setItem(nodeId, JSON.stringify(newFields));
  };

  return (
    <div className="dynamic-form">
      {fields.map((field, index) => (
        <div key={index} className="field">
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleChange(index, "label", e.target.value)}
            placeholder="Label"
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            placeholder="Value"
          />
          <button className="remove" onClick={() => handleRemoveField(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
      <button className="add" onClick={handleAddField}>Add Field</button>
    </div>
  );
};

export default DynamicForm;
