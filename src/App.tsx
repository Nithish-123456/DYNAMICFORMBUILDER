import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import FormBuilder from './components/FormBuilder/FormBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/workflow-creator" element={<div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-center"><h1 className="text-2xl font-bold text-gray-800 mb-4">Workflow Creator</h1><p className="text-gray-600">Coming Soon...</p></div></div>} />
        <Route path="/workflow-demo" element={<WorkflowDemo />} />
      </Routes>
    </Router>
  );
}

export default App;