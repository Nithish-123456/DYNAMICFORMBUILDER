import React from 'react';
import { Handle, Position } from 'reactflow';
import { FileText } from 'lucide-react';

const FormNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-lg bg-white border-2 min-w-[160px] ${
      selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500"
      />
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-blue-100 text-blue-700">
          <FileText className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-800 truncate">{data.label}</div>
          <div className="text-xs text-gray-500 truncate">{data.level}</div>
          {data.formDescription && (
            <div className="text-xs text-gray-400 mt-1 line-clamp-2">
              {data.formDescription}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500"
      />
    </div>
  );
};

export default FormNode;