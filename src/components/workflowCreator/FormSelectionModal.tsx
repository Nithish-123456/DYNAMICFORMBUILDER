import React, { useState } from 'react';
import { X, Search, FileText, Calendar, Plus, Check } from 'lucide-react';

interface WorkflowForm {
  id: string;
  name: string;
  description?: string;
  elements: any[];
  createdAt: string;
}

interface FormSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  forms: WorkflowForm[];
  onSelectForm: (form: WorkflowForm) => void;
  selectedForms: WorkflowForm[];
}

const FormSelectionModal: React.FC<FormSelectionModalProps> = ({
  isOpen,
  onClose,
  forms,
  onSelectForm,
  selectedForms,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormIds, setSelectedFormIds] = useState<Set<string>>(
    new Set(selectedForms.map(f => f.id))
  );

  if (!isOpen) return null;

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormToggle = (form: WorkflowForm) => {
    const newSelected = new Set(selectedFormIds);
    if (newSelected.has(form.id)) {
      newSelected.delete(form.id);
    } else {
      newSelected.add(form.id);
      onSelectForm(form);
    }
    setSelectedFormIds(newSelected);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Add Forms to Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select forms to include in your workflow process
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Forms List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No forms found</h3>
              <p className="text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'No forms available to add'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredForms.map((form) => {
                const isSelected = selectedFormIds.has(form.id);
                return (
                  <div
                    key={form.id}
                    onClick={() => handleFormToggle(form)}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Selection Indicator */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Form Icon */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{form.name}</h3>
                      </div>
                    </div>

                    {/* Form Description */}
                    {form.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {form.description}
                      </p>
                    )}

                    {/* Form Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>{form.elements.length} field{form.elements.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(form.createdAt)}</span>
                      </div>
                    </div>

                    {/* Form Elements Preview */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-1">
                        {form.elements.slice(0, 3).map((element, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                          >
                            {element.label || element.type}
                          </span>
                        ))}
                        {form.elements.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                            +{form.elements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedFormIds.size} form{selectedFormIds.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSelectionModal;