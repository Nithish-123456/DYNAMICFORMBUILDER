import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { ArrowLeft, Save, Play, Pause, Settings, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import node components
import StartNode from '../WorkflowDesigner/nodes/StartNode';
import ConditionNode from '../WorkflowDesigner/nodes/ConditionNode';
import ActionNode from '../WorkflowDesigner/nodes/ActionNode';
import ParallelNode from '../WorkflowDesigner/nodes/ParallelNode';
import MergeNode from '../WorkflowDesigner/nodes/MergeNode';
import EndNode from '../WorkflowDesigner/nodes/EndNode';
import FormNode from './nodes/FormNode';

// Import components
import WorkflowSidebar from './WorkflowSidebar';
import WorkflowProperties from './WorkflowProperties';
import FormSelectionModal from './FormSelectionModal';

// Types
interface WorkflowForm {
  id: string;
  name: string;
  description?: string;
  elements: any[];
  createdAt: string;
}

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  forms: WorkflowForm[];
  nodes: Node[];
  edges: Edge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Dummy forms data
const DUMMY_FORMS: WorkflowForm[] = [
  {
    id: 'form-1',
    name: 'Employee Onboarding Form',
    description: 'New employee registration and documentation',
    elements: [
      { id: 'name', type: 'input', label: 'Full Name' },
      { id: 'email', type: 'input', label: 'Email Address' },
      { id: 'department', type: 'dropdown', label: 'Department' },
      { id: 'position', type: 'input', label: 'Position' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'form-2',
    name: 'Leave Request Form',
    description: 'Employee leave application and approval',
    elements: [
      { id: 'employee', type: 'input', label: 'Employee Name' },
      { id: 'leave-type', type: 'dropdown', label: 'Leave Type' },
      { id: 'start-date', type: 'datepicker', label: 'Start Date' },
      { id: 'end-date', type: 'datepicker', label: 'End Date' },
      { id: 'reason', type: 'textarea', label: 'Reason' },
    ],
    createdAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'form-3',
    name: 'Expense Report Form',
    description: 'Employee expense submission and reimbursement',
    elements: [
      { id: 'employee', type: 'input', label: 'Employee Name' },
      { id: 'expense-type', type: 'dropdown', label: 'Expense Type' },
      { id: 'amount', type: 'numberformat', label: 'Amount' },
      { id: 'date', type: 'datepicker', label: 'Expense Date' },
      { id: 'receipt', type: 'uploader', label: 'Receipt' },
    ],
    createdAt: '2024-01-17T09:15:00Z',
  },
  {
    id: 'form-4',
    name: 'Performance Review Form',
    description: 'Annual employee performance evaluation',
    elements: [
      { id: 'employee', type: 'input', label: 'Employee Name' },
      { id: 'reviewer', type: 'input', label: 'Reviewer Name' },
      { id: 'period', type: 'dropdown', label: 'Review Period' },
      { id: 'goals', type: 'textarea', label: 'Goals Achievement' },
      { id: 'rating', type: 'radiogroup', label: 'Overall Rating' },
    ],
    createdAt: '2024-01-18T16:45:00Z',
  },
  {
    id: 'form-5',
    name: 'IT Support Request',
    description: 'Technical support and equipment requests',
    elements: [
      { id: 'requester', type: 'input', label: 'Requester Name' },
      { id: 'priority', type: 'dropdown', label: 'Priority Level' },
      { id: 'category', type: 'dropdown', label: 'Request Category' },
      { id: 'description', type: 'textarea', label: 'Issue Description' },
      { id: 'attachments', type: 'uploader', label: 'Attachments' },
    ],
    createdAt: '2024-01-19T11:20:00Z',
  },
];

const nodeTypes: NodeTypes = {
  start: StartNode,
  condition: ConditionNode,
  action: ActionNode,
  parallel: ParallelNode,
  merge: MergeNode,
  end: EndNode,
  form: FormNode,
};

// Custom hook for drop functionality
const useWorkflowDrop = (setNodes: any, setEdges: any) => {
  const reactFlow = useReactFlow();
  
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    const nodeData = event.dataTransfer.getData('application/nodedata');
    
    if (nodeType && reactFlow) {
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      let newNode: Node;
      
      if (nodeType === 'form' && nodeData) {
        const formData = JSON.parse(nodeData);
        newNode = {
          id: `form-${Date.now()}`,
          type: 'form',
          position,
          data: {
            label: formData.name,
            formId: formData.id,
            formName: formData.name,
            formDescription: formData.description,
            level: 'Form Step',
          },
        };
      } else {
        const nodeCount = Math.floor(Math.random() * 100);
        newNode = {
          id: `${nodeType}-${Date.now()}`,
          type: nodeType as any,
          position,
          data: {
            label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodeCount}`,
            level: `Level ${Math.floor(Math.random() * 5) + 1}`,
          },
        };
      }

      setNodes((prevNodes: Node[]) => [...prevNodes, newNode]);
    }
  }, [reactFlow, setNodes]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return { handleDrop, handleDragOver };
};

const WorkflowCreatorContent: React.FC = () => {
  const navigate = useNavigate();
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowData>({
    id: 'workflow-1',
    name: 'New Workflow',
    description: '',
    forms: [],
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 400, y: 50 },
        data: { label: 'Start', level: 'Level 1' },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 400, y: 500 },
        data: { label: 'End', level: 'Level 5' },
      },
    ],
    edges: [],
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [availableForms] = useState<WorkflowForm[]>(DUMMY_FORMS);

  const [nodes, setNodes, onNodesChange] = useNodesState(currentWorkflow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(currentWorkflow.edges);

  const { handleDrop, handleDragOver } = useWorkflowDrop(setNodes, setEdges);

  // Sync nodes and edges with workflow state
  useEffect(() => {
    setCurrentWorkflow(prev => ({
      ...prev,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    }));
  }, [nodes, edges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      type: 'default',
      data: { label: 'Next' },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  const handleSaveWorkflow = () => {
    console.log('Saving workflow:', currentWorkflow);
    // Here you would typically save to a backend
  };

  const handleToggleActive = () => {
    setCurrentWorkflow(prev => ({
      ...prev,
      isActive: !prev.isActive,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleWorkflowInfoChange = (field: 'name' | 'description', value: string) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddForm = (form: WorkflowForm) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      forms: [...prev.forms, form],
      updatedAt: new Date().toISOString(),
    }));
    setShowFormModal(false);
  };

  const selectedNodeData = nodes.find(node => node.id === selectedNode);

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">
            {currentWorkflow.name}
          </h1>
          <button
            onClick={handleSaveWorkflow}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block">
        <WorkflowSidebar 
          availableForms={availableForms}
          onAddForm={() => setShowFormModal(true)}
          workflowForms={currentWorkflow.forms}
        />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setShowFormModal(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Form to Workflow</span>
        </button>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">{currentWorkflow.name}</h2>
              <p className="text-sm text-gray-600">
                {currentWorkflow.forms.length} form{currentWorkflow.forms.length !== 1 ? 's' : ''} • {nodes.length} node{nodes.length !== 1 ? 's' : ''}
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
            className="h-full w-full"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
              className="bg-gray-50"
              minZoom={0.1}
              maxZoom={2}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            >
              <Controls className="!bottom-4 !left-4" />
              <MiniMap 
                className="!bottom-4 !right-4 !w-32 !h-24 lg:!w-48 lg:!h-32" 
                nodeColor="#3b82f6"
                maskColor="rgba(0, 0, 0, 0.1)"
              />
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={20} 
                size={1} 
                color="#e5e7eb"
              />
              
              {/* Mobile Instructions */}
              <Panel position="top-center" className="lg:hidden">
                <div className="bg-white rounded-lg shadow-lg p-3 mx-4 border border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Tap nodes to select • Use controls to zoom and pan
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
                        Drag components from the sidebar to create your workflow. Connect forms with conditions, actions, and parallel processes.
                      </p>
                      <button
                        onClick={() => setShowFormModal(true)}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Your First Form</span>
                      </button>
                    </div>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </div>
      </div>

      {/* Properties Panel - Desktop Only */}
      <div className="hidden xl:block">
        <WorkflowProperties
          workflow={currentWorkflow}
          selectedNode={selectedNodeData}
          onWorkflowChange={handleWorkflowInfoChange}
          availableForms={availableForms}
        />
      </div>

      {/* Mobile Properties Modal */}
      {selectedNode && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 rounded-t-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Node Properties
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            <WorkflowProperties
              workflow={currentWorkflow}
              selectedNode={selectedNodeData}
              onWorkflowChange={handleWorkflowInfoChange}
              availableForms={availableForms}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Form Selection Modal */}
      <FormSelectionModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        forms={availableForms}
        onSelectForm={handleAddForm}
        selectedForms={currentWorkflow.forms}
      />
    </div>
  );
};

const WorkflowCreator: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReactFlowProvider>
        <WorkflowCreatorContent />
      </ReactFlowProvider>
    </DndProvider>
  );
};

export default WorkflowCreator;