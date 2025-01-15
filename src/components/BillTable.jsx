import React from 'react';
import { FaTrash } from 'react-icons/fa';
import './BillTable.css';

const BillTable = ({ items, onRemoveItem }) => {
  return (
    <div className="bill-table">
      <div className="table-header">
        <div>Date</div>
        <div>Item Number</div>
        <div>Quantity</div>
        <div>Price</div>
        <div>Total</div>
        <div>Actions</div>
      </div>
      {items.map((item, index) => (
        <div key={index} className="table-row">
          <div>{item.date}</div>
          <div>{item.itemNumber}</div>
          <div>{item.quantity}</div>
          <div>₹{item.price.toFixed(2)}</div>
          <div>₹{item.total.toFixed(2)}</div>
          <div>
            <button className="btn-remove" onClick={() => onRemoveItem(index)}>
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BillTable;