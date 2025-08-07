import React from 'react';
import { Handle, Position } from 'reactflow';
import { Circle } from 'lucide-react';

const StartNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`w-16 h-16 shadow-md rounded-full bg-green-500 text-white border-2 flex items-center justify-center ${
      selected ? 'border-green-700' : 'border-green-500'
    }`}>
      <div className="text-center">
        <Circle className="w-4 h-4 mx-auto mb-1" />
        <div className="text-xs font-bold">{data.level}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-600"
      />
    </div>
  );
};

export default StartNode;