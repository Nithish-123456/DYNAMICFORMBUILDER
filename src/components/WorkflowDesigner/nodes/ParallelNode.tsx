import React from 'react';
import { Handle, Position } from 'reactflow';
import { Settings } from 'lucide-react';

const ParallelNode: React.FC<any> = ({ data, selected }) => {
  const branchCount = data.parallelBranches?.length || 2;
  
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-purple-500 text-white border-2 ${
      selected ? 'border-purple-700' : 'border-purple-500'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-purple-600"
      />
      <div className="flex items-center space-x-2">
        <Settings className="w-4 h-4" />
        <div>
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs opacity-80">{data.level}</div>
          <div className="text-xs opacity-70 mt-1">
            {branchCount} branches
          </div>
        </div>
      </div>
      {Array.from({ length: branchCount }, (_, i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Bottom}
          id={`branch-${i}`}
          className="w-3 h-3 !bg-purple-600"
          style={{ left: `${(100 / (branchCount + 1)) * (i + 1)}%` }}
        />
      ))}
    </div>
  );
};

export default ParallelNode;