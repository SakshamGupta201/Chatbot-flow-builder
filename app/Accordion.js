// Accordion.js

import React from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa"; // Import the arrow icons

const Accordion = ({ messages, isOpen, toggleAccordion }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleAccordion}
      >
        <span className="text-lg font-semibold">Flow Phases</span>
        {isOpen ? (
          <FaChevronDown className="ml-2" />
        ) : (
          <FaChevronRight className="ml-2" />
        )}
      </div>
      {isOpen && (
        <div className="mt-2">
          <ul>
            {/* Render messages as list items */}
            {messages.map((message, index) => (
              <li key={index} className="flex items-center mb-2">
                <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm mr-2">
                  Phase {index + 1}
                </span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Accordion;
