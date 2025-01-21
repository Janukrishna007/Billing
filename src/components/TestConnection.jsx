import { useState, useEffect } from 'react';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/');
        const data = await response.json();
        setStatus(`Connected! Server says: ${data.message}`);
      } catch (error) {
        setStatus(`Connection failed: ${error.message}`);
        console.error('Connection test failed:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>API Connection Test</h3>
      <p>{status}</p>
    </div>
  );
};

export default TestConnection; 