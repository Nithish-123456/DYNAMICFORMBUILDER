import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { RootState } from '../../store';
import {
  updateWorkflowNodes,
  updateWorkflowEdges,
  addWorkflowEdge,
  setWorkflowMode,
} from '../../store/slices/workflowSlice';

import WorkflowSidebar from './WorkflowSidebar';
import WorkflowProperties from './WorkflowProperties';
import StartNode from './nodes/StartNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import ParallelNode from './nodes/ParallelNode';
import MergeNode from './nodes/MergeNode';
import EndNode from './nodes/EndNode';
import { ArrowLeft } from 'lucide-react';

const nodeTypes: NodeTypes = {
  start: StartNode,
  condition: ConditionNode,
  action: ActionNode,
  parallel: ParallelNode,
  merge: MergeNode,
  end: EndNode,
};

const WorkflowDesigner: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWorkflow, selectedNode } = useSelector((state: RootState) => state.workflow);
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

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

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `edge-${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        type: 'default',
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
      // Update Redux store with new node positions
      const updatedNodes = nodes.map(node => {
        const change = changes.find((c: any) => c.id === node.id && c.type === 'position');
        if (change) {
          return {
            ...node,
            position: change.position || node.position,
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
    },
    [dispatch, nodes, onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      onEdgesChange(changes);
      dispatch(updateWorkflowEdges(edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        data: edge.data,
      }))));
    },
    [dispatch, edges, onEdgesChange]
  );

  const handleBackToForm = () => {
    dispatch(setWorkflowMode(false));
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
    <div className="h-screen flex bg-gray-50">
      {/* Workflow Sidebar */}
      <WorkflowSidebar />

      {/* Main Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
              <p className="text-sm text-gray-600">Form: {currentForm?.name}</p>
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
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Save Workflow
            </button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      <WorkflowProperties />
    </div>
  );
};

export default WorkflowDesigner;