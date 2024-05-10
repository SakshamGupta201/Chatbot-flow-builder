import React from "react";
import "./page.css";
export default function Sidebar({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) {
  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r-2 border-orange-200 p-4 text-sm bg-black w-64 h-screen">
      {selectedNode ? (
        //settings panel
        <div>
          <h3 className="text-xl mb-2 text-white">Update Node</h3>
          <label className="block mb-2 text-sm font-medium text-white">
            Node Name:
          </label>
          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 text-gray-700 border border-orange-300 rounded-lg bg-white focus:outline-none focus:border-orange-500"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 bg-orange-500 text-white rounded p-2 hover:bg-orange-600"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        //node panel
        <>
          <h3 className="text-xl mb-4 text-orange-500 font-bold">Control Panel</h3>
          <div
            className="bg-orange-500 mb-2 p-3 border-2 border-orange-500 rounded cursor-move flex justify-center items-center text-white hover:bg-orange-600 transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "orgnizationForm")}
            draggable
          >
            Organization
          </div>
          <div
            className="bg-orange-500 mb-2 p-3 border-2 border-orange-500 rounded cursor-move flex justify-center items-center text-white hover:bg-orange-600 transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "networkLicensingForm")}
            draggable
          >
            Network Licensing
          </div>
          <div
            className="bg-orange-500 mb-2 p-3 border-2 border-orange-500 rounded cursor-move flex justify-center items-center text-white hover:bg-orange-600 transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "siteInformationForm")}
            draggable
          >
            Site Information
          </div>
          <div
            className="bg-gray-500 mb-2 p-3 border-2 border-gray-500 rounded  flex justify-center items-center text-white hover:bg-gray-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "siteInformationForm")}
          >
            Add New Organization
          </div>
          <div
            className="bg-gray-500 mb-2 p-3 border-2 border-gray-500 rounded  flex justify-center items-center text-white hover:bg-gray-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "siteInformationForm")}
            disabled // Add the disabled attribute here
          >
            Configure Organization
          </div>
          <div
            className="bg-gray-500 mb-2 p-3 border-2 border-gray-500 rounded  flex justify-center items-center text-white hover:bg-gray-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "siteInformationForm")}
            disabled // Add the disabled attribute here
          >
            Add User
          </div>
          <div
            className="bg-gray-500 mb-2 p-3 border-2 border-gray-500 rounded  flex justify-center items-center text-white hover:bg-gray-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "siteInformationForm")}
            disabled // Add the disabled attribute here
          >
            Download LLD
          </div>
        </>
      )}
    </aside>

  );
}
