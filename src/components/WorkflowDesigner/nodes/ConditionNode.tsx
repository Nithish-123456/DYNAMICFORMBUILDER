import React from 'react';
import { Handle, Position } from 'reactflow';
import { Diamond } from 'lucide-react';

const ConditionNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md transform rotate-45 bg-yellow-500 text-white border-2 ${
      selected ? 'border-yellow-700' : 'border-yellow-500'
    } w-20 h-20 flex items-center justify-center`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-yellow-600"
      />
      <div className="transform -rotate-45 text-center">
        <Diamond className="w-4 h-4 mx-auto mb-1" />
        <div className="text-xs font-bold">{data.level}</div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 !bg-yellow-600"
        style={{ left: '20%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 !bg-yellow-600"
        style={{ left: '80%' }}
      />
    </div>
  );
};

export default ConditionNode;