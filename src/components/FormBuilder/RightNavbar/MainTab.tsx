import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateElement } from '../../../store/slices/formBuilderSlice';
import { getComponentDefinition } from '../../../constants/components';
import { Plus, Trash2 } from 'lucide-react';
import { DropdownOption } from '../../../types/form';

const MainTab: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedElement, currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const element = currentForm.elements.find(el => el.id === selectedElement);
  if (!element) return null;

  const componentDef = getComponentDefinition(element.type);

  // Core property handler
  const handlePropertyChange = (property: string, value: any) => {
    dispatch(updateElement({
      id: element.id,
      updates: {
        properties: {
          ...element.properties,
          [property]: value,
        },
      },
    }));
  };

  // Options management handlers
  const handleOptionsChange = (options: DropdownOption[]) => {
    handlePropertyChange('options', options);
  };

  const addOption = () => {
    const currentOptions = element.properties.options || [];
    const newOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option${currentOptions.length + 1}`,
      disabled: false,
    };
    handleOptionsChange([...currentOptions, newOption]);
  };

  const removeOption = (index: number) => {
    const currentOptions = element.properties.options || [];
    handleOptionsChange(currentOptions.filter((_: any, i: any) => i !== index));
  };

  const updateOption = (index: number, field: keyof DropdownOption, value: any) => {
    const currentOptions = element.properties.options || [];
    const updatedOptions = currentOptions.map((option: any, i: any) => 
      i === index ? { ...option, [field]: value } : option
    );
    handleOptionsChange(updatedOptions);
  };

  // Tabs management handlers
  const handleTabsChange = (tabs: any[]) => {
    handlePropertyChange('tabs', tabs);
  };

  const addTab = () => {
    const currentTabs = element.properties.tabs || [];
    const newTab = {
      key: `tab${currentTabs.length + 1}`,
      label: `Tab ${currentTabs.length + 1}`,
      content: `Content ${currentTabs.length + 1}`,
    };
    handleTabsChange([...currentTabs, newTab]);
  };

  const removeTab = (index: number) => {
    const currentTabs = element.properties.tabs || [];
    handleTabsChange(currentTabs.filter((_: any, i: any) => i !== index));
  };

  const updateTab = (index: number, field: string, value: any) => {
    const currentTabs = element.properties.tabs || [];
    const updatedTabs = currentTabs.map((tab: any, i: any) => 
      i === index ? { ...tab, [field]: value } : tab
    );
    handleTabsChange(updatedTabs);
  };

  // Steps management handlers
  const handleStepsChange = (steps: any[]) => {
    handlePropertyChange('steps', steps);
  };

  const addStep = () => {
    const currentSteps = element.properties.steps || [];
    const newStep = {
      title: `Step ${currentSteps.length + 1}`,
      description: `Description for step ${currentSteps.length + 1}`,
    };
    handleStepsChange([...currentSteps, newStep]);
  };

  const removeStep = (index: number) => {
    const currentSteps = element.properties.steps || [];
    handleStepsChange(currentSteps.filter((_: any, i: any) => i !== index));
  };

  const updateStep = (index: number, field: string, value: any) => {
    const currentSteps = element.properties.steps || [];
    const updatedSteps = currentSteps.map((step: any, i: any) => 
      i === index ? { ...step, [field]: value } : step
    );
    handleStepsChange(updatedSteps);
  };

  // Menu items management handlers
  const handleMenuItemsChange = (items: any[]) => {
    handlePropertyChange('items', items);
  };

  const addMenuItem = () => {
    const currentItems = element.properties.items || [];
    const newItem = {
      label: `Item ${currentItems.length + 1}`,
      value: `item${currentItems.length + 1}`,
    };
    handleMenuItemsChange([...currentItems, newItem]);
  };

  const removeMenuItem = (index: number) => {
    const currentItems = element.properties.items || [];
    handleMenuItemsChange(currentItems.filter((_: any, i: any) => i !== index));
  };

  const updateMenuItem = (index: number, field: string, value: any) => {
    const currentItems = element.properties.items || [];
    const updatedItems = currentItems.map((item: any, i: any) => 
      i === index ? { ...item, [field]: value } : item
    );
    handleMenuItemsChange(updatedItems);
  };

  // Property field renderer
  const renderPropertyField = (property: string, value: any, type: string = 'text') => {
    switch (type) {
      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handlePropertyChange(property, e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 capitalize">{property}</span>
          </label>
        );
      
      case 'select':
        const options = getSelectOptions(property, element);
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {property}
            </label>
            <select
              value={value || ''}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {property}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handlePropertyChange(property, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      
      case 'color':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {property}
            </label>
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {property}
            </label>
            <textarea
              value={value || ''}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        );
      
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {property}
            </label>
            <input
              type={type}
              value={value || ''}
              onChange={(e) => handlePropertyChange(property, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
    }
  };

  // Get select options based on property and element type
  const getSelectOptions = (property: string, element: any) => {
    const optionsMap: { [key: string]: { value: string; label: string }[] } = {
      variant: [
        { value: 'primary', label: 'Primary' },
        { value: 'secondary', label: 'Secondary' },
        { value: 'outline', label: 'Outline' }
      ],
      size: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' }
      ],
      layout: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' }
      ],
      align: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' }
      ],
      optionSource: [
        { value: 'static', label: 'Static Options' },
        { value: 'api', label: 'API Source' }
      ]
    };

    // Specific options based on element type
    if (property === 'type' && element.type === 'input') {
      return [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'tel', label: 'Phone' },
        { value: 'url', label: 'URL' }
      ];
    }

    if (property === 'position' && element.type === 'tab') {
      return [
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' }
      ];
    }

    if (property === 'orientation') {
      return [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' }
      ];
    }

    if (property === 'fit' && element.type === 'image') {
      return [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
        { value: 'scale-down', label: 'Scale Down' }
      ];
    }

    if (property === 'target' && element.type === 'link') {
      return [
        { value: '_self', label: 'Same Window' },
        { value: '_blank', label: 'New Window' },
        { value: '_parent', label: 'Parent Frame' },
        { value: '_top', label: 'Top Frame' }
      ];
    }

    if (property === 'type' && ['message', 'errormessage'].includes(element.type)) {
      return [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' }
      ];
    }

    return optionsMap[property] || [];
  };

  // Options manager component
  const renderOptionsManager = () => {
    if (!['dropdown', 'radiogroup', 'menu'].includes(element.type)) return null;

    const options = element.properties.options || [];

    return (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Options</h4>
          <button
            onClick={addOption}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {options.map((option: DropdownOption, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <input
                type="text"
                placeholder="Label"
                value={option.label}
                onChange={(e) => updateOption(index, 'label', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Value"
                value={option.value}
                onChange={(e) => updateOption(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
              <label className="flex items-center text-xs">
                <input
                  type="checkbox"
                  checked={option.disabled || false}
                  onChange={(e) => updateOption(index, 'disabled', e.target.checked)}
                  className="mr-1"
                />
                Disabled
              </label>
              <button
                onClick={() => removeOption(index)}
                className="p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        {element.properties.optionSource === 'api' && (
          <div className="mt-3 space-y-2">
            {renderPropertyField('apiUrl', element.properties.apiUrl)}
            {renderPropertyField('labelField', element.properties.labelField)}
            {renderPropertyField('valueField', element.properties.valueField)}
          </div>
        )}
      </div>
    );
  };

  // Tabs manager component
  const renderTabsManager = () => {
    if (element.type !== 'tab') return null;

    const tabs = element.properties.tabs || [];

    return (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Tabs</h4>
          <button
            onClick={addTab}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {tabs.map((tab: any, index: number) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Tab {index + 1}</span>
                <button
                  onClick={() => removeTab(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Tab Label"
                  value={tab.label}
                  onChange={(e) => updateTab(index, 'label', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Tab Key"
                  value={tab.key}
                  onChange={(e) => updateTab(index, 'key', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Tab Content"
                  value={tab.content}
                  onChange={(e) => updateTab(index, 'content', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Steps manager component
  const renderStepsManager = () => {
    if (!['wizard', 'wizardstep'].includes(element.type)) return null;

    const steps = element.properties.steps || [];

    return (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Steps</h4>
          <button
            onClick={addStep}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {steps.map((step: any, index: number) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Step {index + 1}</span>
                <button
                  onClick={() => removeStep(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Step Title"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <textarea
                  placeholder="Step Description"
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Menu items manager component
  const renderMenuItemsManager = () => {
    if (element.type !== 'menu') return null;

    const items = element.properties.items || [];

    return (
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Menu Items</h4>
          <button
            onClick={addMenuItem}
            className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <input
                type="text"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateMenuItem(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
              />
              <button
                onClick={() => removeMenuItem(index)}
                className="p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Component Header */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-2">
          <span>{componentDef?.icon}</span>
          <span>{componentDef?.name}</span>
        </h3>
      </div>

      {/* Basic Properties */}
      <div className="space-y-4">
        {element.properties.label !== undefined && 
          renderPropertyField('label', element.properties.label)
        }
        
        {element.properties.placeholder !== undefined && 
          renderPropertyField('placeholder', element.properties.placeholder)
        }
        
        {element.properties.text !== undefined && 
          renderPropertyField('text', element.properties.text)
        }
        
        {element.properties.checked !== undefined && 
          renderPropertyField('checked', element.properties.checked, 'checkbox')
        }
        
        {element.properties.variant !== undefined && 
          renderPropertyField('variant', element.properties.variant, 'select')
        }

        {element.properties.size !== undefined && 
          renderPropertyField('size', element.properties.size, 'select')
        }

        {element.properties.type !== undefined && element.type === 'input' &&
          renderPropertyField('type', element.properties.type, 'select')
        }

        {element.properties.maxLength !== undefined && 
          renderPropertyField('maxLength', element.properties.maxLength, 'number')
        }

        {element.properties.rows !== undefined && 
          renderPropertyField('rows', element.properties.rows, 'number')
        }

        {element.properties.multiple !== undefined && 
          renderPropertyField('multiple', element.properties.multiple, 'checkbox')
        }

        {element.properties.searchable !== undefined && 
          renderPropertyField('searchable', element.properties.searchable, 'checkbox')
        }

        {element.properties.disabled !== undefined && 
          renderPropertyField('disabled', element.properties.disabled, 'checkbox')
        }

        {element.properties.layout !== undefined && 
          renderPropertyField('layout', element.properties.layout, 'select')
        }

        {element.properties.align !== undefined && 
          renderPropertyField('align', element.properties.align, 'select')
        }

        {element.properties.level !== undefined && 
          renderPropertyField('level', element.properties.level, 'number')
        }

        {element.properties.color !== undefined && 
          renderPropertyField('color', element.properties.color, 'color')
        }

        {element.properties.value !== undefined && ['progressline', 'progresscircle'].includes(element.type) &&
          renderPropertyField('value', element.properties.value, 'number')
        }

        {element.properties.max !== undefined && 
          renderPropertyField('max', element.properties.max, 'number')
        }

        {element.properties.showText !== undefined && 
          renderPropertyField('showText', element.properties.showText, 'checkbox')
        }

        {element.properties.optionSource !== undefined && 
          renderPropertyField('optionSource', element.properties.optionSource, 'select')
        }

        {element.properties.position !== undefined && element.type === 'tab' &&
          renderPropertyField('position', element.properties.position, 'select')
        }

        {element.properties.orientation !== undefined && 
          renderPropertyField('orientation', element.properties.orientation, 'select')
        }

        {element.properties.fit !== undefined && element.type === 'image' &&
          renderPropertyField('fit', element.properties.fit, 'select')
        }

        {element.properties.src !== undefined && element.type === 'image' &&
          renderPropertyField('src', element.properties.src, 'text')
        }

        {element.properties.alt !== undefined && element.type === 'image' &&
          renderPropertyField('alt', element.properties.alt, 'text')
        }

        {element.properties.href !== undefined && element.type === 'link' &&
          renderPropertyField('href', element.properties.href, 'text')
        }

        {element.properties.target !== undefined && element.type === 'link' &&
          renderPropertyField('target', element.properties.target, 'select')
        }

        {element.properties.content !== undefined && element.type === 'staticcontent' &&
          renderPropertyField('content', element.properties.content, 'textarea')
        }

        {element.properties.format !== undefined && 
          renderPropertyField('format', element.properties.format, 'text')
        }

        {element.properties.message !== undefined && 
          renderPropertyField('message', element.properties.message, 'text')
        }

        {element.properties.type !== undefined && ['message', 'errormessage'].includes(element.type) &&
          renderPropertyField('type', element.properties.type, 'select')
        }
      </div>

      {/* Advanced Properties */}
      {componentDef?.advancedProps && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Advanced Properties</h4>
          <div className="space-y-4">
            {componentDef.advancedProps.map((prop) => {
              if (element.properties[prop] !== undefined) return null; // Already rendered above
              
              const propType = 
                prop.includes('color') || prop.includes('Color') ? 'color' :
                prop.includes('size') || prop.includes('Size') || prop.includes('width') || prop.includes('Width') || 
                prop.includes('height') || prop.includes('Height') || prop.includes('max') || prop.includes('min') ||
                prop.includes('step') || prop.includes('zoom') || prop.includes('rows') || prop.includes('cols') ? 'number' :
                prop.includes('multiple') || prop.includes('searchable') || prop.includes('clearable') || 
                prop.includes('disabled') || prop.includes('required') || prop.includes('readonly') ||
                prop.includes('lazy') || prop.includes('animated') || prop.includes('striped') ||
                prop.includes('showText') || prop.includes('showIcon') ? 'checkbox' :
                prop === 'type' || prop === 'variant' || prop === 'size' || prop === 'layout' || 
                prop === 'align' || prop === 'optionSource' ? 'select' :
                'text';

              return (
                <div key={prop}>
                  {renderPropertyField(prop, element.properties[prop], propType)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Managers */}
      {renderOptionsManager()}
      {renderTabsManager()}
      {renderStepsManager()}
      {renderMenuItemsManager()}

      {/* Grid Layout Properties */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Layout</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
            <input
              type="number"
              min="1"
              max="12"
              value={element.gridProps.w}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    w: parseInt(e.target.value),
                  },
                },
              }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
            <input
              type="number"
              min="1"
              value={element.gridProps.h}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    h: parseInt(e.target.value),
                  },
                },
              }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Additional Grid Properties */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Width</label>
            <input
              type="number"
              min="1"
              value={element.gridProps.minW || 1}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    minW: parseInt(e.target.value),
                  },
                },
              }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Min Height</label>
            <input
              type="number"
              min="1"
              value={element.gridProps.minH || 1}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    minH: parseInt(e.target.value),
                  },
                },
              }))}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Resizable and Draggable Options */}
        <div className="mt-3 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={element.gridProps.isResizable !== false}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    isResizable: e.target.checked,
                  },
                },
              }))}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Resizable</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={element.gridProps.isDraggable !== false}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    isDraggable: e.target.checked,
                  },
                },
              }))}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Draggable</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={element.gridProps.static || false}
              onChange={(e) => dispatch(updateElement({
                id: element.id,
                updates: {
                  gridProps: {
                    ...element.gridProps,
                    static: e.target.checked,
                  },
                },
              }))}
              className="mr-2"
            />
            <span className="text-xs text-gray-700">Static (Non-movable)</span>
          </label>
        </div>
      </div>

      {/* Element Validation Rules */}
      {(element.type === 'input' || element.type === 'textarea' || element.type === 'dropdown') && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Validation</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={element.properties.required || false}
                onChange={(e) => handlePropertyChange('required', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Required</span>
            </label>
            
            {element.type === 'input' && (
              <>
                {renderPropertyField('minLength', element.properties.minLength, 'number')}
                {renderPropertyField('pattern', element.properties.pattern)}
                {renderPropertyField('validationMessage', element.properties.validationMessage)}
              </>
            )}
            
            {element.type === 'textarea' && (
              <>
                {renderPropertyField('minLength', element.properties.minLength, 'number')}
                {renderPropertyField('maxLength', element.properties.maxLength, 'number')}
              </>
            )}
          </div>
        </div>
      )}

      {/* Element Events */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Events</h4>
        <div className="space-y-3">
          {renderPropertyField('onClick', element.properties.onClick)}
          {renderPropertyField('onChange', element.properties.onChange)}
          {renderPropertyField('onFocus', element.properties.onFocus)}
          {renderPropertyField('onBlur', element.properties.onBlur)}
          
          {element.type === 'input' && (
            <>
              {renderPropertyField('onKeyPress', element.properties.onKeyPress)}
              {renderPropertyField('onKeyDown', element.properties.onKeyDown)}
            </>
          )}
          
          {element.type === 'button' && (
            renderPropertyField('onSubmit', element.properties.onSubmit)
          )}
        </div>
      </div>

      {/* Conditional Rendering */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Conditional Logic</h4>
        <div className="space-y-3">
          {renderPropertyField('showWhen', element.properties.showWhen)}
          {renderPropertyField('hideWhen', element.properties.hideWhen)}
          {renderPropertyField('enableWhen', element.properties.enableWhen)}
          {renderPropertyField('disableWhen', element.properties.disableWhen)}
        </div>
      </div>

      {/* Custom CSS */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Styling</h4>
        <div className="space-y-3">
          {renderPropertyField('customClass', element.properties.customClass)}
          {renderPropertyField('customStyles', element.properties.customStyles, 'textarea')}
        </div>
      </div>

      {/* Element ID and Name */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Element Identification</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Element ID</label>
            <input
              type="text"
              value={element.id}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
          </div>
          
          {renderPropertyField('name', element.properties.name)}
          {renderPropertyField('dataTestId', element.properties.dataTestId)}
        </div>
      </div>
    </div>
  );
};

export default MainTab;