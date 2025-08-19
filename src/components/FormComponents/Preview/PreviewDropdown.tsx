import React from "react";
import { FormElement } from "../../../types/form";

interface PreviewDropdownProps {
  element: FormElement;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  errors?: Record<string, any>;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PreviewDropdown: React.FC<PreviewDropdownProps> = ({
  element,
  value = "",
  onChange,
  errors,
  disabled = false,
  readOnly = false
}) => {
  const isRequired = element.properties.validate?.required?.id;
  const isDisabled = disabled || element.properties.disable?.id || readOnly;
  const placeholder = element.properties.placeholder || "Select an option";
  const label = element.properties.label || "";
  const elementId = element.id;
  const options = element.properties.options || [];
  const isMultiple = element.properties.multiple || false;
  const isSearchable = element.properties.searchable || false;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      if (isMultiple) {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions);
      } else {
        onChange(e.target.value);
      }
    }
  };

  const getDisplayValue = () => {
    if (isMultiple && Array.isArray(value)) {
      return value;
    }
    return value || "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={elementId}
        name={elementId}
        value={getDisplayValue()}
        onChange={handleChange}
        disabled={isDisabled}
        multiple={isMultiple}
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDisabled 
            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${errors && errors[elementId] ? 'border-red-500 focus:ring-red-500' : ''}
          ${isMultiple ? 'min-h-20' : ''}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option: any, index: number) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errors && errors[elementId] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[elementId]?.message || errors[elementId]}
        </p>
      )}
    </div>
  );
};
