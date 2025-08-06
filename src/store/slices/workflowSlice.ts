import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowNode, WorkflowEdge, Workflow, WorkflowState } from '../../types/workflow';
import { v4 as uuidv4 } from 'uuid';

const initialState: WorkflowState = {
  currentWorkflow: null,
  workflows: [],
  selectedNode: null,
  isWorkflowMode: false,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    createWorkflow: (state, action: PayloadAction<{ formId: string; formName: string }>) => {
      const { formId, formName } = action.payload;
      const newWorkflow: Workflow = {
        id: uuidv4(),
        name: `${formName} Workflow`,
        description: `Workflow for ${formName}`,
        formId,
        nodes: [
          {
            id: 'start-1',
            type: 'start',
            position: { x: 250, y: 50 },
            data: {
              label: 'Start',
              level: 'Level 1',
            },
          },
          {
            id: 'end-1',
            type: 'end',
            position: { x: 250, y: 400 },
            data: {
              label: 'End',
              level: 'Level 4',
            },
          },
        ],
        edges: [],
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      state.currentWorkflow = newWorkflow;
      state.workflows.push(newWorkflow);
      state.isWorkflowMode = true;
    },
    
    addWorkflowNode: (state, action: PayloadAction<WorkflowNode>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.nodes.push(action.payload);
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    updateWorkflowNode: (state, action: PayloadAction<{ id: string; updates: Partial<WorkflowNode> }>) => {
      if (state.currentWorkflow) {
        const nodeIndex = state.currentWorkflow.nodes.findIndex(node => node.id === action.payload.id);
        if (nodeIndex !== -1) {
          state.currentWorkflow.nodes[nodeIndex] = {
            ...state.currentWorkflow.nodes[nodeIndex],
            ...action.payload.updates,
          };
          state.currentWorkflow.updatedAt = new Date().toISOString();
        }
      }
    },
    
    removeWorkflowNode: (state, action: PayloadAction<string>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.nodes = state.currentWorkflow.nodes.filter(node => node.id !== action.payload);
        state.currentWorkflow.edges = state.currentWorkflow.edges.filter(
          edge => edge.source !== action.payload && edge.target !== action.payload
        );
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    addWorkflowEdge: (state, action: PayloadAction<WorkflowEdge>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.edges.push(action.payload);
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    removeWorkflowEdge: (state, action: PayloadAction<string>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.edges = state.currentWorkflow.edges.filter(edge => edge.id !== action.payload);
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    updateWorkflowNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.nodes = action.payload;
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    updateWorkflowEdges: (state, action: PayloadAction<WorkflowEdge[]>) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.edges = action.payload;
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    selectWorkflowNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = action.payload;
    },
    
    setWorkflowMode: (state, action: PayloadAction<boolean>) => {
      state.isWorkflowMode = action.payload;
    },
    
    updateWorkflowInfo: (state, action: PayloadAction<{ name?: string; description?: string }>) => {
      if (state.currentWorkflow) {
        if (action.payload.name !== undefined) {
          state.currentWorkflow.name = action.payload.name;
        }
        if (action.payload.description !== undefined) {
          state.currentWorkflow.description = action.payload.description;
        }
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
    
    toggleWorkflowActive: (state) => {
      if (state.currentWorkflow) {
        state.currentWorkflow.isActive = !state.currentWorkflow.isActive;
        state.currentWorkflow.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  createWorkflow,
  addWorkflowNode,
  updateWorkflowNode,
  removeWorkflowNode,
  addWorkflowEdge,
  removeWorkflowEdge,
  updateWorkflowNodes,
  updateWorkflowEdges,
  selectWorkflowNode,
  setWorkflowMode,
  updateWorkflowInfo,
  toggleWorkflowActive,
} = workflowSlice.actions;

export default workflowSlice.reducer;