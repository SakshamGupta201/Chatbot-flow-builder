import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa'; // Import the arrow icons

const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion bg-white p-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={toggleAccordion}>
        <span className="text-lg font-semibold">Accordion</span>
        {isOpen ? <FaChevronDown className="ml-2" /> : <FaChevronRight className="ml-2" />} {/* Use arrow icons */}
      </div>
      {isOpen && (
        <div className="accordion-content mt-2">
          <p>
            {/* Your accordion content */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et
            ultrices posuere cubilia curae; Donec velit neque, auctor sit amet
            aliquam vel, ullamcorper sit amet ligula. Donec rutrum congue leo
            eget malesuada. Vivamus magna justo, lacinia eget consectetur sed,
            convallis at tellus. Praesent sapien massa, convallis a pellentesque
            nec, egestas non nisi. Donec sollicitudin molestie malesuada.
            Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
          </p>
        </div>
      )}
    </div>
  );
};

export default Accordion;
