import React from 'react';
import { FaLeaf, FaRecycle, FaLightbulb } from 'react-icons/fa';

const EnvironmentalImpact = ({ items }) => {
  // Calculate carbon footprint based on total bill amount
  // This is a simplified calculation for demonstration
  const calculateCarbonFootprint = () => {
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    // Assuming 0.5 kg CO2 per 1000 rupees of consumption
    return (totalAmount * 0.5) / 1000;
  };

  // Calculate paper saved by using digital billing
  const calculatePaperSaved = () => {
    return items.length * 2; // Assuming 2 sheets per transaction saved
  };

  // Generate personalized eco-friendly tips
  const generateEcoTips = () => {
    const tips = [];
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    if (totalAmount > 50000) {
      tips.push("Consider bulk purchasing to reduce packaging waste");
    }
    if (items.filter(item => item.category === "Electronics").length > 0) {
      tips.push("Opt for energy-efficient electronics to reduce power consumption");
    }
    if (items.filter(item => item.category === "Food").length > 0) {
      tips.push("Choose local products to reduce transportation emissions");
    }

    return tips;
  };

  return (
    <div className="environmental-impact">
      <h2>Environmental Impact Dashboard</h2>
      
      <div className="eco-metrics">
        <div className="eco-card">
          <div className="eco-icon">
            <FaLeaf />
          </div>
          <h3>Carbon Footprint</h3>
          <p>{calculateCarbonFootprint().toFixed(2)} kg CO₂</p>
          <small>Based on your current billing period</small>
        </div>

        <div className="eco-card">
          <div className="eco-icon">
            <FaRecycle />
          </div>
          <h3>Paper Saved</h3>
          <p>{calculatePaperSaved()} sheets</p>
          <small>By using digital billing</small>
        </div>

        <div className="eco-card">
          <div className="eco-icon">
            <FaLightbulb />
          </div>
          <h3>Eco-Rewards</h3>
          <p>₹{(calculatePaperSaved() * 0.5).toFixed(2)}</p>
          <small>Savings from going paperless</small>
        </div>
      </div>

      <div className="eco-tips">
        <h3>Sustainability Tips</h3>
        <div className="tips-container">
          {generateEcoTips().map((tip, index) => (
            <div key={index} className="tip-card">
              <FaLeaf className="tip-icon" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
