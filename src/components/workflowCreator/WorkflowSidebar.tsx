import React from 'react';
import { Plus, Workflow, GitBranch, Zap, Settings, Merge, FileText } from 'lucide-react';

interface WorkflowForm {
  id: string;
  name: string;
  description?: string;
}

interface WorkflowSidebarProps {
  availableForms: WorkflowForm[];
  onAddForm: () => void;
  workflowForms: WorkflowForm[];
}

const DraggableNode: React.FC<{ template: any }> = ({ template }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', template.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const IconComponent = template.icon;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
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

const DraggableForm: React.FC<{ form: WorkflowForm }> = ({ form }) => {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', 'form');
    event.dataTransfer.setData('application/nodedata', JSON.stringify(form));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-blue-400 bg-blue-50"
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-blue-100 text-blue-700">
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 text-sm truncate">{form.name}</h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {form.description || 'Form component'}
          </p>
        </div>
      </div>
    </div>
  );
};

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ 
  availableForms, 
  onAddForm, 
  workflowForms 
}) => {
  const nodeTemplates = [
    {
      type: 'condition',
      label: 'Condition',
      icon: GitBranch,
      description: 'Branch workflow based on form data or conditions',
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      type: 'action',
      label: 'Action',
      icon: Zap,
      description: 'Execute actions like sending emails or webhooks',
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
        {/* Forms Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Workflow Forms
            </h3>
            <button
              onClick={onAddForm}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {workflowForms.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No forms added yet</p>
                <button
                  onClick={onAddForm}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Add your first form
                </button>
              </div>
            ) : (
              workflowForms.map((form) => (
                <DraggableForm key={form.id} form={form} />
              ))
            )}
          </div>
        </div>

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

        {/* Instructions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-800 mb-2">How to use:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag forms and nodes to the canvas</li>
            <li>• Connect nodes by dragging from handles</li>
            <li>• Click nodes to configure properties</li>
            <li>• Use conditions for branching logic</li>
            <li>• Parallel nodes for simultaneous execution</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;