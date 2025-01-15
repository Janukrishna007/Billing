import React, { useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import Tesseract from 'tesseract.js';

const ARScanner = ({ onScanComplete }) => {
  const [camera, setCamera] = useState(null);
  const [scanning, setScanning] = useState(false);

  const handleCapture = async () => {
    if (camera) {
      setScanning(true);
      const photo = camera.takePhoto();
      
      try {
        // Use Tesseract.js for OCR
        const { data: { text } } = await Tesseract.recognize(
          photo,
          'eng',
          { logger: m => console.log(m) }
        );

        // Parse the scanned text
        const items = parseReceiptText(text);
        onScanComplete(items);
      } catch (error) {
        console.error('Scanning error:', error);
        alert('Error scanning receipt. Please try again.');
      } finally {
        setScanning(false);
      }
    }
  };

  const parseReceiptText = (text) => {
    // Basic parsing logic - can be enhanced based on receipt format
    const lines = text.split('\n');
    const items = [];
    
    lines.forEach(line => {
      const match = line.match(/([A-Za-z\s]+)\s+(\d+)\s+(\d+\.?\d*)/);
      if (match) {
        items.push({
          itemName: match[1].trim(),
          quantity: parseInt(match[2]),
          price: parseFloat(match[3]),
          category: 'Other', // Default category
          date: new Date().toISOString().split('T')[0]
        });
      }
    });

    return items;
  };

  return (
    <div className="ar-scanner">
      <Camera ref={setCamera} />
      <div className="scanner-controls">
        <button 
          onClick={handleCapture}
          disabled={scanning}
          className="scan-button"
        >
          {scanning ? 'Scanning...' : 'Scan Receipt'}
        </button>
      </div>
    </div>
  );
};

export default ARScanner; 