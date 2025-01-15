import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { FaCamera, FaTimes } from 'react-icons/fa';
import './Scanner.css';

const Scanner = ({ onClose, onScan }) => {
  const [error, setError] = useState(null);

  const handleScan = (err, result) => {
    if (result) {
      // Successfully scanned something
      onScan(result.text);
      onClose();
    }
    if (err) {
      console.error("Scan error:", err);
      setError("Failed to scan. Please try again.");
    }
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-container">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="scanner-content">
          <h2>Scan Barcode/QR Code</h2>
          
          <div className="scanner-window">
            <BarcodeScannerComponent
              width={300}
              height={300}
              onUpdate={handleScan}
            />
            <div className="scanning-frame"></div>
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="scanner-instructions">
            <p>Position the barcode or QR code within the frame</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner; 