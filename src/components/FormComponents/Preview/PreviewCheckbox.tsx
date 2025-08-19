import React from "react";
import { FormElement } from "../../../types/form";

interface PreviewCheckboxProps {
  element: FormElement;
  value?: boolean;
  onChange?: (value: boolean) => void;
  errors?: Record<string, any>;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PreviewCheckbox: React.FC<PreviewCheckboxProps> = ({
  element,
  value = false,
  onChange,
  errors,
  disabled = false,
  readOnly = false
}) => {
  const isRequired = element.properties.validate?.required?.id;
  const isDisabled = disabled || element.properties.disable?.id || readOnly;
  const label = element.properties.label || "";
  const elementId = element.id;
  const defaultValue = element.properties.checked || false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={elementId}
          name={elementId}
          checked={value}
          onChange={handleChange}
          disabled={isDisabled}
          readOnly={readOnly}
          className={`
            mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
            ${isDisabled 
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
              : 'hover:border-gray-400'
            }
            ${errors && errors[elementId] ? 'border-red-500 focus:ring-red-500' : ''}
          `}
        />
        <div className="flex-1">
          <label 
            htmlFor={elementId}
            className={`
              block text-sm font-medium text-gray-700
              ${isDisabled ? 'text-gray-500' : ''}
            `}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          {errors && errors[elementId] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[elementId]?.message || errors[elementId]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
