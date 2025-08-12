import React from 'react';
import { Settings, FileText, GitBranch, Zap } from 'lucide-react';

interface WorkflowForm {
  id: string;
  name: string;
  description?: string;
}

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  forms: WorkflowForm[];
  isActive: boolean;
}

interface WorkflowPropertiesProps {
  workflow: WorkflowData;
  selectedNode: any;
  onWorkflowChange: (field: 'name' | 'description', value: string) => void;
  availableForms: WorkflowForm[];
  isMobile?: boolean;
}

const WorkflowProperties: React.FC<WorkflowPropertiesProps> = ({
  workflow,
  selectedNode,
  onWorkflowChange,
  availableForms,
  isMobile = false,
}) => {
  const renderNodeProperties = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'form':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">{selectedNode.data.formName}</h4>
                <p className="text-sm text-blue-700">{selectedNode.data.formDescription}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Step Name
              </label>
              <input
                type="text"
                value={selectedNode.data.label}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter step name"
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <GitBranch className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Condition Node</h4>
                <p className="text-sm text-yellow-700">Branch workflow based on conditions</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="form_field">Form Field Value</option>
                <option value="user_role">User Role</option>
                <option value="time_based">Time Based</option>
                <option value="custom">Custom Logic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field to Check
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select a field</option>
                <option value="status">Status</option>
                <option value="priority">Priority</option>
                <option value="amount">Amount</option>
                <option value="department">Department</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
                <option value="contains">Contains</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter condition value"
              />
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Action Node</h4>
                <p className="text-sm text-blue-700">Execute automated actions</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="email">Send Email</option>
                <option value="webhook">Call Webhook</option>
                <option value="notification">Send Notification</option>
                <option value="assignment">Assign Task</option>
                <option value="approval">Request Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email addresses or user roles"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Template
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter message template..."
              />
            </div>
          </div>
        );

      case 'parallel':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-purple-900">Parallel Node</h4>
                <p className="text-sm text-purple-700">Execute multiple branches simultaneously</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Branches
              </label>
              <input
                type="number"
                min="2"
                max="5"
                defaultValue="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Execution Mode
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">Wait for all branches</option>
                <option value="any">Continue when any branch completes</option>
                <option value="majority">Wait for majority</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500 text-center py-4">
            No additional properties for this node type.
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col ${isMobile ? 'w-full' : 'w-80 h-full'}`}>
      {!isMobile && (
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Workflow Settings */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Workflow Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => onWorkflowChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={workflow.description || ''}
                onChange={(e) => onWorkflowChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this workflow..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={workflow.isActive}
                  className="mr-2"
                  readOnly
                />
                <span className="text-sm text-gray-700">Active Workflow</span>
              </label>
            </div>
          </div>
        </div>

        {/* Workflow Forms */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Workflow Forms ({workflow.forms.length})
          </h3>
          {workflow.forms.length === 0 ? (
            <p className="text-sm text-gray-500">No forms added to this workflow yet.</p>
          ) : (
            <div className="space-y-2">
              {workflow.forms.map((form) => (
                <div key={form.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{form.name}</p>
                    {form.description && (
                      <p className="text-xs text-gray-600 truncate">{form.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Node Properties */}
        {selectedNode && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Node Properties: {selectedNode.data.label}
            </h3>
            {renderNodeProperties()}
          </div>
        )}

        {!selectedNode && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Select a node to edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowProperties;