import React, { useState } from 'react';

/**
 * Super Simple XP Test Page - No dependencies
 */
const SimpleXPTest = () => {
  const [message, setMessage] = useState('Click the button to test');
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    setMessage('Testing...');
    
    try {
      // Test backend connection
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      
      if (data.status === 'OK') {
        setMessage(`✅ Success! Backend is running.\n\nMongoDB: ${data.services.mongodb}\nServer: ${data.services.server}`);
      } else {
        setMessage('⚠️ Backend responded but status is not OK');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}\n\nMake sure backend is running on port 5000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ marginBottom: '10px' }}>
          🧪 Simple XP System Test
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Basic connectivity test for the XP system
        </p>

        <button
          onClick={runTest}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>

        <div style={{
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px',
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {message}
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px'
        }}>
          <strong>⚠️ Prerequisites:</strong>
          <ul style={{ marginTop: '10px', marginBottom: 0 }}>
            <li>Backend server running on port 5000</li>
            <li>MongoDB connected</li>
            <li>No browser console errors</li>
          </ul>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #17a2b8',
          borderRadius: '4px'
        }}>
          <strong>📝 Next Steps:</strong>
          <ol style={{ marginTop: '10px', marginBottom: 0 }}>
            <li>Click "Test Backend Connection"</li>
            <li>Check if backend responds</li>
            <li>Verify MongoDB status</li>
            <li>Open browser console (F12) for details</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SimpleXPTest;
