import React from 'react';
import { FaLeaf, FaRecycle, FaLightbulb } from 'react-icons/fa';

const EnvironmentalImpact = ({ items }) => {
  // Calculate carbon footprint based on total bill amount
  const calculateCarbonFootprint = () => {
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    return (totalAmount * 0.5) / 1000; // Example calculation
  };

  // Calculate paper saved by using digital billing
  const calculatePaperSaved = () => {
    return items.length * 2; // Example: 2 sheets per transaction
  };

  // Generate personalized eco-friendly tips
  const generateEcoTips = () => {
    const tips = [];
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    if (totalAmount > 50000) {
      tips.push("Consider bulk purchasing to reduce packaging waste.");
    }
    if (items.some(item => item.category === "Electronics")) {
      tips.push("Opt for energy-efficient electronics to reduce power consumption.");
    }
    if (items.some(item => item.category === "Food")) {
      tips.push("Choose local products to reduce transportation emissions.");
    }

    return tips;
  };

  return (
    <div className="environmental-impact" style={{ color: '#333' }}>
      <h2 style={{ color: '#1a1a1a' }}>Environmental Impact Dashboard</h2>
      
      <div className="eco-metrics">
        <div className="eco-card" style={{ color: '#2c2c2c' }}>
          <div className="eco-icon">
            <FaLeaf style={{ color: '#4CAF50' }} />
          </div>
          <h3>Carbon Footprint</h3>
          <p>{calculateCarbonFootprint().toFixed(2)} kg CO₂</p>
          <small>Based on your current billing period</small>
        </div>

        <div className="eco-card" style={{ color: '#2c2c2c' }}>
          <div className="eco-icon">
            <FaRecycle style={{ color: '#2196F3' }} />
          </div>
          <h3>Paper Saved</h3>
          <p>{calculatePaperSaved()} sheets</p>
          <small>By using digital billing</small>
        </div>

        <div className="eco-card" style={{ color: '#2c2c2c' }}>
          <div className="eco-icon">
            <FaLightbulb style={{ color: '#FFC107' }} />
          </div>
          <h3>Eco-Rewards</h3>
          <p>₹{(calculatePaperSaved() * 0.5).toFixed(2)}</p>
          <small>Savings from going paperless</small>
        </div>
      </div>

      <div className="eco-tips">
        <h3 style={{ color: '#1a1a1a' }}>Sustainability Tips</h3>
        <div className="tips-container">
          {generateEcoTips().map((tip, index) => (
            <div key={index} className="tip-card" style={{ color: '#2c2c2c' }}>
              <FaLeaf className="tip-icon" style={{ color: '#4CAF50' }} />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
