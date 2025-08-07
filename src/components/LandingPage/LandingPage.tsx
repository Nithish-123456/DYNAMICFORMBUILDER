import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, Workflow, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

const tiles = [
  {
    id: 'form-builder',
    title: 'Dynamic Form Creator',
    description: 'Create dynamic forms with drag-and-drop interface, advanced components, and real-time preview',
    icon: FormInput,
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    path: '/form-builder',
    features: ['Drag & Drop Interface', 'Advanced Components', 'Real-time Preview', 'Conditional Logic']
  },
  {
    id: 'workflow-creator',
    title: 'Dynamic Workflow Creator',
    description: 'Design complex workflows with conditional logic, parallel processing, and form integration',
    icon: Workflow,
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    path: '/workflow-creator',
    features: ['Visual Workflow Design', 'Conditional Branching', 'Parallel Processing', 'Form Integration']
  },
  {
    id: 'workflow-demo',
    title: 'Workflow Execution Demo',
    description: 'Simulate real-time execution of workflows with decision branches.',
    icon: Workflow,
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    path: '/workflow-demo',
    features: ['Live Execution View', 'Branch Evaluation', 'Error Handling']
  }
];


  const handleTileClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dynamic Application Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create powerful forms and workflows with our intuitive drag-and-drop interface. 
              Build, customize, and deploy dynamic applications without coding.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {tiles.map((tile) => {
            const IconComponent = tile.icon;
            return (
              <div
                key={tile.id}
                onClick={() => handleTileClick(tile.path)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`p-4 rounded-xl ${tile.color} text-white`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{tile.title}</h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tile.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {tile.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 ${tile.color} ${tile.hoverColor} text-white rounded-lg font-medium transition-colors`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        {/* <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FormInput className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Easy to Use</h4>
                <p className="text-sm text-gray-600">Intuitive drag-and-drop interface requires no coding knowledge</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Workflow className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Powerful Features</h4>
                <p className="text-sm text-gray-600">Advanced components and workflow capabilities for complex applications</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fast Deployment</h4>
                <p className="text-sm text-gray-600">Build and deploy applications quickly with real-time preview</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LandingPage;