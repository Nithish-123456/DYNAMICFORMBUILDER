import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectElement, removeElement, duplicateElement } from '../../../store/slices/formBuilderSlice';
import { FormElement as FormElementType } from '../../../types/form';
import { getComponentDefinition } from '../../../constants/components';
import { Trash2, Copy } from 'lucide-react';

// Component renderers
const InputComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <div className="h-full">
    {element.properties.label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {element.properties.label}
      </label>
    )}
    <input
      type={element.properties.type || 'text'}
      placeholder={element.properties.placeholder || ''}
      maxLength={element.properties.maxLength || undefined}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={!isPreview}
    />
  </div>
);

const DropdownComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <div className="h-full">
    {element.properties.label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {element.properties.label}
      </label>
    )}
    <select
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      disabled={!isPreview}
      multiple={element.properties.multiple}
    >
      <option value="">{element.properties.placeholder || 'Select an option'}</option>
      {element.properties.options?.map((option: any, index: number) => (
        <option key={index} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const RadioGroupComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <div className="h-full">
    {element.properties.label && (
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {element.properties.label}
      </label>
    )}
    <div className={`space-${element.properties.layout === 'horizontal' ? 'x' : 'y'}-2 ${element.properties.layout === 'horizontal' ? 'flex' : ''}`}>
      {element.properties.options?.map((option: any, index: number) => (
        <label key={index} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={element.id}
            value={option.value}
            className="text-blue-600 focus:ring-blue-500"
            disabled={!isPreview}
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const NumberFormatComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <div className="h-full">
    {element.properties.label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {element.properties.label}
      </label>
    )}
    <div className="relative">
      {element.properties.prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {element.properties.prefix}
        </span>
      )}
      <input
        type="number"
        min={element.properties.min || undefined}
        max={element.properties.max || undefined}
        step={element.properties.step || undefined}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          element.properties.prefix ? 'pl-8' : ''
        } ${element.properties.suffix ? 'pr-8' : ''}`}
        disabled={!isPreview}
      />
      {element.properties.suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {element.properties.suffix}
        </span>
      )}
    </div>
  </div>
);

const ProgressLineComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="h-full flex flex-col justify-center">
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{
          width: `${Math.min(100, Math.max(0, (element.properties.value / element.properties.max) * 100))}%`,
          backgroundColor: element.properties.color || '#3b82f6',
        }}
      />
    </div>
    {element.properties.showText && (
      <div className="text-center text-sm text-gray-600 mt-1">
        {element.properties.value}%
      </div>
    )}
  </div>
);

const ProgressCircleComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const radius = (element.properties.size - element.properties.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (element.properties.value / element.properties.max) * 100;
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative">
        <svg
          width={element.properties.size}
          height={element.properties.size}
          className="transform -rotate-90"
        >
          <circle
            cx={element.properties.size / 2}
            cy={element.properties.size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={element.properties.strokeWidth}
            fill="transparent"
          />
          <circle
            cx={element.properties.size / 2}
            cy={element.properties.size / 2}
            r={radius}
            stroke={element.properties.color || '#3b82f6'}
            strokeWidth={element.properties.strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        {element.properties.showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {element.properties.value}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const QRCodeComponent: React.FC<{ element: FormElementType }> = ({ element }) => (
  <div className="h-full flex items-center justify-center">
    <div
      className="bg-white border-2 border-gray-300 flex items-center justify-center"
      style={{
        width: element.properties.size,
        height: element.properties.size,
      }}
    >
      <div className="text-center">
        <div className="text-2xl mb-1">📱</div>
        <div className="text-xs text-gray-500">QR Code</div>
        <div className="text-xs text-gray-400 mt-1 break-all">
          {element.properties.value}
        </div>
      </div>
    </div>
  </div>
);

const TextareaComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <div className="h-full">
    {element.properties.label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {element.properties.label}
      </label>
    )}
    <textarea
      placeholder={element.properties.placeholder || ''}
      rows={element.properties.rows || 4}
      maxLength={element.properties.maxLength || undefined}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      disabled={!isPreview}
      style={{ height: 'calc(100% - 24px)' }}
    />
  </div>
);

const ButtonComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element }) => (
  <button
    disabled={element.properties.disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors h-full w-full ${
      element.properties.variant === 'primary'
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : element.properties.variant === 'secondary'
        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
    } ${element.properties.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${
      element.properties.size === 'small' ? 'text-sm px-3 py-1' :
      element.properties.size === 'large' ? 'text-lg px-6 py-3' : ''
    }`}
  >
    {element.properties.text || 'Button'}
  </button>
);

const CheckboxComponent: React.FC<{ element: FormElementType; isPreview: boolean }> = ({ element, isPreview }) => (
  <label className="flex items-center space-x-2 cursor-pointer">
    <input
      type="checkbox"
      defaultChecked={element.properties.checked}
      value={element.properties.value}
      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      disabled={!isPreview}
    />
    <span className="text-sm text-gray-700">{element.properties.label || 'Checkbox'}</span>
  </label>
);

const HeaderComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const HeaderTag = `h${element.properties.level || 1}` as keyof JSX.IntrinsicElements;
  return (
    <HeaderTag 
      className={`font-bold text-gray-800 ${
      element.properties.level === 1 ? 'text-2xl' :
      element.properties.level === 2 ? 'text-xl' :
      element.properties.level === 3 ? 'text-lg' : 'text-base'
    } ${
      element.properties.align === 'center' ? 'text-center' :
      element.properties.align === 'right' ? 'text-right' : 'text-left'
    } ${element.properties.underline ? 'underline' : ''}`}
      style={{ color: element.properties.color || undefined }}
    >
      {element.properties.text || 'Header'}
    </HeaderTag>
  );
};

