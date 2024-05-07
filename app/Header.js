import React from "react";
import Image from "next/image";
import companyLogo from "./ob_logo.png"; // Path to your company logo image

const Header = () => {
  return (
    <header className="bg-black text-white py-4 px-8 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-48 h-11 mr-4 relative">
          <Image
            src={companyLogo}
            alt="Company Logo"
            
          />
        </div>
      </div>
      <div className="flex-grow"></div>{" "}
      {/* Empty div to push the text to the center */}
      <h1 className="text-2xl text-orange-500 font-bold">DND Workflow</h1>
      <div className="flex-grow"></div>{" "}
      {/* Another empty div for equal spacing */}
    </header>
  );
};

export default Header;
