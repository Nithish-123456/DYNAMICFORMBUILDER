import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateElement } from '../../../store/slices/formBuilderSlice';
import { getComponentDefinition } from '../../../constants/components';

const ActionsTab: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedElement, currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const element = currentForm.elements.find(el => el.id === selectedElement);
  if (!element) return null;

  const componentDef = getComponentDefinition(element.type);
  const availableActions = componentDef?.availableActions || [];

  const handleActionChange = (action: string, value: string) => {
    dispatch(updateElement({
      id: element.id,
      updates: {
        actions: {
          ...element.actions,
          [action]: value,
        },
      },
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-800">Element Actions</h3>
      
      {availableActions.length === 0 ? (
        <p className="text-sm text-gray-500">No actions available for this element type.</p>
      ) : (
        availableActions.map((action) => (
          <div key={action}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{action}</label>
            <textarea
              value={element.actions[action] || ''}
              onChange={(e) => handleActionChange(action, e.target.value)}
              placeholder={`// ${action} handler\nfunction ${action}(event) {\n  // Your code here\n}`}
              className="w-full h-20 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))
      )}

      {/* Common actions that might not be in availableActions */}
      {!availableActions.includes('onMount') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">onMount</label>
          <textarea
            value={element.actions.onMount || ''}
            onChange={(e) => handleActionChange('onMount', e.target.value)}
            placeholder="// Component mount handler\nfunction onMount() {\n  // Your code here\n}"
            className="w-full h-20 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {!availableActions.includes('onUnmount') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">onUnmount</label>
          <textarea
            value={element.actions.onUnmount || ''}
            onChange={(e) => handleActionChange('onUnmount', e.target.value)}
            placeholder="// Component unmount handler\nfunction onUnmount() {\n  // Your code here\n}"
            className="w-full h-20 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default ActionsTab;