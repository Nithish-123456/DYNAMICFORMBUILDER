import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { RootState } from '../../store';
import {
  updateWorkflowNodes,
  updateWorkflowEdges,
  addWorkflowEdge,
  setWorkflowMode,
  addWorkflowNode,
  selectWorkflowNode,
} from '../../store/slices/workflowSlice';
import { WorkflowNode } from '../../types/workflow';

import WorkflowSidebar from './WorkflowSidebar';
import WorkflowProperties from './WorkflowProperties';
import StartNode from './nodes/StartNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import ParallelNode from './nodes/ParallelNode';
import MergeNode from './nodes/MergeNode';
import EndNode from './nodes/EndNode';
import { ArrowLeft, Save, Play, Pause, Menu, X, Plus } from 'lucide-react';

// Custom hook for drop functionality with proper setNodes usage
const useWorkflowDrop = (
  dispatch: any, 
  currentWorkflow: any, 
  setNodes: any,
  nodes: Node[]
) => {
  const reactFlow = useReactFlow();
  
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    
    if (nodeType && currentWorkflow && reactFlow) {
      const position = reactFlow.project({
        x: event.clientX,
        y: event.clientY,
      });

      const nodeCount = currentWorkflow.nodes.filter((n: any) => n.type === nodeType).length;
      const level = Math.floor(currentWorkflow.nodes.length / 2) + 1;

      const newNode: WorkflowNode = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType as any,
        position,
        data: {
          label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodeCount + 1}`,
          level: `Level ${level}`,
        },
      };

      dispatch(addWorkflowNode(newNode));
      
      setNodes((prevNodes: Node[]) => [
        ...prevNodes,
        {
          id: newNode.id,
          type: newNode.type,
          position: newNode.position,
          data: newNode.data,
        }
      ]);
    }
  }, [dispatch, currentWorkflow, reactFlow, setNodes]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return { handleDrop, handleDragOver };
};

const nodeTypes: NodeTypes = {
  start: StartNode,
  condition: ConditionNode,
  action: ActionNode,
  parallel: ParallelNode,
  merge: MergeNode,
  end: EndNode,
};

const WorkflowDesignerContent: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWorkflow, selectedNode } = useSelector((state: RootState) => state.workflow);
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  // Mobile state management
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
        setShowProperties(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const initialNodes = useMemo(() => {
    return currentWorkflow?.nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })) || [];
  }, [currentWorkflow?.nodes]);

  const initialEdges = useMemo(() => {
    return currentWorkflow?.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type || 'default',
      data: edge.data,
      label: edge.data?.label,
    })) || [];
  }, [currentWorkflow?.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { handleDrop, handleDragOver } = useWorkflowDrop(dispatch, currentWorkflow, setNodes, nodes);

  // Sync React Flow state with Redux when currentWorkflow changes
  useEffect(() => {
    if (currentWorkflow) {
      const newNodes = currentWorkflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      }));
      setNodes(newNodes);

      const newEdges = currentWorkflow.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default',
        data: edge.data,
        label: edge.data?.label,
      }));
      setEdges(newEdges);
    }
  }, [currentWorkflow, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      dispatch(selectWorkflowNode(node.id));
      if (isMobile) {
        setShowProperties(true);
      }
    },
    [dispatch, isMobile]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        type: 'default' as string,
        data: { label: 'Next' },
      };
      
      setEdges((eds) => addEdge(params, eds));
      dispatch(addWorkflowEdge(newEdge));
    },
    [dispatch, setEdges]
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      onNodesChange(changes);
      
      setTimeout(() => {
        setNodes((currentNodes) => {
          const updatedNodes = currentNodes.map(node => {
            const change = changes.find((c: any) => c.id === node.id && c.type === 'position');
            if (change && change.position) {
              return {
                ...node,
                position: change.position,
              };
            }
            return node;
          });
          
          dispatch(updateWorkflowNodes(updatedNodes.map(node => ({
            id: node.id,
            type: node.type as any,
            position: node.position,
            data: node.data,
          }))));
          
          return updatedNodes;
        });
      }, 0);
    },
    [onNodesChange, setNodes, dispatch]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      
      setTimeout(() => {
        setEdges((currentEdges) => {
          dispatch(updateWorkflowEdges(currentEdges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default',
            data: edge.data,
          }))));
          return currentEdges;
        });
      }, 0);
    },
    [onEdgesChange, setEdges, dispatch]
  );

  const handleBackToForm = () => {
    dispatch(setWorkflowMode(false));
  };

  const handleSaveWorkflow = () => {
    console.log('Saving workflow:', currentWorkflow);
    // Here you would typically save to a backend
  };

  const handleToggleActive = () => {
    // Toggle workflow active state
    console.log('Toggle workflow active state');
  };

  if (!currentWorkflow) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Workflow Selected</h2>
          <p className="text-gray-600">Create a form first to design its workflow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800 truncate">
                {currentWorkflow.name}
              </h1>
              <p className="text-xs text-gray-500">Form: {currentForm?.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              currentWorkflow.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {currentWorkflow.isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <WorkflowSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && isMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Workflow Builder</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="h-full overflow-hidden">
              <WorkflowSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToForm}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Form</span>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{currentWorkflow.name}</h2>
              <p className="text-sm text-gray-600">
                Form: {currentForm?.name} • {nodes.length} node{nodes.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 text-xs rounded-full ${
              currentWorkflow.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {currentWorkflow.isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={handleToggleActive}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors ${
                currentWorkflow.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {currentWorkflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{currentWorkflow.isActive ? 'Deactivate' : 'Activate'}</span>
            </button>
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Workflow</span>
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <div
            className="h-full w-full select-none"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              deleteKeyCode={null}
              multiSelectionKeyCode={null}
              className="cursor-default"
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: isMobile ? 0.6 : 0.8 }}
            >
              <Controls className="!bottom-4 !left-4" />
              <MiniMap 
                className={`!bottom-4 !right-4 ${isMobile ? '!w-32 !h-24' : '!w-48 !h-32'}`}
                nodeColor="#3b82f6"
                maskColor="rgba(0, 0, 0, 0.1)"
              />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="#e5e7eb"
              />
              
              {/* Mobile Action Buttons */}
              {isMobile && (
                <Panel position="top-right" className="lg:hidden">
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                    {selectedNode && (
                      <button
                        onClick={() => setShowProperties(true)}
                        className="p-3 bg-blue-600 rounded-full shadow-lg text-white hover:bg-blue-700"
                      >
                        <Menu className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </Panel>
              )}

              {/* Mobile Instructions */}
              <Panel position="top-center" className="lg:hidden">
                <div className="bg-white rounded-lg shadow-lg p-3 mx-4 border border-gray-200 max-w-sm">
                  <p className="text-xs text-gray-600 text-center">
                    Tap + to add nodes • Tap nodes to select • Use controls to zoom and pan
                  </p>
                </div>
              </Panel>

              {/* Empty State */}
              {nodes.length <= 2 && (
                <Panel position="top-center" className="hidden lg:block">
                  <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto border border-gray-200">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔄</div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Start Building Your Workflow
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Drag components from the sidebar to create your workflow. Connect nodes with conditions, actions, and parallel processes.
                      </p>
                      <div className="text-xs text-gray-500">
                        <p>• Drag nodes from the sidebar</p>
                        <p>• Connect nodes by dragging from handles</p>
                        <p>• Click nodes to configure properties</p>
                      </div>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>

        {/* Mobile Back Button */}
        <div className="lg:hidden fixed bottom-4 left-4 z-40">
          <button
            onClick={handleBackToForm}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Back</span>
          </button>
        </div>
      </div>

      {/* Desktop Properties Panel */}
      <div className="hidden xl:block">
        <WorkflowProperties />
      </div>

      {/* Mobile Properties Modal */}
      {showProperties && selectedNode && isMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowProperties(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Node Properties
              </h3>
              <button
                onClick={() => setShowProperties(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto">
              <WorkflowProperties />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WorkflowDesigner: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <WorkflowDesignerContent />
      </ReactFlowProvider>
    </DndProvider>
  );
};

export default WorkflowDesigner;