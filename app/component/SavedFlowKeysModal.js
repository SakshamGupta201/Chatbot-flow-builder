import React from "react";

const SavedFlowKeysModal = ({ isOpen, onClose, savedFlows, restoreFlow }) => {
    const handleRestore = (key) => {
        debugger;
        const savedFlows = JSON.parse(localStorage.getItem("saved_flows")); // Parse the saved flows
        const flowData = savedFlows[key]; // Retrieve the flow data using the provided key
        localStorage.setItem('flow-key', JSON.stringify(flowData)); // Store the flow data with a new key
        restoreFlow(); // Restore the flow using the retrieved data
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Saved Flow Keys</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18.707 1.293a1 1 0 0 1 0 1.414L11.414 10l7.293 7.293a1 1 0 1 1-1.414 1.414L10 11.414l-7.293 7.293a1 1 0 1 1-1.414-1.414L8.586 10 .293 2.707a1 1 0 1 1 1.414-1.414L10 8.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                        <ul>
                            {savedFlows && savedFlows.map((key) => (
                                <li key={key} className="mb-2 flex items-center">
                                    <span>{key}</span>
                                    <button
                                        className="text-blue-500 hover:underline mr-2 focus:outline-none"
                                        onClick={() => handleRestore(key)}
                                        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                                    >
                                        Restore
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default SavedFlowKeysModal;
