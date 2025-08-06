import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveTab } from '../../../store/slices/formBuilderSlice';
import ComponentsTab from './ComponentsTab';
import TreeTab from './TreeTab';
import SettingsTab from './SettingsTab';

const LeftNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.formBuilder.activeTab);

  const tabs = [
    { id: 'components', label: 'Components' },
    { id: 'tree', label: 'Tree' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Form Builder</h2>
      </div>
      
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setActiveTab(tab.id as any))}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' && <ComponentsTab />}
        {activeTab === 'tree' && <TreeTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default LeftNavbar;