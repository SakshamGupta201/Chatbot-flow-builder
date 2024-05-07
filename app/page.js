/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
  MiniMap,
  Controls,
  Background,
  MarkerType,
} from "reactflow";
import "reactflow/dist/base.css";
import Header from "./Header";
import Footer from "./Footer";
import "../tailwind.config.js";
import Sidebar from "./component/sidebar";
import Modal from "./component/Modal.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import TextNode from "./component/TextNode.js";
import KeyInputModal from "./component/KeyInputModal.js";
import SavedFlowKeysModal from "./component/SavedFlowKeysModal.js";
import initialData from "./data/Initial.json";
import "./page.css";
import { FaPlay } from "react-icons/fa";
import Accordion from "./Accordion";
// Key for local storage
const flowKey = "flow-key";
import "./style.css";

let id = 4;

// Function for generating unique IDs for nodes
const getId = () => `node_${id++}`;

const orangeMinimapStyle = {
  background: "", // Change the background color to orange
  border: "2px solid orange", // Change the border color to orange
  borderRadius: "10px", // Optional: add some border radius for a rounded appearance
};

const App = () => {
  useEffect(() => {
    localStorage.setItem(flowKey, JSON.stringify(initialData));
    onRestore();
    setMessages([]);
  }, []);

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      orgnizationForm: TextNode,
      networkLicensingForm: TextNode,
      siteInformationForm: TextNode,
    }),
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to store the clicked node
  const [clickedNode, setClickedNode] = useState(null);

  const handleNodeClick = (event, node) => {
    setIsModalOpen(true);
    setClickedNode(node);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setClickedNode(null);
  };

  // States and hooks setup
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [nodeName, setNodeName] = useState("");
  const edgeUpdateSuccessful = useRef(true);
  const [savedFlowsModalOpen, setSavedFlowsModalOpen] = useState(false); // State to manage the modal
  const [savedFlows, setSavedFlows] = useState([]);
  const [messages, setMessages] = useState([]); // State to hold the messages
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  // Function to add a new message
  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]); // Use functional update to ensure previous messages are preserved
  };

  const openSavedFlowsModal = useCallback(() => {
    const flows = JSON.parse(localStorage.getItem("saved_flows"));
    if (flows) {
      const keys = Object.keys(flows);
      setSavedFlows(keys);
      setSavedFlowsModalOpen(true);
    } else {
      // Handle case when there are no saved flows
      // Maybe show a message or do nothing
    }
  }, []);

  const closeSavedFlowsModal = useCallback(() => {
    setSavedFlowsModalOpen(false);
    setSavedFlows([]);
  }, []);

  // Update nodes data when nodeName or selectedElements changes

  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName(""); // Clear nodeName when no node is selected
    }
  }, [nodeName, selectedElements, setNodes]);

  // Setup viewport
  const { setViewport } = useReactFlow();

  // Check for empty target handles
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check if any node is unconnected
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  // Save flow to local storage

  const [isKeyInputModalOpen, setIsKeyInputModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  // Function to aggregate values of keys starting with "node_" in localStorage and store the result in localStorage under the specified key
  const aggregateNodeValuesAndStore = (resultKey) => {
    // Get all keys in localStorage
    const localStorageKeys = Object.keys(localStorage);

    // Filter keys starting with "node_"
    const filteredKeys = localStorageKeys.filter((k) => k.startsWith("node_"));

    // Aggregate values of filtered keys into an object
    const aggregatedValues = filteredKeys.reduce((acc, curr) => {
      acc[curr] = JSON.parse(localStorage.getItem(curr));
      return acc;
    }, {});

    // Store the aggregated values in localStorage under the specified key
    localStorage.setItem(resultKey, JSON.stringify(aggregatedValues));
  };

  const handleSave = async (key) => {
    const savedFlowsKey = "saved_flows";
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        return;
      } else {
        const flow = reactFlowInstance.toObject();

        // Retrieve existing saved flows or initialize an empty object if it doesn't exist
        let savedFlows = JSON.parse(localStorage.getItem(savedFlowsKey));
        if (!savedFlows || typeof savedFlows !== "object") {
          savedFlows = {};
        }

        // Assign the current flow to the specified key
        savedFlows[key] = flow;

        // Save the updated object back to local storage
        localStorage.setItem(savedFlowsKey, JSON.stringify(savedFlows));

        onSave();

        aggregateNodeValuesAndStore(key);
      }
    }
  };

  // Restore flow from local storage
  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const savedFlowRestore = useCallback(
    (key) => {
      // Get the stored aggregated values using the provided key
      const storedData = JSON.parse(localStorage.getItem(key));

      if (!storedData || typeof storedData !== "object") {
        // Handle case when no data is found for the provided key
        console.error(`No stored data found for key: ${key}`);
        return;
      }

      const keys = Object.keys(localStorage);

      // Iterate through keys and remove those that are not "saved_flows"
      keys.forEach((key) => {
        const lowercaseKey = key.toLowerCase();
        if (
          lowercaseKey !== "saved_flows" &&
          !lowercaseKey.startsWith("key") &&
          !lowercaseKey.startsWith("flow")
        ) {
          localStorage.removeItem(key);
        }
      });

      // Iterate over the stored data and store each key-value pair in localStorage
      Object.entries(storedData).forEach(([nodeKey, nodeValue]) => {
        // Construct the storage key for the current node
        const storageKey = `${nodeKey}`;

        // Store the current node's value in localStorage
        localStorage.setItem(storageKey, JSON.stringify(nodeValue));
      });

      // Perform additional restoration logic if needed
      onRestore();
    },
    [setNodes, setViewport]
  );

  const onReset = useCallback(() => {
    // Get all keys from localStorage
    const keys = Object.keys(localStorage);

    // Iterate through keys and remove those that are not "saved_flows"
    keys.forEach((key) => {
      if (
        key !== "saved_flows" &&
        !key.startsWith("Key") &&
        !key.startsWith("Flow ")
      ) {
        localStorage.removeItem(key);
      }
    });

    // Reset nodes and edges
    setNodes([]);
    setEdges([]);

    localStorage.setItem(flowKey, JSON.stringify(initialData));
    onRestore();
  }, []);

  const onConnect = useCallback(
    (params) => {
      console.log("Edge created: ", params);
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add a new node

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: {
          label: `${type}`,
        },
        className: `${type}`, // Assigning class name same as type
      };

      console.log("Node created: ", newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // Save flow to local storage
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        return;
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  const createSite = async (formDataObject) => {
    try {
      // Format the data according to the specified format
      const formattedData = {
        organization_name: formDataObject.organizationContent.organizationName,
        site_name: formDataObject.siteInformationForm.siteName,
        site_type: formDataObject.siteInformationForm.siteType,
        site_region: formDataObject.siteInformationForm.siteRegion,
        hub_id: formDataObject.siteInformationForm.hubId,
        sal_code: formDataObject.networkLicensingForm.salCode,
        site_address: formDataObject.organizationContent.siteAddress,
        country: formDataObject.organizationContent.country,
        city: formDataObject.organizationContent.city,
        network_name: formDataObject.networkLicensingForm.networkName,
        site_tag: formDataObject.networkLicensingForm.siteTag,
        time_zone: formDataObject.siteInformationForm.timeZone,
        license_shared: formDataObject.networkLicensingForm.licenseShared,
      };

      const response = await fetch("http://localhost:8000/sites/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to create site: ${errorMessage}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error creating site:", error);
      throw error;
    }
  };

  const runFlow = () => {
    // Clear existing messages
    setMessages([]);

    onSave();

    const formDataObject = {};
    let allDataPresent = true;
    const flowData = JSON.parse(localStorage.getItem(flowKey));

    if (flowData && flowData.nodes) {
      flowData.nodes.forEach((node) => {
        const formDataKey = `${node.id}`;
        const formData = JSON.parse(localStorage.getItem(formDataKey));

        if (formData) {
          switch (node.data.label) {
            case "orgnizationForm":
              if (
                !formData["organizationName"] ||
                !formData["country"] ||
                !formData["city"] ||
                !formData["siteAddress"] ||
                formData["organizationName"].trim() === "" ||
                formData["country"].trim() === "" ||
                formData["city"].trim() === "" ||
                formData["siteAddress"].trim() === ""
              ) {
                allDataPresent = false;
                const missingFields = [];
                if (!formData["organizationName"])
                  missingFields.push("Organization Name");
                if (!formData["country"]) missingFields.push("Country");
                if (!formData["city"]) missingFields.push("City");
                if (!formData["siteAddress"])
                  missingFields.push("Site Address");
                const errorMessage = `Missing or empty value(s) in organization content: ${missingFields.join(
                  ", "
                )}.`;

                addMessage(`Phase: ${node.data.label} failed: ${errorMessage}`);
              } else {
                formDataObject.organizationContent = {
                  organizationName: formData["organizationName"],
                  country: formData["country"],
                  city: formData["city"],
                  siteAddress: formData["siteAddress"],
                };
                addMessage(`Organization Phase: ${node.data.label} completed successfully`);
              }
              break;
            case "siteInformationForm":
              if (
                !formData["siteName"] ||
                !formData["siteType"] ||
                !formData["siteRegion"] ||
                !formData["timeZone"] ||
                formData["siteName"].trim() === "" ||
                formData["siteType"].trim() === "" ||
                formData["siteRegion"].trim() === "" ||
                formData["timeZone"].trim() === ""
              ) {
                allDataPresent = false;
                const missingFields = [];
                if (!formData["siteName"]) missingFields.push("Site Name");
                if (!formData["siteType"]) missingFields.push("Site Type");
                if (!formData["siteRegion"]) missingFields.push("Site Region");
                if (!formData["timeZone"]) missingFields.push("Time Zone");
                const errorMessage = `Missing or empty value(s) in site information: ${missingFields.join(
                  ", "
                )}.`;

                addMessage(`SiteInformation Phase: ${node.data.label} failed: ${errorMessage}`);
              } else {
                formDataObject.siteInformationForm = {
                  siteName: formData["siteName"],
                  siteType: formData["siteType"],
                  siteRegion: formData["siteRegion"],
                  timeZone: formData["timeZone"],
                  hubId: formData["hubId"],
                };
                addMessage(`SiteInformation Phase: ${node.data.label} completed successfully`);
              }
              break;
            default:
              if (
                !formData["salCode"] ||
                !formData["networkName"] ||
                !formData["siteTag"] ||
                !formData["licenseShared"] ||
                formData["salCode"].trim() === "" ||
                formData["networkName"].trim() === "" ||
                formData["siteTag"].trim() === "" ||
                formData["licenseShared"].trim() === ""
              ) {
                allDataPresent = false;
                const missingFields = [];

                if (!formData["salCode"]) missingFields.push("SAL Code");
                if (!formData["networkName"])
                  missingFields.push("Network Name");
                if (!formData["siteTag"]) missingFields.push("Site Tag");
                if (!formData["licenseShared"])
                  missingFields.push("License Shared");
                const errorMessage = `Missing or empty value(s) in network licensing information: ${missingFields.join(
                  ", "
                )}.`;
                console.error(errorMessage);

                addMessage(`Network Phase: ${node.data.label} failed: ${errorMessage}`);
              } else {
                formDataObject.networkLicensingForm = {
                  salCode: formData["salCode"],
                  networkName: formData["networkName"],
                  siteTag: formData["siteTag"],
                  licenseShared: formData["licenseShared"],
                };
                addMessage(`Network Phase: ${node.data.label} completed successfully`);
              }
              break;
          }
        } else {
          allDataPresent = false;
          console.error(node, "234123412");
          const errorMessage = `Form data not found for ${node.data.label}. Please try again later.`;

          addMessage(`Phase: ${node.data.label} failed: ${errorMessage}`);
        }
        // Open the accordion when flow is completed
        setIsAccordionOpen(true);
      });

      if (allDataPresent) {
        createSite(formDataObject)
          .then((data) => {
            console.log("Site created successfully:", data);
            addMessage("Site created successfully.");
          })
          .catch((error) => {
            console.error("Failed to create site:", error);
            addMessage("Failed to create site. Please try again later.");
            return;
          });
      }
    } else {
      console.error("No flow data found in local storage.");
      addMessage("No flow data found. Please try again later.");
      return;
    }
  };

  const onEdgeUpdateStart = useCallback(() => {
    console.log("Calle");
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    console.log("Called");
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    console.log("Calleddd");
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  useEffect(() => {
    onSave();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row h-screen lg:max-h-screen lg:h-auto max-h-75.67vh">
        <Sidebar
          nodeName={nodeName}
          setNodeName={setNodeName}
          selectedNode={selectedElements[0]}
          setSelectedElements={setSelectedElements}
        />

        <div className="flex-grow" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={rfStyle}
            onNodeClick={handleNodeClick}
            onPaneClick={() => {
              setSelectedElements([]);
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false,
                }))
              );
            }}
            fitView
          >
            <Background variant="dots" gap={12} size={1} />
            <Controls />
            {/* <MiniMap  /> */}
            <MiniMap zoomable pannable style={orangeMinimapStyle} />
            <Panel>
              <button
                className="m-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mx-2 my-2"
                onClick={() => setIsKeyInputModalOpen(true)}
                style={{
                  backgroundColor: "#ff7900",
                  transition: "background-color 0.3s",
                }}
              >
                Save flow
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mx-2 my-2"
                onClick={openSavedFlowsModal}
                style={{
                  backgroundColor: "#ff7900",
                  transition: "background-color 0.3s",
                }}
              >
                Load FLows
              </button>

              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mx-2 my-2"
                onClick={onReset}
                style={{
                  backgroundColor: "#ff7900",
                  transition: "background-color 0.3s",
                }}
              >
                Reset flow
              </button>
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mx-2 my-2"
                onClick={runFlow}
                style={{
                  backgroundColor: "#ff7900",
                  transition: "background-color 0.3s",
                }}
              >
                <FaPlay className="m-2" /> {/* Icon */}
              </button>

              <hr></hr>
            </Panel>
          </ReactFlow>
          <ToastContainer
            position="top-right"
            toastStyle={{
              marginLeft: "-100%",
              marginRight: "300px",
              marginTop: "10px",
            }}
          />
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} node={clickedNode} />
        <KeyInputModal
          isOpen={isKeyInputModalOpen}
          onClose={() => setIsKeyInputModalOpen(false)}
          onSave={handleSave}
        />
        <SavedFlowKeysModal
          isOpen={savedFlowsModalOpen}
          onClose={closeSavedFlowsModal}
          savedFlows={savedFlows}
          restoreFlow={(key) => savedFlowRestore(key)}
        />
      </div>
      <Accordion
        messages={messages}
        isOpen={isAccordionOpen}
        toggleAccordion={toggleAccordion}
      />
    </>
  );
};

// Wrap App with ReactFlowProvider
function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
