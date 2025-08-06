import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { RootState } from '../../../store';
import { addElement, updateLayout } from '../../../store/slices/formBuilderSlice';
import { createWorkflow, setWorkflowMode } from '../../../store/slices/workflowSlice';
import { Eye, Workflow } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import FormElement from './FormElement';
import PreviewModal from './PreviewModal';
import { FormElement as FormElementType } from '../../../types/form';
import { getComponentDefinition } from '../../../constants/components';
import { v4 as uuidv4 } from 'uuid';

const MainCanvas: React.FC = () => {
  const dispatch = useDispatch();
  const { currentForm } = useSelector((state: RootState) => state.formBuilder);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: 'FORM_COMPONENT',
    drop: (item: any, monitor) => {
      const componentDef = item.component;
      const clientOffset = monitor.getClientOffset();
      
      if (clientOffset) {
        const canvasRect = (monitor.getDropResult() as any)?.getBoundingClientRect?.();
        const position = canvasRect ? {
          x: Math.floor((clientOffset.x - canvasRect.left) / 100),
          y: Math.floor((clientOffset.y - canvasRect.top) / 100),
        } : { x: 0, y: 0 };

        const newElement: FormElementType = {
          id: uuidv4(),
          type: componentDef.type,
          category: componentDef.category,
          properties: { ...componentDef.defaultProps },
          style: { ...componentDef.defaultStyle },
          actions: {},
          rules: {},
          gridProps: {
            ...componentDef.defaultGridProps,
            x: position.x,
            y: position.y,
          },
        };

        dispatch(addElement({ element: newElement, position }));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleLayoutChange = (layout: any[]) => {
    dispatch(updateLayout(layout));
  };

  const handleCreateWorkflow = () => {
    if (currentForm) {
      dispatch(createWorkflow({
        formId: currentForm.id,
        formName: currentForm.name,
      }));
      dispatch(setWorkflowMode(true));
    }
  };
  const layoutItems = currentForm.elements.map(element => ({
    i: element.id,
    x: element.gridProps.x,
    y: element.gridProps.y,
    w: element.gridProps.w,
    h: element.gridProps.h,
    minW: 1,
    minH: 1,
  }));

  return (
    <>
      <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Canvas</h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          
          <button
            onClick={handleCreateWorkflow}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium transition-colors"
          >
            <Workflow className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={drop}
        className={`flex-1 p-6 overflow-auto ${
          isOver ? 'bg-blue-50' : ''
        } ${
          currentForm.elements.length === 0 ? 'flex items-center justify-center' : ''
        }`}
      >
        {currentForm.elements.length === 0 ? (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-lg font-medium mb-2">Start building your form</p>
            <p className="text-sm">Drag components from the left panel to get started</p>
          </div>
        ) : (
          <div className="w-full">
            <GridLayout
              className="layout"
              layout={layoutItems}
              onLayoutChange={handleLayoutChange}
              cols={12}
              rowHeight={60}
              width={1200}
              isDraggable={true}
              isResizable={true}
              margin={[16, 16]}
              containerPadding={[0, 0]}
            >
              {currentForm.elements.map((element) => (
                <div key={element.id} className="grid-item">
                  <FormElement element={element} isPreview={false} />
                </div>
              ))}
            </GridLayout>
          </div>
        )}
      </div>
    </div>

      <PreviewModal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
      />
    </>
  );
};

export default MainCanvas;