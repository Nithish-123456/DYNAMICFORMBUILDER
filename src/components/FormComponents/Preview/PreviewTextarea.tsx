import React from "react";
import { FormElement } from "../../../types/form";

interface PreviewTextareaProps {
  element: FormElement;
  value?: string;
  onChange?: (value: string) => void;
  errors?: Record<string, any>;
  disabled?: boolean;
  readOnly?: boolean;
}

export const PreviewTextarea: React.FC<PreviewTextareaProps> = ({
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
  const rows = element.properties.rows || 4;
  const resize = element.properties.resize || "vertical";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const getResizeClass = () => {
    switch (resize) {
      case "both":
        return "resize";
      case "vertical":
        return "resize-y";
      case "horizontal":
        return "resize-x";
      case "none":
        return "resize-none";
      default:
        return "resize-y";
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <textarea
        id={elementId}
        name={elementId}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={isDisabled}
        readOnly={readOnly}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
          ${getResizeClass()}
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
