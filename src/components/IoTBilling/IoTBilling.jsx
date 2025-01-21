import { useState, useEffect } from 'react';
import './IoTBilling.css';
import { FaPlug, FaExclamationTriangle, FaCheckCircle, FaSync } from 'react-icons/fa';

const IoTBilling = ({ onNewTransaction }) => {
  const [devices, setDevices] = useState([
    { 
      id: 'POS001', 
      name: 'Main Counter POS',
      type: 'pos',
      status: 'connected',
      lastReading: new Date().toISOString(),
      transactions: 0
    },
    { 
      id: 'SMRT002', 
      name: 'Smart Meter 1',
      type: 'meter',
      status: 'connected',
      lastReading: new Date().toISOString(),
      consumption: 0
    },
    { 
      id: 'SCAN003', 
      name: 'Barcode Scanner',
      type: 'scanner',
      status: 'disconnected',
      lastReading: null,
      scans: 0
    }
  ]);

  const [realTimeData, setRealTimeData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        const newReading = generateReading();
        setRealTimeData(prev => [...prev, newReading].slice(-10));
        
        setDevices(prevDevices => {
          return prevDevices.map(device => {
            if (device.id === newReading.deviceId) {
              return {
                ...device,
                lastReading: new Date().toISOString(),
                status: 'active',
                [device.type === 'pos' ? 'transactions' : 
                 device.type === 'meter' ? 'consumption' : 'scans']: 
                  (device[device.type === 'pos' ? 'transactions' : 
                         device.type === 'meter' ? 'consumption' : 'scans'] || 0) + 1
              };
            }
            return device;
          });
        });

        if (newReading.type === 'transaction') {
          onNewTransaction(newReading);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, onNewTransaction]);

  const generateReading = () => {
    const activeDevice = devices.find(d => d.status !== 'disconnected');
    if (!activeDevice) return null;

    const types = {
      pos: () => ({
        type: 'transaction',
        amount: Math.floor(Math.random() * 1000) + 100,
        itemCount: Math.floor(Math.random() * 5) + 1
      }),
      meter: () => ({
        type: 'consumption',
        units: Math.floor(Math.random() * 10) + 1,
        rate: 8.5
      }),
      scanner: () => ({
        type: 'scan',
        itemId: `ITEM${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString()
      })
    };

    return {
      deviceId: activeDevice.id,
      timestamp: new Date().toISOString(),
      ...types[activeDevice.type]()
    };
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const reconnectDevice = (deviceId) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'connected', lastReading: new Date().toISOString() }
          : device
      )
    );
  };

  return (
    <div className="iot-billing-container">
      <div className="iot-header">
        <h2>IoT Billing Integration</h2>
        <button 
          className={`simulation-toggle ${isSimulating ? 'active' : ''}`}
          onClick={toggleSimulation}
        >
          <FaSync className={isSimulating ? 'spinning' : ''} />
          {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
        </button>
      </div>

      <div className="devices-grid">
        {devices.map(device => (
          <div key={device.id} className={`device-card ${device.status}`}>
            <div className="device-header">
              <FaPlug className="device-icon" />
              <span className={`status-indicator ${device.status}`} />
            </div>
            <h3>{device.name}</h3>
            <p className="device-id">ID: {device.id}</p>
            <p className="device-status">
              {device.status === 'connected' && <FaCheckCircle className="status-icon connected" />}
              {device.status === 'disconnected' && <FaExclamationTriangle className="status-icon disconnected" />}
              {device.status === 'active' && <FaSync className="status-icon active spinning" />}
              {device.status}
            </p>
            {device.lastReading && (
              <p className="last-reading">
                Last Reading: {new Date(device.lastReading).toLocaleTimeString()}
              </p>
            )}
            {device.status === 'disconnected' && (
              <button 
                className="reconnect-btn"
                onClick={() => reconnectDevice(device.id)}
              >
                Reconnect
              </button>
            )}
            <div className="device-stats">
              {device.type === 'pos' && <p>Transactions: {device.transactions}</p>}
              {device.type === 'meter' && <p>Units Consumed: {device.consumption}</p>}
              {device.type === 'scanner' && <p>Scans: {device.scans}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="real-time-feed">
        <h3>Real-Time Data Feed</h3>
        <div className="feed-container">
          {realTimeData.map((reading, index) => (
            <div key={index} className={`feed-item ${reading.type}`}>
              <span className="timestamp">
                {new Date(reading.timestamp).toLocaleTimeString()}
              </span>
              <span className="device-id">{reading.deviceId}</span>
              {reading.type === 'transaction' && (
                <span className="reading-data">
                  ₹{reading.amount} ({reading.itemCount} items)
                </span>
              )}
              {reading.type === 'consumption' && (
                <span className="reading-data">
                  {reading.units} units @ ₹{reading.rate}/unit
                </span>
              )}
              {reading.type === 'scan' && (
                <span className="reading-data">
                  Scanned: {reading.itemId}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTBilling; 