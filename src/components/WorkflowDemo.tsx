import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, Clock, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';

// Type definitions
interface Workflow {
  workflowInstanceId: number;
  workflowName: string;
}

interface ActiveWorkflowDetail {
  formName: string;
  activelevel: number;
  user: string;
}

interface WorkflowForm {
  formName: string;
  formStatus: number;
}

interface FormDetail {
  level: number;
  user: string;
  status: number;
}

interface FormDetailsMap {
  [key: number]: FormDetail[];
}

interface StatusConfig {
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const WorkflowDemo: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [activeWorkflowDetails, setActiveWorkflowDetails] = useState<ActiveWorkflowDetail[]>([]);
  const [workflowForms, setWorkflowForms] = useState<WorkflowForm[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [formDetails, setFormDetails] = useState<FormDetailsMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = 'https://localhost:7107/api';

  // Fetch workflows for dropdown
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/GetInitiatedWorkflowsList`);
      if (!response.ok) {
        throw new Error('Failed to fetch workflows');
      }
      const data: Workflow[] = await response.json();
      setWorkflows(data);
    } catch (error) {
      setError('Failed to fetch workflows');
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when workflow is selected
  const handleWorkflowSelection = async (workflowInstanceId: string): Promise<void> => {
    if (!workflowInstanceId) {
      setActiveWorkflowDetails([]);
      setWorkflowForms([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Fetch both tables data simultaneously
      const [activeDetailsResponse, formsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/GetActiveWorkflowDetails?workflowInstanceId=${workflowInstanceId}`),
        fetch(`${API_BASE_URL}/GetWorkflowForms?workflowInstanceId=${workflowInstanceId}`)
      ]);

      if (!activeDetailsResponse.ok || !formsResponse.ok) {
        throw new Error('Failed to fetch workflow details');
      }

      const activeDetailsData: ActiveWorkflowDetail[] = await activeDetailsResponse.json();
      const formsData: WorkflowForm[] = await formsResponse.json();

      setActiveWorkflowDetails(activeDetailsData);
      setWorkflowForms(formsData);
      setFormDetails({}); // Clear previous form details
      setExpandedRows(new Set()); // Clear expanded rows
    } catch (error) {
      setError('Failed to fetch workflow details');
      console.error('Error fetching workflow details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch form details for drilldown
  const fetchFormDetails = async (formInstanceId: number): Promise<void> => {
    if (formDetails[formInstanceId]) return; // Already fetched

    try {
      const response = await fetch(`${API_BASE_URL}/GetFormDetails?formInstanceId=${formInstanceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch form details');
      }
      const data: FormDetail[] = await response.json();
      setFormDetails(prev => ({
        ...prev,
        [formInstanceId]: data
      }));
    } catch (error) {
      console.error('Error fetching form details:', error);
    }
  };

  // Toggle row expansion
  const toggleRowExpansion = (formInstanceId: number): void => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(formInstanceId)) {
      newExpanded.delete(formInstanceId);
    } else {
      newExpanded.add(formInstanceId);
      fetchFormDetails(formInstanceId);
    }
    setExpandedRows(newExpanded);
  };

  // Get status configuration
  const getStatusConfig = (status: number): StatusConfig => {
    const statusConfigs: Record<number, StatusConfig> = {
      1: { 
        color: 'text-green-800', 
        bgColor: 'bg-green-100 border-green-200', 
        icon: CheckCircle, 
        label: 'Active' 
      },
      2: { 
        color: 'text-red-800', 
        bgColor: 'bg-red-100 border-red-200', 
        icon: XCircle, 
        label: 'Inactive' 
      },
      3: { 
        color: 'text-blue-800', 
        bgColor: 'bg-blue-100 border-blue-200', 
        icon: Play, 
        label: 'Complete' 
      }
    };

    return statusConfigs[status] || {
      color: 'text-gray-800',
      bgColor: 'bg-gray-100 border-gray-200',
      icon: AlertCircle,
      label: 'Unknown'
    };
  };

  // Get status badge
  const getStatusBadge = (status: number): JSX.Element => {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Get row highlighting based on status
  const getRowHighlight = (status: number): string => {
    switch (status) {
      case 1: // Active
        return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400';
      case 2: // Inactive
        return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400';
      case 3: // Complete
        return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Management Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your workflow instances and forms</p>
        </div>

        {/* Dropdown Section */}
        <div className="bg-white rounded-lg shadow-lg mb-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Workflow Instance</h2>
          <div className="relative">
            <select
              value={selectedWorkflow}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedWorkflow(e.target.value);
                handleWorkflowSelection(e.target.value);
              }}
              className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              disabled={loading}
            >
              <option value="">Choose a workflow...</option>
              {workflows.map((workflow: Workflow) => (
                <option key={workflow.workflowInstanceId} value={workflow.workflowInstanceId}>
                  {workflow.workflowName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {selectedWorkflow && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Workflow Details - Simple Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Active Workflow Details
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeWorkflowDetails.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No active workflow details found
                        </td>
                      </tr>
                    ) : (
                      activeWorkflowDetails.map((detail: ActiveWorkflowDetail, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {detail.formName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Level {detail.activelevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.user}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Workflow Forms - Drilldown Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Workflow Forms
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Form Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workflowForms.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                          No workflow forms found
                        </td>
                      </tr>
                    ) : (
                      workflowForms.map((form: WorkflowForm, index: number) => (
                        <React.Fragment key={index}>
                          <tr className={`transition-colors duration-150 ${getRowHighlight(form.formStatus)}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {form.formName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(form.formStatus)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => toggleRowExpansion(index)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                              >
                                {expandedRows.has(index) ? (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronRight className="w-4 h-4 mr-1" />
                                    View Details
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                          {expandedRows.has(index) && (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 bg-gray-50">
                                <div className="bg-white rounded-lg p-4 shadow-inner">
                                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2 text-indigo-600" />
                                    Form Details for {form.formName}
                                  </h4>
                                  {formDetails[index] ? (
                                    <div className="overflow-x-auto">
                                      <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                          <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Level
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              User ID
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                              Status
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                          {formDetails[index].map((detail: FormDetail, detailIndex: number) => (
                                            <tr key={detailIndex} className={`transition-colors duration-150 ${getRowHighlight(detail.status)}`}>
                                              <td className="px-4 py-2 text-sm text-gray-900">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                  Level {detail.level}
                                                </span>
                                              </td>
                                              <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                                                {detail.user}
                                              </td>
                                              <td className="px-4 py-2">
                                                {getStatusBadge(detail.status)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center py-4">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                      <span className="ml-2 text-sm text-gray-600">Loading details...</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDemo;