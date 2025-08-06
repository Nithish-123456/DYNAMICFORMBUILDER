import React from 'react';
import { Handle, Position } from 'reactflow';
import { Merge } from 'lucide-react';

const MergeNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-green-600 text-white border-2 ${
      selected ? 'border-green-800' : 'border-green-600'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-green-700"
        style={{ left: '25%' }}
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-green-700"
        style={{ left: '75%' }}
      />
      <div className="flex items-center space-x-2">
        <Merge className="w-4 h-4" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs opacity-80">{data.level}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-700"
      />
    </div>
  );
};

export default MergeNode;