const GenericComponent: React.FC<{ element: FormElementType }> = ({ element }) => {
  const componentDef = getComponentDefinition(element.type);
  return (
    <div className="flex items-center justify-center h-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-md">
      <div className="text-center">
        <span className="text-2xl mb-2 block">{componentDef?.icon}</span>
        <span className="text-sm font-medium text-gray-600">{componentDef?.name}</span>
      </div>
    </div>
  );
};

// Component renderer mapping
const componentRenderers: Record<string, React.FC<any>> = {
  input: InputComponent,
  dropdown: DropdownComponent,
  radiogroup: RadioGroupComponent,
  numberformat: NumberFormatComponent,
  progressline: ProgressLineComponent,
  progresscircle: ProgressCircleComponent,
  qrcode: QRCodeComponent,
  textarea: TextareaComponent,
  button: ButtonComponent,
  checkbox: CheckboxComponent,
  header: HeaderComponent,
};

interface FormElementProps {
  element: FormElementType;
  isPreview: boolean;
}

const FormElement: React.FC<FormElementProps> = ({ element, isPreview }) => {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state: RootState) => state.formBuilder.selectedElement);
  
  const isSelected = selectedElement === element.id && !isPreview;
  const ComponentRenderer = componentRenderers[element.type] || GenericComponent;

  const handleClick = (e: React.MouseEvent) => {
    if (!isPreview) {
      e.stopPropagation();
      dispatch(selectElement(element.id));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeElement(element.id));
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(duplicateElement(element.id));
  };

  return (
    <div
      onClick={handleClick}
      className={`h-full p-2 rounded-md transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-50'
          : isPreview
          ? ''
          : 'hover:ring-1 hover:ring-gray-300 cursor-pointer'
      }`}
      style={element.style}
    >
      {isSelected && !isPreview && (
        <div className="absolute -top-2 -right-2 flex space-x-1 z-10">
          <button
            onClick={handleDuplicate}
            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
      <ComponentRenderer element={element} isPreview={isPreview} />
    </div>
  );
};

export default FormElement;