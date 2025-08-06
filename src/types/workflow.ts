export interface WorkflowNode {
  id: string;
  type: 'start' | 'condition' | 'action' | 'parallel' | 'merge' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    level: string;
    formElementId?: string;
    conditionField?: string;
    conditionOperator?: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    conditionValue?: any;
    actionType?: 'email' | 'webhook' | 'approval' | 'assignment';
    actionConfig?: Record<string, any>;
    parallelBranches?: string[];
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'conditional';
  data?: {
    condition?: string;
    label?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  formId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowState {
  currentWorkflow: Workflow | null;
  workflows: Workflow[];
  selectedNode: string | null;
  isWorkflowMode: boolean;
}

