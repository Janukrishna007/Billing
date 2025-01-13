import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaTrash, FaPrint, FaSearch, FaFileExport, FaSave, FaEdit } from 'react-icons/fa';

function App() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('billingItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const printRef = useRef();
  const [editingId, setEditingId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showSummary, setShowSummary] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    localStorage.setItem('billingItems', JSON.stringify(items));
  }, [items]);

  const [form, setForm] = useState({
    itemNumber: '',
    quantity: '',
    price: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    const { itemNumber, quantity, price, category, date } = form;

    if (!itemNumber || !quantity || !price || !category) {
      alert('Please fill in all fields.');
      return;
    }

    const newItem = {
      itemNumber,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      category,
      date,
      total: parseFloat(quantity) * parseFloat(price),
    };

    setItems([...items, newItem]);
    setTotalAmount(totalAmount + newItem.total);
    setForm({
      itemNumber: '',
      quantity: '',
      price: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const removeItem = (index) => {
    const itemToRemove = items[index];
    setTotalAmount(totalAmount - itemToRemove.total);
    setItems(items.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredItems = items.filter(item =>
    item.itemNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!category || item.category === category)
  );

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Item Number', 'Category', 'Quantity', 'Price', 'Total'];
    const csvData = [
      headers,
      ...items.map(item => [
        item.date,
        item.itemNumber,
        item.category,
        item.quantity,
        item.price,
        item.total
      ])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      csvData.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing_report_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Billing System</h1>
        <div className="customer-info">
          <button 
            className="btn-toggle-customer"
            onClick={() => setShowSummary(!showSummary)}
          >
            {showSummary ? 'Hide Summary' : 'Show Summary'}
          </button>
        </div>
      </header>

      {showSummary && (
        <section className="summary-section">
          <div className="customer-form">
            <h3>Customer Information</h3>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            <textarea
              placeholder="Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
            />
          </div>
          <div className="summary-stats">
            <div className="stat-card">
              <h4>Total Items</h4>
              <p>{items.length}</p>
            </div>
            <div className="stat-card">
              <h4>Total Amount</h4>
              <p>${totalAmount.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h4>Categories</h4>
              <p>{new Set(items.map(item => item.category)).size}</p>
            </div>
          </div>
        </section>
      )}

      <main>
        <section className="form-section">
          <h2>Add Item</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addItem();
            }}
            className="item-form"
          >
            <input
              type="text"
              placeholder="Item Number"
              name="itemNumber"
              value={form.itemNumber}
              onChange={handleInputChange}
            />
            <input
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleInputChange}
            />
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={form.price}
              onChange={handleInputChange}
            />
            <select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
            />
            <button type="submit" className="btn-add">
              Add Item
            </button>
          </form>
        </section>

        <section className="billing-section">
          <div className="billing-header">
            <h2>Billed Items</h2>
            <div className="billing-actions">
              <div className="search-filter">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="action-buttons">
                <button className="btn-export" onClick={exportToCSV}>
                  <FaFileExport /> Export CSV
                </button>
                <button className="btn-print" onClick={handlePrint}>
                  <FaPrint /> Print Invoice
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {['date', 'itemNumber', 'category', 'quantity', 'price', 'total'].map((key) => (
                    <th 
                      key={key}
                      onClick={() => handleSort(key)}
                      className={sortConfig.key === key ? `sorted-${sortConfig.direction}` : ''}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {sortConfig.key === key && (
                        <span className="sort-indicator">
                          {sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.date}</td>
                    <td>{item.itemNumber}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.total.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-remove"
                        onClick={() => removeItem(index)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h3 className="total-amount">Total: ${totalAmount.toFixed(2)}</h3>
        </section>
      </main>
    </div>
  );
}

export default App;
