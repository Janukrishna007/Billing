import { useState, useEffect } from 'react';
import { FaTimes, FaCamera, FaQrcode, FaBarcode } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';
import './Scanner.css';

const Scanner = ({ onClose, onScan, predefinedItems }) => {
  const [error, setError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
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
      if (scanner && scanner.isScanning) {
        await scanner.stop();
        const videoElement = document.querySelector('#qr-reader video');
        if (videoElement && videoElement.srcObject) {
          const tracks = videoElement.srcObject.getTracks();
          tracks.forEach(track => track.stop());
          videoElement.srcObject = null;
        }
      }
      setIsScanning(false);
      onClose();
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        stopScanner();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeScanner = async () => {
      const hasAccess = await checkCameraPermission();
      if (!hasAccess) return;

      try {
        const newScanner = new Html5Qrcode("qr-reader");
        if (mounted) {
          setScanner(newScanner);
          setIsScanning(true);

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5Qrcode.FORMATS.QR_CODE,
              Html5Qrcode.FORMATS.EAN_13,
              Html5Qrcode.FORMATS.CODE_128,
              Html5Qrcode.FORMATS.CODE_39,
              Html5Qrcode.FORMATS.UPC_A,
              Html5Qrcode.FORMATS.UPC_E,
              Html5Qrcode.FORMATS.EAN_8,
            ]
          };

          await newScanner.start(
            { facingMode: "environment" },
            config,
            async (decodedText) => {
              try {
                const scannedItemId = decodedText.trim();
                const foundItem = predefinedItems.find(item => item.id === scannedItemId);
                
                if (foundItem) {
                  const newItem = {
                    itemNumber: foundItem.id,
                    quantity: 1,
                    price: foundItem.price,
                    category: foundItem.category,
                    gstRate: foundItem.gstRate,
                    date: new Date().toISOString().split('T')[0],
                    total: foundItem.price
                  };
                  
                  onScan(newItem);
                  await stopScanner();
                } else {
                  setError("Item not found. Please scan a valid product code.");
                  setTimeout(() => setError(null), 3000);
                }
              } catch (err) {
                setError("Invalid code format. Please try again.");
                setTimeout(() => setError(null), 3000);
              }
            },
            (errorMessage) => {
              if (!errorMessage.includes("No QR code found")) {
                console.log(errorMessage);
              }
            }
          );
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to start scanner. Please try again.");
          console.error("Scanner initialization error:", err);
        }
      }
    };

    initializeScanner();

    return () => {
      mounted = false;
      if (scanner?.isScanning) {
        scanner.stop().catch(console.error);
        const videoElement = document.querySelector('#qr-reader video');
        if (videoElement?.srcObject) {
          videoElement.srcObject.getTracks().forEach(track => track.stop());
          videoElement.srcObject = null;
        }
      }
    };
  }, [onClose, onScan, predefinedItems]);

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
    <div className="scanner-overlay" onClick={(e) => e.target === e.currentTarget && stopScanner()}>
      <div className="scanner-container">
        <button className="close-button" onClick={stopScanner} aria-label="Close scanner">
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