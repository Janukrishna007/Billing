import React from 'react';
import './LoadingScreen.css';
import { FaShoppingCart, FaChartLine, FaCreditCard } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo-text">BillMaster</div>
          <div className="logo-subtext">Smart Billing Solution</div>
        </div>
        
        <div className="loading-icons">
          <div className="icon-wrapper">
            <FaShoppingCart className="loading-icon" />
          </div>
          <div className="icon-wrapper">
            <FaChartLine className="loading-icon" />
          </div>
          <div className="icon-wrapper">
            <FaCreditCard className="loading-icon" />
          </div>
        </div>

        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        <div className="loading-text">
          <span>I</span>
          <span>n</span>
          <span>i</span>
          <span>t</span>
          <span>i</span>
          <span>a</span>
          <span>l</span>
          <span>i</span>
          <span>z</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>

        <div className="loading-progress-container">
          <div className="loading-progress">
            <div className="progress-bar"></div>
          </div>
          <div className="loading-status">Loading Resources</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 