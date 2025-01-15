import React from 'react';

const Rewards = ({ customer }) => {
  return (
    <div className="rewards-section">
      <h2>Loyalty Rewards</h2>
      <p><strong>{customer.name}</strong>, you have earned <strong>{customer.points}</strong> points!</p>
      <p>Redeem your points for discounts on future purchases.</p>
      <ul>
        <li>100 points = 10% off</li>
        <li>200 points = 20% off</li>
        <li>500 points = 50% off</li>
      </ul>
    </div>
  );
};

export default Rewards; 