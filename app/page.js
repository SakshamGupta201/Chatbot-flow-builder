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
  MarkerType
} from "reactflow";
import "reactflow/dist/base.css";

import "../tailwind.config.js";
import Sidebar from "./component/sidebar";
import Node2 from "./component/archive/Node2.js";
import Modal from "./component/Modal.js";


// Key for local storage
const flowKey = "flow-key";

let id = 1;

// Function for generating unique IDs for nodes
const getId = () => `node_${id++}`;



const App = () => {
  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      orgnizationForm: Node2,
      networkLicensingForm: Node2,
      siteInformationForm: Node2,
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
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        alert("Save successful!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

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

  const onReset = useCallback(() => {
    localStorage.clear();
    setNodes([]);
    setEdges([]);
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
  const runFlow = () => {
    // Create an object to store the form data
    const formDataObject = {};

    // Retrieve the flow data from local storage
    const flowData = JSON.parse(localStorage.getItem(flowKey));

    // Check if flow data exists
    if (flowData && flowData.nodes) {
      // Iterate through each node in the flow data
      flowData.nodes.forEach(node => {
        // Retrieve form values for the current node ID
        const formDataKey = `${node.id}`;
        const formData = JSON.parse(localStorage.getItem(formDataKey));

        // Check if formData exists
        if (formData) {
          // Check the label of the node to determine the fields to extract
          switch (node.data.label) {
            case "orgnizationForm":
              // Store form data for organizationForm
              formDataObject.organizationForm = {
                organizationName: formData["organizationName"],
                country: formData["country"],
                city: formData["city"],
                siteAddress: formData["siteAddress"]
              };
              break;
            case "siteInformationForm":
              // Store form data for siteInformationForm
              formDataObject.siteInformationForm = {
                siteName: formData["siteName"],
                siteType: formData["siteType"],
                siteRegion: formData["siteRegion"],
                timeZone: formData["timeZone"]
              };
              break;
            default:
              // Store form data for default case
              formDataObject.networkLicensingForm = {
                hubID: formData["hubID"],
                salCode: formData["salCode"],
                networkName: formData["networkName"],
                siteTag: formData["siteTag"],
                licenseShared: formData["licenseShared"]
              };
              break;
          }
        } else {
          console.log("No form data found for this node.");
        }
      });
      console.log(formDataObject);
    } else {
      console.log("No flow data found in local storage.");
    }
  };


  const onEdgeUpdateStart = useCallback(() => {
    console.log("Calle")
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    console.log("Called")
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    console.log("Calleddd")
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeUpdateSuccessful.current = true;
  }, []);



  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
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
          <MiniMap zoomable pannable />
          <Panel>
            <button
              className=" m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onSave}
            >
              save flow
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onRestore}
            >
              restore flow
            </button>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={onReset}
            >
              Rest flow
            </button>

            <hr>
            </hr>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={runFlow}
            >
              Run
            </button>

          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} node={clickedNode} />
    </div>
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
