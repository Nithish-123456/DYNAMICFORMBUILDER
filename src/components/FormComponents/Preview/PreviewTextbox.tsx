import React from "react";
import { FormElement } from "../../../types/form";

interface PreviewTextboxProps {
  element: FormElement;
  value?: string;
  onChange?: (value: string) => void;
  errors?: Record<string, any>;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PreviewTextbox: React.FC<PreviewTextboxProps> = ({
  element,
  value = "",
  onChange,
  errors,
  disabled = false,
  readOnly = false
}) => {
  const isRequired = element.properties.validate?.required?.id;
  const isDisabled = disabled || element.properties.disable?.id || readOnly;
  const placeholder = element.properties.placeholder || "";
  const label = element.properties.label || "";
  const elementId = element.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type="text"
        id={elementId}
        name={elementId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        readOnly={readOnly}
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDisabled 
            ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${errors && errors[elementId] ? 'border-red-500 focus:ring-red-500' : ''}
        `}
      />

      {errors && errors[elementId] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[elementId]?.message || errors[elementId]}
        </p>
      )}
    </div>
  );
};
