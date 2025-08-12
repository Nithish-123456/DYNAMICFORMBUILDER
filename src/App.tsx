import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import FormBuilder from './components/FormBuilder/FormBuilder';
import WorkflowCreator from './components/workflowCreator/WorkflowCreator';
import WorkflowDemo from './components/WorkflowDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/workflow-creator" element={<WorkflowCreator />} />
        <Route path="/workflow-demo" element={<WorkflowDemo />} />
      </Routes>
    </Router>
  );
}

export default App;