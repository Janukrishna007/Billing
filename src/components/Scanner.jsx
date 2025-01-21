import { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaQrcode, FaBarcode } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';
import './Scanner.css';

const Scanner = ({ onScanComplete, onClose }) => {
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const checkCameraPermission = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      if (cameras.length === 0) {
        throw new Error('No cameras found');
      }
      setHasPermission(true);
      return true;
    } catch (err) {
      setHasPermission(false);
      setError("Camera access denied. Please enable camera permissions and try again.");
      console.error("Camera permission error:", err);
      return false;
    }
  };

  const stopScanner = async () => {
    try {
      if (scanner) {
        await scanner.stop();
        setScanner(null);
      }
      setIsScanning(false);
      if (onClose) onClose();
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const hasAccess = await checkCameraPermission();
        if (!hasAccess) return;

        const html5QrcodeScanner = new Html5Qrcode("qr-reader");
        setScanner(html5QrcodeScanner);

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrcodeScanner.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            console.log("Scanned code:", decodedText);
            const cleanedText = decodedText.trim().replace(/[^0-9a-zA-Z]/g, '');
            onScanComplete({
              itemNumber: cleanedText
            });
          },
          (errorMessage) => {
            if (!errorMessage.includes("No QR code found")) {
              console.error("Scanning error:", errorMessage);
            }
          }
        );

        setIsScanning(true);
      } catch (err) {
        setError("Failed to initialize scanner. Please try again.");
        console.error("Scanner initialization error:", err);
      }
    };

    initializeScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const renderContent = () => {
    if (hasPermission === false) {
      return (
        <div className="permission-denied">
          <FaCamera className="permission-icon" />
          <h3>Camera Access Required</h3>
          <p>Please enable camera access in your browser settings to use the scanner.</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="scanner-header">
          <div className="camera-icon-wrapper">
            <FaCamera className="camera-icon" />
          </div>
          <h2>Scan QR Code or Barcode</h2>
          <div className="scanner-icons">
            <FaQrcode className="format-icon" />
            <FaBarcode className="format-icon" />
          </div>
          <p className="scanner-subtitle">
            Position the code within the frame
          </p>
        </div>

        <div className="scanner-window">
          <div id="qr-reader"></div>
          <div className="scan-region">
            <div className="scan-frame">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              <div className="scan-line"></div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FaTimes className="error-icon" />
            {error}
          </div>
        )}

        {isScanning && !error && (
          <div className="scanning-status">
            <div className="pulse-ring"></div>
            <span>Scanning...</span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-container">
        <button className="close-scanner" onClick={stopScanner}>
          <FaTimes />
        </button>
        <div className="scanner-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Scanner; 