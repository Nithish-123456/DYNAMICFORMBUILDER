import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { X } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import FormElement from './FormElement';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);

  if (!isOpen) return null;

  const layoutItems = currentForm.elements.map(element => ({
    i: element.id,
    x: element.gridProps.x,
    y: element.gridProps.y,
    w: element.gridProps.w,
    h: element.gridProps.h,
    static: true,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Form Preview</h2>
            <p className="text-sm text-gray-600 mt-1">{currentForm.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          {currentForm.elements.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg font-medium mb-2">No form elements</p>
              <p className="text-sm">Add some elements to see the preview</p>
            </div>
          ) : (
            <div className="w-full">
              <GridLayout
                className="layout"
                layout={layoutItems}
                cols={12}
                rowHeight={60}
                width={1000}
                isDraggable={false}
                isResizable={false}
                margin={[16, 16]}
                containerPadding={[0, 0]}
              >
                {currentForm.elements.map((element) => (
                  <div key={element.id} className="grid-item">
                    <FormElement element={element} isPreview={true} />
                  </div>
                ))}
              </GridLayout>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {currentForm.elements.length} element{currentForm.elements.length !== 1 ? 's' : ''}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Export Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;