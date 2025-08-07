import React from 'react';
import { useDrag } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addWorkflowNode } from '../../store/slices/workflowSlice';
import { WorkflowNode } from '../../types/workflow';
import { v4 as uuidv4 } from 'uuid';
import {
  Play,
  GitBranch,
  Settings,
  Zap,
  Merge,
  Square,
  Plus,
} from 'lucide-react';

const DraggableNode: React.FC<{ template: any }> = ({ template }) => {
   const handleDragStart = (event: React.DragEvent) => {
    // FIXED: Ensure proper data transfer
    event.dataTransfer.setData('application/reactflow', template.type);
    event.dataTransfer.effectAllowed = 'move';
    
    // FIXED: Add drag image for better UX (optional)
    const dragImage = document.createElement('div');
    dragImage.innerHTML = template.label;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };
const handleDragEnd = (event: React.DragEvent) => {
    event.preventDefault();
  };
  const IconComponent = template.icon;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing hover:border-blue-300"
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-md ${template.color}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{template.label}</h3>
          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
        </div>
        <Plus className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
};

const WorkflowSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWorkflow } = useSelector((state: RootState) => state.workflow);

  const nodeTemplates = [
    {
      type: 'condition',
      label: 'Condition',
      icon: GitBranch,
      description: 'Branch based on form field values',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      type: 'action',
      label: 'Action',
      icon: Zap,
      description: 'Perform an action (email, webhook, etc.)',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      type: 'parallel',
      label: 'Parallel',
      icon: Settings,
      description: 'Execute multiple branches simultaneously',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      type: 'merge',
      label: 'Merge',
      icon: Merge,
      description: 'Merge parallel branches back together',
      color: 'bg-green-100 text-green-700',
    },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Workflow Nodes</h2>
        <p className="text-sm text-gray-600 mt-1">Drag nodes to build your workflow</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {nodeTemplates.map((template) => {
            return (
              <DraggableNode
                key={template.type}
                template={template}
              />
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Workflow Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Nodes:</span>
              <span className="font-medium">{currentWorkflow?.nodes.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium">{currentWorkflow?.edges.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                currentWorkflow?.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {currentWorkflow?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;