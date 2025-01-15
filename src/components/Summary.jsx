import React from 'react';

const Summary = ({ customerInfo, items, totalAmount }) => {
  return (
    <div className="summary-section">
      <h2>Order Summary</h2>
      
      <div className="customer-info">
        <h3>Customer Details</h3>
        <div className="info-grid">
          <div><strong>Name:</strong> {customerInfo.name}</div>
          <div><strong>Email:</strong> {customerInfo.email}</div>
          <div><strong>Phone:</strong> {customerInfo.phone}</div>
          <div><strong>Address:</strong> {customerInfo.address}</div>
        </div>
      </div>

      <div className="items-summary">
        <h3>Purchased Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="total-amount">
        <h3>Total Amount</h3>
        <p>₹{totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Summary; 