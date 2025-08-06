import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateElement } from '../../../store/slices/formBuilderSlice';

const StyleTab: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedElement, currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const element = currentForm.elements.find(el => el.id === selectedElement);
  if (!element) return null;

  const handleStyleChange = (property: string, value: any) => {
    dispatch(updateElement({
      id: element.id,
      updates: {
        style: {
          ...element.style,
          [property]: value,
        },
      },
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Element Styles</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <input
          type="color"
          value={element.style.backgroundColor || '#ffffff'}
          onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
        <input
          type="color"
          value={element.style.color || '#000000'}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
        <input
          type="text"
          value={element.style.padding || ''}
          placeholder="e.g., 16px"
          onChange={(e) => handleStyleChange('padding', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
        <input
          type="text"
          value={element.style.margin || ''}
          placeholder="e.g., 8px"
          onChange={(e) => handleStyleChange('margin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
        <input
          type="text"
          value={element.style.borderRadius || ''}
          placeholder="e.g., 4px"
          onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default StyleTab;