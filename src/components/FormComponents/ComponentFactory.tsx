import React from "react";
import { FormElement } from "../../types/form";
import { PropertyGeneralTextbox } from "./PropertyPanel/PropertyGeneralTextbox";
import { PreviewTextbox } from "./Preview/PreviewTextbox";
import { PropertyDropdown } from "./PropertyPanel/PropertyDropdown";
import { PreviewDropdown } from "./Preview/PreviewDropdown";
import { PropertyCheckbox } from "./PropertyPanel/PropertyCheckbox";
import { PreviewCheckbox } from "./Preview/PreviewCheckbox";
import { PropertyTextarea } from "./PropertyPanel/PropertyTextarea";
import { PreviewTextarea } from "./Preview/PreviewTextarea";

// Property Panel Components
export const getPropertyPanelComponent = (elementType: string) => {
  switch (elementType) {
    case "input":
    case "textbox":
      return PropertyGeneralTextbox;
    case "dropdown":
      return PropertyDropdown;
    case "checkbox":
      return PropertyCheckbox;
    case "textarea":
      return PropertyTextarea;
    // Add more cases for other component types
    default:
      return null;
  }
};

// Preview Components
export const getPreviewComponent = (elementType: string) => {
  switch (elementType) {
    case "input":
    case "textbox":
      return PreviewTextbox;
    case "dropdown":
      return PreviewDropdown;
    case "checkbox":
      return PreviewCheckbox;
    case "textarea":
      return PreviewTextarea;
    // Add more cases for other component types
    default:
      return null;
  }
};

// Component Factory for Property Panels
export const PropertyPanelFactory: React.FC<{
  element: FormElement;
  onSave?: (saved: boolean) => void;
}> = ({ element, onSave }) => {
  const PropertyComponent = getPropertyPanelComponent(element.type);
  
  if (!PropertyComponent) {
    return (
      <div className="p-4 text-gray-500">
        No property panel available for component type: {element.type}
      </div>
    );
  }

  return <PropertyComponent element={element} onSave={onSave} />;
};

// Component Factory for Preview Components
export const PreviewFactory: React.FC<{
  element: FormElement;
  value?: any;
  onChange?: (value: any) => void;
  errors?: Record<string, any>;
  disabled?: boolean;
  readOnly?: boolean;
}> = ({ element, value, onChange, errors, disabled, readOnly }) => {
  const PreviewComponent = getPreviewComponent(element.type);
  
  if (!PreviewComponent) {
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">No preview available for component type: {element.type}</p>
      </div>
    );
  }

  return (
    <PreviewComponent
      element={element}
      value={value}
      onChange={onChange}
      errors={errors}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};
