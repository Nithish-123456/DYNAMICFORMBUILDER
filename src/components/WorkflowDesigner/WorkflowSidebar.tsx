import React from 'react';
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
  Workflow,
} from 'lucide-react';

const DraggableNode: React.FC<{ template: any }> = ({ template }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', template.type);
    event.dataTransfer.effectAllowed = 'move';
    
    const dragImage = document.createElement('div');
    dragImage.innerHTML = template.label;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
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
      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-blue-300 bg-white"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-md ${template.color}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 text-sm truncate">{template.label}</h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.description}</p>
        </div>
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
      description: 'Branch workflow based on form field values or conditions',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      type: 'action',
      label: 'Action',
      icon: Zap,
      description: 'Perform actions like sending emails or calling webhooks',
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Workflow className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Workflow Builder</h2>
        </div>
        <p className="text-sm text-gray-600">Drag components to build your workflow</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Workflow Nodes Section */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Workflow Nodes
          </h3>
          <div className="space-y-2">
            {nodeTemplates.map((template) => (
              <DraggableNode key={template.type} template={template} />
            ))}
          </div>
        </div>

        {/* Workflow Info */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Workflow Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Nodes:</span>
              <span className="font-medium">{currentWorkflow?.nodes.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium">{currentWorkflow?.edges.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${
                currentWorkflow?.isActive ? 'text-green-600' : 'text-gray-600'
              }`}>
                {currentWorkflow?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-800 mb-2">How to use:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
              <span>Drag nodes to the canvas</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
              <span>Connect nodes by dragging from handles</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
              <span>Click nodes to configure properties</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
              <span>Use conditions for branching logic</span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
              <span>Parallel nodes for simultaneous execution</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;