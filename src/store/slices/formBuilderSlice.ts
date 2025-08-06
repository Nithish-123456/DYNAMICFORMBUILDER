import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormConfig, FormElement } from '../../types/form';
import { v4 as uuidv4 } from 'uuid';

interface FormBuilderState {
  currentForm: FormConfig;
  selectedElement: string | null;
  activeTab: 'components' | 'tree' | 'settings';
  rightPanelTab: 'main' | 'style' | 'actions' | 'rules';
  isPreviewMode: boolean;
  draggedElement: any;
}

const initialState: FormBuilderState = {
  currentForm: {
    id: uuidv4(),
    name: 'New Form',
    description: '',
    elements: [],
    settings: {
      theme: 'light',
      submitUrl: '',
      method: 'POST',
      showProgressBar: false,
      enableValidation: true,
      allowSave: true,
      autoSave: false,
      confirmBeforeSubmit: false,
      redirectAfterSubmit: '',
      customCSS: '',
      notifications: {
        success: 'Form submitted successfully!',
        error: 'Error submitting form. Please try again.',
      },
    },
    layout: [],
  },
  selectedElement: null,
  activeTab: 'components',
  rightPanelTab: 'main',
  isPreviewMode: false,
  draggedElement: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<{ element: FormElement; position?: { x: number; y: number } }>) => {
      const { element, position } = action.payload;
      const newElement = {
        ...element,
        id: uuidv4(),
        gridProps: {
          ...element.gridProps,
          x: position?.x || 0,
          y: position?.y || 0,
        },
      };
      state.currentForm.elements.push(newElement);
      state.selectedElement = newElement.id;
    },
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<FormElement> }>) => {
      const { id, updates } = action.payload;
      const elementIndex = state.currentForm.elements.findIndex(el => el.id === id);
      if (elementIndex !== -1) {
        state.currentForm.elements[elementIndex] = {
          ...state.currentForm.elements[elementIndex],
          ...updates,
        };
      }
    },
    removeElement: (state, action: PayloadAction<string>) => {
      state.currentForm.elements = state.currentForm.elements.filter(el => el.id !== action.payload);
      if (state.selectedElement === action.payload) {
        state.selectedElement = null;
      }
    },
    duplicateElement: (state, action: PayloadAction<string>) => {
      const element = state.currentForm.elements.find(el => el.id === action.payload);
      if (element) {
        const newElement = {
          ...element,
          id: uuidv4(),
          gridProps: {
            ...element.gridProps,
            x: element.gridProps.x + 1,
            y: element.gridProps.y + 1,
          },
        };
        state.currentForm.elements.push(newElement);
        state.selectedElement = newElement.id;
      }
    },
    selectElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElement = action.payload;
    },
    setActiveTab: (state, action: PayloadAction<'components' | 'tree' | 'settings'>) => {
      state.activeTab = action.payload;
    },
    setRightPanelTab: (state, action: PayloadAction<'main' | 'style' | 'actions' | 'rules'>) => {
      state.rightPanelTab = action.payload;
    },
    togglePreviewMode: (state) => {
      state.isPreviewMode = !state.isPreviewMode;
    },
    updateFormSettings: (state, action: PayloadAction<Partial<FormConfig['settings']>>) => {
      state.currentForm.settings = {
        ...state.currentForm.settings,
        ...action.payload,
      };
    },
    updateFormInfo: (state, action: PayloadAction<{ name?: string; description?: string }>) => {
      if (action.payload.name !== undefined) {
        state.currentForm.name = action.payload.name;
      }
      if (action.payload.description !== undefined) {
        state.currentForm.description = action.payload.description;
      }
    },
    updateLayout: (state, action: PayloadAction<any[]>) => {
      state.currentForm.layout = action.payload;
      // Update grid props for elements
      action.payload.forEach(layoutItem => {
        const element = state.currentForm.elements.find(el => el.id === layoutItem.i);
        if (element) {
          element.gridProps = {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          };
        }
      });
    },
  },
});

export const {
  addElement,
  updateElement,
  removeElement,
  duplicateElement,
  selectElement,
  setActiveTab,
  setRightPanelTab,
  togglePreviewMode,
  updateFormSettings,
  updateFormInfo,
  updateLayout,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;