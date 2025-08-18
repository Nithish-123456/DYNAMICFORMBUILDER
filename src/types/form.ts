export interface FormElement {
  id: string;
  type: string;
  category: 'fields' | 'static' | 'structure' | 'templates';
  properties: Record<string, any>;
  style: Record<string, any>;
  actions: Record<string, any>;
  rules: Record<string, any>;
  conditions?: {
    show?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }[];
    hide?: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }[];
  };
  children?: FormElement[];
  gridProps: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    isResizable?: boolean;
    isDraggable?: boolean;
    static?: boolean;
  };
}

export interface FormConfig {
  id: string;
  name: string;
  description?: string;
  elements: FormElement[];
  settings: {
    theme?: 'light' | 'dark';
    submitUrl?: string;
    method?: 'POST' | 'GET' | 'PUT';
    showProgressBar?: boolean;
    enableValidation?: boolean;
    allowSave?: boolean;
    autoSave?: boolean;
    confirmBeforeSubmit?: boolean;
    redirectAfterSubmit?: string;
    customCSS?: string;
    notifications?: {
      success?: string;
      error?: string;
    };
  };
  layout: any[];
}

export interface ComponentDefinition {
  type: string;
  category: 'fields' | 'static' | 'structure' | 'templates';
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  defaultStyle: Record<string, any>;
  defaultGridProps: {
    w: number;
    h: number;
  };
  advancedProps?: string[];
  availableActions?: string[];
}

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface ApiDataSource {
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  labelField: string;
  valueField: string;
}