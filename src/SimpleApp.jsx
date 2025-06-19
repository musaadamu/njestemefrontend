import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TestComponent from './components/TestComponent.jsx';

const SimpleApp = () => {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <h1>Simple App</h1>
        <Routes>
          <Route path="/" element={<TestComponent />} />
          <Route path="/test" element={<TestComponent />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </Router>
  );
};

export default SimpleApp;
