import React from 'react';
import { Handle, Position } from 'reactflow';
import { Circle } from 'lucide-react';

const EndNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`w-16 h-16 shadow-md rounded-full bg-red-500 text-white border-2 flex items-center justify-center ${
      selected ? 'border-red-700' : 'border-red-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-red-600"
      />
      <div className="text-center">
        <Circle className="w-4 h-4 mx-auto mb-1" />
        <div className="text-xs font-bold">{data.level}</div>
      </div>
    </div>
  );
};

export default EndNode;