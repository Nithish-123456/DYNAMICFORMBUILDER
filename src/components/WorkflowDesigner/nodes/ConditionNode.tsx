import React from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';

const ConditionNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-yellow-500 text-white border-2 ${
      selected ? 'border-yellow-700' : 'border-yellow-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-yellow-600"
      />
      <div className="flex items-center space-x-2">
        <GitBranch className="w-4 h-4" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs opacity-80">{data.level}</div>
          {data.formElementId && (
            <div className="text-xs opacity-70 mt-1">
              Field: {data.conditionField || 'Selected'}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 !bg-yellow-600"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 !bg-yellow-600"
        style={{ left: '75%' }}
      />
    </div>
  );
};

export default ConditionNode;