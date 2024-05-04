import React from "react";
import Image from "next/image";
import companyLogo from "./company-logo.png"; // Path to your company logo image

const Header = () => {
  return (
    <header className="bg-black text-white py-4 px-8 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-24 h-9 mr-4 relative bg-white">
          <Image
            src={companyLogo}
            alt="Company Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="flex-grow"></div>{" "}
      {/* Empty div to push the text to the center */}
      <h1 className="text-2xl font-bold">DND Workflow</h1>
      <div className="flex-grow"></div>{" "}
      {/* Another empty div for equal spacing */}
    </header>
  );
};

export default Header;
