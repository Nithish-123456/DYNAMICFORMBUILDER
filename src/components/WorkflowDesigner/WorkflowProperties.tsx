import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  updateWorkflowNode,
  updateWorkflowInfo,
  toggleWorkflowActive,
} from '../../store/slices/workflowSlice';
import { Settings, FileText, GitBranch, Zap, Merge, Play, Square } from 'lucide-react';

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

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'condition': return GitBranch;
      case 'action': return Zap;
      case 'parallel': return Settings;
      case 'merge': return Merge;
      case 'start': return Play;
      case 'end': return Square;
      default: return Settings;
    }
  };

  const getNodeColor = (nodeType: string) => {
    switch (nodeType) {
      case 'condition': return 'bg-yellow-100 text-yellow-700';
      case 'action': return 'bg-blue-100 text-blue-700';
      case 'parallel': return 'bg-purple-100 text-purple-700';
      case 'merge': return 'bg-green-100 text-green-700';
      case 'start': return 'bg-green-100 text-green-700';
      case 'end': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderNodeProperties = () => {
    if (!selectedNodeData) return null;

    const IconComponent = getNodeIcon(selectedNodeData.type);
    const colorClass = getNodeColor(selectedNodeData.type);

    return (
      <div className="space-y-4">
        {/* Node Header */}
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${colorClass.replace('text-', 'bg-').replace('-700', '-50')} border`}>
          <div className={`p-2 rounded-md ${colorClass}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 capitalize">{selectedNodeData.type} Node</h4>
            <p className="text-sm text-gray-600">{selectedNodeData.data.label}</p>
          </div>
        </div>

        {/* Basic Properties */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Node Label
            </label>
            <input
              type="text"
              value={selectedNodeData.data.label}
              onChange={(e) => handleNodePropertyChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter node label"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter level"
            />
          </div>
        </div>

        {/* Type-specific Properties */}
        {selectedNodeData.type === 'condition' && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800">Condition Settings</h5>
            
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
                <option value="is_empty">Is Empty</option>
                <option value="is_not_empty">Is Not Empty</option>
              </select>
            </div>

            {!['is_empty', 'is_not_empty'].includes(selectedNodeData.data.conditionOperator || '') && (
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
            )}
          </div>
        )}

        {selectedNodeData.type === 'action' && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800">Action Settings</h5>
            
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
                <option value="notification">Send Notification</option>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={selectedNodeData.data.actionConfig?.message || ''}
                    onChange={(e) => handleNodePropertyChange('actionConfig', {
                      ...selectedNodeData.data.actionConfig,
                      message: e.target.value,
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email message..."
                  />
                </div>
              </>
            )}

            {selectedNodeData.data.actionType === 'webhook' && (
              <>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    HTTP Method
                  </label>
                  <select
                    value={selectedNodeData.data.actionConfig?.method || 'POST'}
                    onChange={(e) => handleNodePropertyChange('actionConfig', {
                      ...selectedNodeData.data.actionConfig,
                      method: e.target.value,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
              </>
            )}

            {selectedNodeData.data.actionType === 'assignment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <input
                  type="text"
                  value={selectedNodeData.data.actionConfig?.assignTo || ''}
                  onChange={(e) => handleNodePropertyChange('actionConfig', {
                    ...selectedNodeData.data.actionConfig,
                    assignTo: e.target.value,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="User ID or role"
                />
              </div>
            )}
          </div>
        )}

        {selectedNodeData.type === 'parallel' && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800">Parallel Settings</h5>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Execution Mode
              </label>
              <select
                value={selectedNodeData.data.executionMode || 'all'}
                onChange={(e) => handleNodePropertyChange('executionMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wait for all branches</option>
                <option value="any">Continue when any branch completes</option>
                <option value="majority">Wait for majority</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        </div>
      </div>

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
                value={currentWorkflow?.name || ''}
                onChange={(e) => handleWorkflowInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter workflow name"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe this workflow..."
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={currentWorkflow?.isActive || false}
                  onChange={() => dispatch(toggleWorkflowActive())}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Active Workflow</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Information */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Form Information</h3>
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">{currentForm?.name}</p>
              <p className="text-xs text-blue-700">
                {currentForm?.elements.length} field{currentForm?.elements.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Node Properties */}
        {selectedNodeData ? (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Selected Node
            </h3>
            {renderNodeProperties()}
          </div>
        ) : (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No node selected</p>
              <p className="text-xs text-gray-400">Click on a node to edit its properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowProperties;