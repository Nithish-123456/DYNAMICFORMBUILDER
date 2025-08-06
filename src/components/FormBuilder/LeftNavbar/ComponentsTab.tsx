import React from 'react';
import { useDrag } from 'react-dnd';
import { getComponentsByCategory } from '../../../constants/components';
import { ComponentDefinition } from '../../../types/form';

const DraggableComponent: React.FC<{ component: ComponentDefinition }> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FORM_COMPONENT',
    item: { component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <span className="text-lg">{component.icon}</span>
      <span className="text-sm font-medium text-gray-700">{component.name}</span>
    </div>
  );
};

const ComponentsTab: React.FC = () => {
  const categories = [
    { id: 'fields', label: 'Fields', components: getComponentsByCategory('fields') },
    { id: 'static', label: 'Static', components: getComponentsByCategory('static') },
    { id: 'structure', label: 'Structure', components: getComponentsByCategory('structure') },
    { id: 'templates', label: 'Templates', components: getComponentsByCategory('templates') },
  ];

  return (
    <div className="p-4 space-y-6">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            {category.label}
          </h3>
          <div className="space-y-2">
            {category.components.map((component) => (
              <DraggableComponent key={component.type} component={component} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentsTab;