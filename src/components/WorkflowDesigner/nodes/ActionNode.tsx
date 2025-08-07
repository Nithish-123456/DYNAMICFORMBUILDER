import React from 'react';
import { Handle, Position } from 'reactflow';
import { Square } from 'lucide-react';

const ActionNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`w-20 h-16 shadow-md rounded-md bg-blue-500 text-white border-2 flex items-center justify-center ${
      selected ? 'border-blue-700' : 'border-blue-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-600"
      />
      <div className="text-center">
        <Square className="w-4 h-4 mx-auto mb-1" />
        <div className="text-xs font-bold">{data.level}</div>
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