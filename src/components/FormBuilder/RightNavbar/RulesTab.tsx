import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateElement } from '../../../store/slices/formBuilderSlice';
import { Plus, Trash2 } from 'lucide-react';

const RulesTab: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedElement, currentForm } = useSelector((state: RootState) => state.formBuilder);
  
  const element = selectedElement ? currentForm.elements.find(el => el.id === selectedElement) : null;
  const availableFields = currentForm.elements.filter(el => el.id !== selectedElement);

  const handleAddCondition = () => {
    if (!element) return;
    
    const newCondition = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals' as const,
      value: '',
      action: 'show' as const
    };

    dispatch(updateElement({
      id: element.id,
      updates: {
        conditions: [...(element.conditions || []), newCondition]
      }
    }));
  };

  const handleUpdateCondition = (conditionId: string, updates: any) => {
    if (!element) return;
    
    const updatedConditions = element.conditions?.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    ) || [];

    dispatch(updateElement({
      id: element.id,
      updates: { conditions: updatedConditions }
    }));
  };

  const handleRemoveCondition = (conditionId: string) => {
    if (!element) return;
    
    const updatedConditions = element.conditions?.filter(
      condition => condition.id !== conditionId
    ) || [];

    dispatch(updateElement({
      id: element.id,
      updates: { conditions: updatedConditions }
    }));
  };

  const handleAddValidation = () => {
    if (!element) return;
    
    const newValidation = {
      id: Date.now().toString(),
      type: 'required' as const,
      message: 'This field is required',
      value: ''
    };

    dispatch(updateElement({
      id: element.id,
      updates: {
        validations: [...(element.validations || []), newValidation]
      }
    }));
  };

  const handleUpdateValidation = (validationId: string, updates: any) => {
    if (!element) return;
    
    const updatedValidations = element.validations?.map(validation =>
      validation.id === validationId ? { ...validation, ...updates } : validation
    ) || [];

    dispatch(updateElement({
      id: element.id,
      updates: { validations: updatedValidations }
    }));
  };

  const handleRemoveValidation = (validationId: string) => {
    if (!element) return;
    
    const updatedValidations = element.validations?.filter(
      validation => validation.id !== validationId
    ) || [];

    dispatch(updateElement({
      id: element.id,
      updates: { validations: updatedValidations }
    }));
  };

  if (!element) {
    return (
      <div className="p-4 text-center text-gray-500">
        Select an element to configure rules and validations
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Conditional Logic */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Conditional Logic</h3>
          <button
            onClick={handleAddCondition}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Plus size={12} />
            Add Condition
          </button>
        </div>
        
        <div className="space-y-3">
          {element.conditions?.map((condition) => (
            <div key={condition.id} className="p-3 border border-gray-200 rounded-md">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={condition.action}
                  onChange={(e) => handleUpdateCondition(condition.id, { action: e.target.value })}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="show">Show</option>
                  <option value="hide">Hide</option>
                  <option value="enable">Enable</option>
                  <option value="disable">Disable</option>
                </select>
                
                <button
                  onClick={() => handleRemoveCondition(condition.id)}
                  className="flex items-center justify-center px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={condition.field}
                  onChange={(e) => handleUpdateCondition(condition.id, { field: e.target.value })}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="">Select Field</option>
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.properties.label || field.type}
                    </option>
                  ))}
                </select>
                
                <select
                  value={condition.operator}
                  onChange={(e) => handleUpdateCondition(condition.id, { operator: e.target.value })}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="equals">Equals</option>
                  <option value="not_equals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="not_contains">Not Contains</option>
                  <option value="greater_than">Greater Than</option>
                  <option value="less_than">Less Than</option>
                  <option value="is_empty">Is Empty</option>
                  <option value="is_not_empty">Is Not Empty</option>
                </select>
                
                {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => handleUpdateCondition(condition.id, { value: e.target.value })}
                    placeholder="Value"
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                )}
              </div>
            </div>
          ))}
          
          {(!element.conditions || element.conditions.length === 0) && (
            <div className="text-xs text-gray-500 text-center py-4">
              No conditions set. Click "Add Condition" to create conditional logic.
            </div>
          )}
        </div>
      </div>

      {/* Validation Rules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Validation Rules</h3>
          <button
            onClick={handleAddValidation}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Plus size={12} />
            Add Rule
          </button>
        </div>
        
        <div className="space-y-3">
          {element.validations?.map((validation) => (
            <div key={validation.id} className="p-3 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <select
                  value={validation.type}
                  onChange={(e) => handleUpdateValidation(validation.id, { type: e.target.value })}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                >
                  <option value="required">Required</option>
                  <option value="min_length">Min Length</option>
                  <option value="max_length">Max Length</option>
                  <option value="pattern">Pattern (Regex)</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="min_value">Min Value</option>
                  <option value="max_value">Max Value</option>
                </select>
                
                <button
                  onClick={() => handleRemoveValidation(validation.id)}
                  className="flex items-center justify-center px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              
              {!['required', 'email', 'number'].includes(validation.type) && (
                <input
                  type="text"
                  value={validation.value}
                  onChange={(e) => handleUpdateValidation(validation.id, { value: e.target.value })}
                  placeholder={
                    validation.type === 'pattern' ? 'Regular expression' :
                    validation.type.includes('length') ? 'Length' : 'Value'
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded mb-2"
                />
              )}
              
              <input
                type="text"
                value={validation.message}
                onChange={(e) => handleUpdateValidation(validation.id, { message: e.target.value })}
                placeholder="Error message"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          ))}
          
          {(!element.validations || element.validations.length === 0) && (
            <div className="text-xs text-gray-500 text-center py-4">
              No validation rules set. Click "Add Rule" to create validation rules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RulesTab;