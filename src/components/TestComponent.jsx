import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      backgroundColor: 'lightblue', 
      border: '2px solid blue',
      borderRadius: '8px'
    }}>
      <h1>Test Component</h1>
      <p>If you can see this, the rendering pipeline is working correctly!</p>
    </div>
  );
};

export default TestComponent;
