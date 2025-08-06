import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  updateWorkflowNode,
  updateWorkflowInfo,
  toggleWorkflowActive,
} from '../../store/slices/workflowSlice';

const WorkflowProperties: React.FC = () => {
  const dispatch = useDispatch();
  const { currentWorkflow, selectedNode } = useSelector((state: RootState) => state.workflow);
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  const selectedNodeData = currentWorkflow?.nodes.find(node => node.id === selectedNode);
  const formElements = currentForm?.elements || [];

  const handleWorkflowInfoChange = (field: 'name' | 'description', value: string) => {
    dispatch(updateWorkflowInfo({ [field]: value }));
  };

  const handleNodePropertyChange = (property: string, value: any) => {
    if (!selectedNode) return;
    
    dispatch(updateWorkflowNode({
      id: selectedNode,
      updates: {
        data: {
          ...selectedNodeData?.data,
          [property]: value,
        },
      },
    }));
  };

  const renderNodeProperties = () => {
    if (!selectedNodeData) return null;

    switch (selectedNodeData.type) {
      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Form Field
              </label>
              <select
                value={selectedNodeData.data.formElementId || ''}
                onChange={(e) => handleNodePropertyChange('formElementId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a field</option>
                {formElements.map((element) => (
                  <option key={element.id} value={element.id}>
                    {element.properties.label || element.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                value={selectedNodeData.data.conditionOperator || 'equals'}
                onChange={(e) => handleNodePropertyChange('conditionOperator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="equals">Equals</option>
                <option value="not_equals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={selectedNodeData.data.conditionValue || ''}
                onChange={(e) => handleNodePropertyChange('conditionValue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter condition value"
              />
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={selectedNodeData.data.actionType || 'email'}
                onChange={(e) => handleNodePropertyChange('actionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="email">Send Email</option>
                <option value="webhook">Call Webhook</option>
                <option value="approval">Request Approval</option>
                <option value="assignment">Assign Task</option>
              </select>
            </div>

            {selectedNodeData.data.actionType === 'email' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email To
                  </label>
                  <input
                    type="email"
                    value={selectedNodeData.data.actionConfig?.emailTo || ''}
                    onChange={(e) => handleNodePropertyChange('actionConfig', {
                      ...selectedNodeData.data.actionConfig,
                      emailTo: e.target.value,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={selectedNodeData.data.actionConfig?.subject || ''}
                    onChange={(e) => handleNodePropertyChange('actionConfig', {
                      ...selectedNodeData.data.actionConfig,
                      subject: e.target.value,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>
              </>
            )}

            {selectedNodeData.data.actionType === 'webhook' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={selectedNodeData.data.actionConfig?.webhookUrl || ''}
                  onChange={(e) => handleNodePropertyChange('actionConfig', {
                    ...selectedNodeData.data.actionConfig,
                    webhookUrl: e.target.value,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.example.com/webhook"
                />
              </div>
            )}
          </div>
        );

      case 'parallel':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Branches
              </label>
              <input
                type="number"
                min="2"
                max="5"
                value={selectedNodeData.data.parallelBranches?.length || 2}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  const branches = Array.from({ length: count }, (_, i) => `branch-${i + 1}`);
                  handleNodePropertyChange('parallelBranches', branches);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            No additional properties for this node type.
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Workflow Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                value={currentWorkflow?.name || ''}
                onChange={(e) => handleWorkflowInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={currentWorkflow?.description || ''}
                onChange={(e) => handleWorkflowInfoChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe this workflow..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentWorkflow?.isActive || false}
                  onChange={() => dispatch(toggleWorkflowActive())}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active Workflow</span>
              </label>
            </div>
          </div>
        </div>

        {selectedNodeData && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Node Properties: {selectedNodeData.data.label}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Node Label
                </label>
                <input
                  type="text"
                  value={selectedNodeData.data.label}
                  onChange={(e) => handleNodePropertyChange('label', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <input
                  type="text"
                  value={selectedNodeData.data.level}
                  onChange={(e) => handleNodePropertyChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {renderNodeProperties()}
            </div>
          </div>
        )}

        {!selectedNodeData && (
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