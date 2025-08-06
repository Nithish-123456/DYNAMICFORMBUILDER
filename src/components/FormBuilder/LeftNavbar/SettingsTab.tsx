import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { updateFormSettings, updateFormInfo } from '../../../store/slices/formBuilderSlice';

const SettingsTab: React.FC = () => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);

  const handleFormInfoChange = (field: 'name' | 'description', value: string) => {
    dispatch(updateFormInfo({ [field]: value }));
  };

  const handleSettingChange = (setting: string, value: any) => {
    dispatch(updateFormSettings({ [setting]: value }));
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Form Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Form Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={currentForm.name}
            onChange={(e) => handleFormInfoChange('name', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Form description..."
            value={currentForm.description || ''}
            onChange={(e) => handleFormInfoChange('description', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            value={currentForm.settings.theme || 'light'}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Submit URL
          </label>
          <input
            type="url"
            placeholder="https://api.example.com/submit"
            value={currentForm.settings.submitUrl || ''}
            onChange={(e) => handleSettingChange('submitUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            HTTP Method
          </label>
          <select
            value={currentForm.settings.method || 'POST'}
            onChange={(e) => handleSettingChange('method', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="GET">GET</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Redirect After Submit
          </label>
          <input
            type="url"
            placeholder="https://example.com/thank-you"
            value={currentForm.settings.redirectAfterSubmit || ''}
            onChange={(e) => handleSettingChange('redirectAfterSubmit', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={currentForm.settings.enableValidation || false}
              onChange={(e) => handleSettingChange('enableValidation', e.target.checked)}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Enable validation</span>
          </label>
        </div>
        
        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={currentForm.settings.showProgressBar || false}
              onChange={(e) => handleSettingChange('showProgressBar', e.target.checked)}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Show progress bar</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={currentForm.settings.allowSave || false}
              onChange={(e) => handleSettingChange('allowSave', e.target.checked)}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Allow save as draft</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={currentForm.settings.autoSave || false}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Auto-save progress</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={currentForm.settings.confirmBeforeSubmit || false}
              onChange={(e) => handleSettingChange('confirmBeforeSubmit', e.target.checked)}
              className="mr-2" 
            />
            <span className="text-sm text-gray-700">Confirm before submit</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Notifications</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Success Message
              </label>
              <input
                type="text"
                value={currentForm.settings.notifications?.success || ''}
                onChange={(e) => handleSettingChange('notifications', {
                  ...currentForm.settings.notifications,
                  success: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Error Message
              </label>
              <input
                type="text"
                value={currentForm.settings.notifications?.error || ''}
                onChange={(e) => handleSettingChange('notifications', {
                  ...currentForm.settings.notifications,
                  error: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Custom CSS</h4>
          <textarea
            value={currentForm.settings.customCSS || ''}
            onChange={(e) => handleSettingChange('customCSS', e.target.value)}
            placeholder="/* Custom CSS styles */&#10;.form-container {&#10;  /* Your styles here */&#10;}"
            className="w-full h-32 px-3 py-2 text-sm font-mono border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;