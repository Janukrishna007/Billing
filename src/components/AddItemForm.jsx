import React, { useState } from 'react';
import { api } from '../services/api';

const AddItemForm = ({ onItemAdded }) => {
  const [formData, setFormData] = useState({
    itemNumber: '',
    name: '',
    price: '',
    category: '',
    gstRate: '',
    stock: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.addItem(formData);
      onItemAdded(response.data);
      setFormData({
        itemNumber: '',
        name: '',
        price: '',
        category: '',
        gstRate: '',
        stock: ''
      });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item Number"
        value={formData.itemNumber}
        onChange={(e) => setFormData({...formData, itemNumber: e.target.value})}
      />
      {/* Add other input fields */}
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm; 