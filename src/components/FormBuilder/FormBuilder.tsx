import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import { RootState } from '../../store';
import LeftNavbar from './LeftNavbar/LeftNavbar';
import MainCanvas from './MainCanvas/MainCanvas';
import RightNavbar from './RightNavbar/RightNavbar';
import WorkflowDesigner from '../WorkflowDesigner/WorkflowDesigner';

const FormBuilderContent: React.FC = () => {
  const { isWorkflowMode } = useSelector((state: RootState) => state.workflow);

  if (isWorkflowMode) {
    return <WorkflowDesigner />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <LeftNavbar />
      <MainCanvas />
      <RightNavbar />
    </div>
  );
};

const FormBuilder: React.FC = () => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <FormBuilderContent />
      </DndProvider>
    </Provider>
  );
};

export default FormBuilder;