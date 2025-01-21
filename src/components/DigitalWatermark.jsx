import React from 'react';
import './DigitalWatermark.css';

const DigitalWatermark = ({ 
  invoiceNumber, 
  status, 
  timestamp, 
  amount 
}) => {
  // Generate a unique pattern based on invoice details
  const generatePattern = () => {
    const hash = btoa(`${invoiceNumber}-${timestamp}-${amount}`).substring(0, 8);
    return `${hash}-${status}`;
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'var(--watermark-paid)';
      case 'pending':
        return 'var(--watermark-pending)';
      case 'overdue':
        return 'var(--watermark-overdue)';
      default:
        return 'var(--watermark-default)';
    }
  };

  return (
    <div 
      className="digital-watermark"
      style={{ '--watermark-color': getStatusColor() }}
    >
      <div className="watermark-content">
        <div className="watermark-pattern">{generatePattern()}</div>
        <div className="watermark-details">
          <span className="watermark-status">{status}</span>
          <span className="watermark-number">#{invoiceNumber}</span>
          <span className="watermark-timestamp">
            {new Date(timestamp).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DigitalWatermark; 