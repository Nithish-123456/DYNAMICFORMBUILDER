import React from 'react';
import { Handle, Position } from 'reactflow';
import { Square } from 'lucide-react';

const EndNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-red-500 text-white border-2 ${
      selected ? 'border-red-700' : 'border-red-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-red-600"
      />
      <div className="flex items-center space-x-2">
        <Square className="w-4 h-4" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs opacity-80">{data.level}</div>
        </div>
      </div>
    </div>
  );
};

export default EndNode;