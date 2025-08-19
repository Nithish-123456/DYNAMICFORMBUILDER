import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormElement } from "../../../types/form";
import { updateElement } from "../../../store/slices/formBuilderSlice";
import { RootState } from "../../../store";

interface PropertyCheckboxProps {
  element: FormElement;
  onSave?: (saved: boolean) => void;
}

export const PropertyCheckbox: React.FC<PropertyCheckboxProps> = ({ element, onSave }) => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);
  
  const [properties, setProperties] = useState(element.properties);
  const [aliasName, setAliasName] = useState(element.properties.aliasName || "");
  const [aliasNameError, setAliasNameError] = useState("");
  const [render, setRender] = useState(false);

  const refGeneralPropertyJson = useRef(element.properties);
  const notToRenderInitially = useRef(false);

  useEffect(() => {
    refGeneralPropertyJson.current = element.properties;
    setProperties(element.properties);
    setAliasName(element.properties.aliasName || "");
    setRender(!render);
  }, [element.id, element.properties]);

  const checkAliasNameUniqueness = (newAliasName: string): boolean => {
    if (!newAliasName.trim()) return true;
    
    const aliasNameValue = newAliasName.replace(/ /g, "_");
    let isAliasNameTaken = false;
    let componentName = "";

    currentForm.elements.forEach((el) => {
      if (el.properties.aliasName === aliasNameValue && el.id !== element.id) {
        isAliasNameTaken = true;
        componentName = el.properties.label;
      }
    });

    if (isAliasNameTaken) {
      setAliasNameError(`Alias Name Already Taken by ${componentName}`);
      return false;
    } else {
      setAliasNameError("");
      return true;
    }
  };

  const onValuesChanged = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const value = e.target.value;
    let tempName: string[] = [];

    switch (name) {
      case "label":
        refGeneralPropertyJson.current.label = value;
        break;
      case "AliasName":
        const newName = value;
        const aliasNameValue = newName.replace(/ /g, "_");
        
        if (checkAliasNameUniqueness(newName)) {
          tempName.push(newName);
          refGeneralPropertyJson.current.aliasName = aliasNameValue;
        }
        break;
      case "value":
        refGeneralPropertyJson.current.value = value;
        break;
      case "checked":
        refGeneralPropertyJson.current.checked = value === "yes";
        break;
      case "required":
        refGeneralPropertyJson.current.validate = {
          ...refGeneralPropertyJson.current.validate,
          required: {
            text: value,
            id: value === "no" ? false : true,
          }
        };
        break;
      case "disable":
        refGeneralPropertyJson.current.disable = {
          text: value,
          id: value === "no" ? false : true,
        };
        if (refGeneralPropertyJson.current.disable.text === "yes") {
          refGeneralPropertyJson.current.validate.required = { text: "no", id: false };
        }
        break;
      case "mainlistRequired":
        refGeneralPropertyJson.current.showInMainList = value === "no" ? 0 : 1;
        break;
      default:
        break;
    }
    setRender(!render);
    setAliasName(tempName[0] || aliasName);
  };

  useEffect(() => {
    if (notToRenderInitially.current && aliasNameError === "") {
      if (onSave) onSave(false);
      
      dispatch(updateElement({
        id: element.id,
        updates: {
          properties: refGeneralPropertyJson.current
        }
      }));
      
      console.log("Properties saved successfully");
      setAliasNameError("");
    } else if (notToRenderInitially.current && aliasNameError !== "") {
      console.error("Alias Name Must Be Unique");
    }
    notToRenderInitially.current = true;
  }, [onSave]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={refGeneralPropertyJson.current.label || ""}
          onChange={(e) => onValuesChanged(e, "label")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alias Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={element.properties.aliasName || ""}
          onChange={(e) => onValuesChanged(e, "AliasName")}
        />
        {aliasNameError && (
          <p className="text-red-500 text-sm mt-1">{aliasNameError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={refGeneralPropertyJson.current.value || "true"}
          onChange={(e) => onValuesChanged(e, "value")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          value="Checkbox"
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Default Checked</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="checked"
              value="yes"
              checked={refGeneralPropertyJson.current.checked === true}
              onChange={(e) => onValuesChanged(e, "checked")}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="checked"
              value="no"
              checked={refGeneralPropertyJson.current.checked === false}
              onChange={(e) => onValuesChanged(e, "checked")}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {!refGeneralPropertyJson.current.disable?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Is it required?</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="required"
                value="yes"
                checked={refGeneralPropertyJson.current.validate?.required?.text === "yes"}
                onChange={(e) => onValuesChanged(e, "required")}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="required"
                value="no"
                checked={refGeneralPropertyJson.current.validate?.required?.text === "no"}
                onChange={(e) => onValuesChanged(e, "required")}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Disable</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="disable"
              value="yes"
              checked={refGeneralPropertyJson.current.disable?.text === "yes"}
              onChange={(e) => onValuesChanged(e, "disable")}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="disable"
              value="no"
              checked={refGeneralPropertyJson.current.disable?.text === "no"}
              onChange={(e) => onValuesChanged(e, "disable")}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Is it required to show in Mainlist?</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="mainlistRequired"
              value="yes"
              checked={refGeneralPropertyJson.current.showInMainList === 1}
              onChange={(e) => onValuesChanged(e, "mainlistRequired")}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="mainlistRequired"
              value="no"
              checked={refGeneralPropertyJson.current.showInMainList === 0}
              onChange={(e) => onValuesChanged(e, "mainlistRequired")}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
};
