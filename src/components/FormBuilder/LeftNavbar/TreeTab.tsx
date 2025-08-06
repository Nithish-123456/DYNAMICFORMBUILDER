import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { selectElement, removeElement } from '../../../store/slices/formBuilderSlice';
import { ChevronRight, ChevronDown, Trash2 } from 'lucide-react';
import { getComponentDefinition } from '../../../constants/components';

const TreeItem: React.FC<{ elementId: string; level: number }> = ({ elementId, level }) => {
  const dispatch = useDispatch();
  const element = useSelector((state: RootState) => 
    state.formBuilder.currentForm.elements.find(el => el.id === elementId)
  );
  const selectedElement = useSelector((state: RootState) => state.formBuilder.selectedElement);
  
  if (!element) return null;

  const componentDef = getComponentDefinition(element.type);
  const isSelected = selectedElement === element.id;
  const hasChildren = element.children && element.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center space-x-2 p-2 rounded cursor-pointer group ${
          isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => dispatch(selectElement(element.id))}
      >
        {hasChildren && (
          <ChevronRight className="w-4 h-4" />
        )}
        {!hasChildren && <div className="w-4" />}
        
        <span className="text-sm">{componentDef?.icon}</span>
        <span className="text-sm font-medium flex-1">
          {element.properties.label || componentDef?.name || element.type}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeElement(element.id));
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </button>
      </div>
      
      {hasChildren && element.children?.map((child) => (
        <TreeItem key={child.id} elementId={child.id} level={level + 1} />
      ))}
    </div>
  );
};

const TreeTab: React.FC = () => {
  const elements = useSelector((state: RootState) => state.formBuilder.currentForm.elements);

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Form Structure</h3>
      {elements.length === 0 ? (
        <p className="text-sm text-gray-500">No elements added yet</p>
      ) : (
        <div className="space-y-1">
          {elements.map((element) => (
            <TreeItem key={element.id} elementId={element.id} level={0} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeTab;