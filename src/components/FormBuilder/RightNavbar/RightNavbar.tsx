import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { setRightPanelTab } from '../../../store/slices/formBuilderSlice';
import MainTab from './MainTab';
import StyleTab from './StyleTab';
import ActionsTab from './ActionsTab';
import RulesTab from './RulesTab';

const RightNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const { rightPanelTab, selectedElement } = useSelector((state: RootState) => state.formBuilder);

  const tabs = [
    { id: 'main', label: 'Main' },
    { id: 'style', label: 'Style' },
    { id: 'actions', label: 'Actions' },
    { id: 'rules', label: 'Rules' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Properties</h2>
        {selectedElement && (
          <p className="text-sm text-gray-500 mt-1">
            Selected element properties
          </p>
        )}
      </div>
      
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch(setRightPanelTab(tab.id as any))}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              rightPanelTab === tab.id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedElement ? (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        ) : (
          <>
            {rightPanelTab === 'main' && <MainTab />}
            {rightPanelTab === 'style' && <StyleTab />}
            {rightPanelTab === 'actions' && <ActionsTab />}
            {rightPanelTab === 'rules' && <RulesTab />}
          </>
        )}
      </div>
    </div>
  );
};

export default RightNavbar;