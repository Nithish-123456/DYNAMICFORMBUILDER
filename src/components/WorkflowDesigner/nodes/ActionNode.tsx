import React from 'react';
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';

const ActionNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-blue-500 text-white border-2 ${
      selected ? 'border-blue-700' : 'border-blue-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-600"
      />
      <div className="flex items-center space-x-2">
        <Zap className="w-4 h-4" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs opacity-80">{data.level}</div>
          {data.actionType && (
            <div className="text-xs opacity-70 mt-1 capitalize">
              {data.actionType}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-600"
      />
    </div>
  );
};

export default ActionNode;