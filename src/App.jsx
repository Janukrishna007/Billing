import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaTrash, FaPrint, FaSearch, FaFileExport, FaSave, FaEdit, FaCamera } from 'react-icons/fa';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import EnvironmentalImpact from './components/EnvironmentalImpact';
import TranslationSelector from './components/TranslationSelector';
import ARScanner from './components/ARScanner';
import Scanner from './components/Scanner';

// Example customer data structure
const customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    points: 0,
    transactions: [
      { date: '2023-10-01', amount: 100, product: 'Electronics', paidOnTime: true },
      { date: '2023-10-05', amount: 50, product: 'Clothing', paidOnTime: true },
      // More transactions...
    ],
  },
  // More customers...
];

// Function to calculate rewards based on product type
function calculateRewards(customer) {
  let points = 0;
  customer.transactions.forEach(transaction => {
    if (transaction.paidOnTime) {
      switch (transaction.product) {
        case 'Electronics':
          points += transaction.amount * 0.2; // 20% for electronics
          break;
        case 'Clothing':
          points += transaction.amount * 0.1; // 10% for clothing
          break;
        case 'Food':
          points += transaction.amount * 0.05; // 5% for food
          break;
        default:
          points += transaction.amount * 0.1; // Default 10%
      }
    }
  });
  return points;
}

// Function to update customer rewards
function updateCustomerRewards() {
  customers.forEach(customer => {
    customer.points = calculateRewards(customer);
  });
}

function App() {
  const predefinedItems = [
    { id: "ITM001", name: "Laptop", category: "Electronics", price: 75000 },
    { id: "ITM002", name: "Smartphone", category: "Electronics", price: 45000 },
    { id: "ITM003", name: "T-Shirt", category: "Clothing", price: 999 },
    { id: "ITM004", name: "Jeans", category: "Clothing", price: 2499 },
    { id: "ITM005", name: "Pizza", category: "Food", price: 499 },
    { id: "ITM006", name: "Burger", category: "Food", price: 299 },
  ];

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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEnvironmental, setShowEnvironmental] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showScanner, setShowScanner] = useState(false);

  const translations = {
    en: {
      title: 'Billing System',
      summary: 'Show Summary',
      hideSummary: 'Hide Summary',
      analytics: 'Show Analytics',
      hideAnalytics: 'Hide Analytics',
      environmental: 'Show Environmental Impact',
      hideEnvironmental: 'Hide Environmental Impact',
      addItem: 'Add Item',
      quantity: 'Quantity',
      price: 'Price',
      category: 'Category',
      date: 'Date',
      total: 'Total',
      billTo: 'Bill To',
      invoiceNumber: 'Invoice Number',
      customerInfo: 'Customer Information',
      selectItem: 'Select Item',
      searchItems: 'Search items...',
      allCategories: 'All Categories',
      electronics: 'Electronics',
      clothing: 'Clothing',
      food: 'Food',
      other: 'Other',
      exportCSV: 'Export CSV',
      printInvoice: 'Print Invoice',
      actions: 'Actions',
      totalAmount: 'Total Amount',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      itemNumber: 'Item Number'
    },
    es: {
      title: 'Sistema de Facturación',
      summary: 'Mostrar Resumen',
      hideSummary: 'Ocultar Resumen',
      analytics: 'Mostrar Análisis',
      hideAnalytics: 'Ocultar Análisis',
      environmental: 'Mostrar Impacto Ambiental',
      hideEnvironmental: 'Ocultar Impacto Ambiental',
      addItem: 'Agregar Artículo',
      quantity: 'Cantidad',
      price: 'Precio',
      category: 'Categoría',
      date: 'Fecha',
      total: 'Total',
      billTo: 'Facturar a',
      invoiceNumber: 'Número de Factura',
      customerInfo: 'Información del Cliente',
      selectItem: 'Seleccionar Artículo',
      searchItems: 'Buscar artículos...',
      allCategories: 'Todas las Categorías',
      electronics: 'Electrónicos',
      clothing: 'Ropa',
      food: 'Alimentos',
      other: 'Otros',
      exportCSV: 'Exportar CSV',
      printInvoice: 'Imprimir Factura',
      actions: 'Acciones',
      totalAmount: 'Monto Total',
      name: 'Nombre',
      email: 'Correo',
      phone: 'Teléfono',
      address: 'Dirección',
      itemNumber: 'Número de Artículo'
    },
    hi: {
      title: 'बिलिंग सिस्टम',
      summary: 'सारांश दिखाएं',
      hideSummary: 'सारांश छिपाएं',
      analytics: 'विश्लेषण दिखाएं',
      hideAnalytics: 'विश्लेषण छिपाएं',
      environmental: 'पर्यावरण प्रभाव दिखाएं',
      hideEnvironmental: 'पर्यावरण प्रभाव छिपाएं',
      addItem: 'आइटम जोड़ें',
      quantity: 'मात्रा',
      price: 'कीमत',
      category: 'श्रेणी',
      date: 'दिनांक',
      total: 'कुल',
      billTo: 'बिल प्राप्तकर्ता',
      invoiceNumber: 'चालान संख्या',
      customerInfo: 'ग्राहक जानकारी',
      selectItem: 'आइटम चुनें',
      searchItems: 'आइटम खोजें...',
      allCategories: 'सभी श्रेणियां',
      electronics: 'इलेक्ट्रॉनिक्स',
      clothing: 'कपड़े',
      food: 'खाना',
      other: 'अन्य',
      exportCSV: 'CSV निर्यात करें',
      printInvoice: 'चालान प्रिंट करें',
      actions: 'कार्रवाई',
      totalAmount: 'कुल राशि',
      name: 'नाम',
      email: 'ईमेल',
      phone: 'फ़ोन',
      address: 'पता',
      itemNumber: 'वस्तु संख्या'
    },
    ml: {
      title: 'ബില്ലിംഗ് സിസ്റ്റം',
      summary: 'സംഗ്രഹം കാണിക്കുക',
      hideSummary: 'സംഗ്രഹം മറയ്ക്കുക',
      analytics: 'വിശകലനം കാണിക്കുക',
      hideAnalytics: 'വിശകലനം മറയ്ക്കുക',
      environmental: 'പരിസ്ഥിതി സ്വാധീനം കാണിക്കുക',
      hideEnvironmental: 'പരിസ്ഥിതി സ്വാധീനം മറയ്ക്കുക',
      addItem: 'ഇനം ചേർക്കുക',
      quantity: 'അളവ്',
      price: 'വില',
      category: 'വിഭാഗം',
      date: 'തീയതി',
      total: 'ആകെ',
      billTo: 'ബില്ല് സ്വീകർത്താവ്',
      invoiceNumber: 'ഇൻവോയ്സ് നമ്പർ',
      customerInfo: 'ഉപഭോക്താവിന്റെ വിവരങ്ങൾ',
      selectItem: 'ഇനം തിരഞ്ഞെടുക്കുക',
      searchItems: 'ഇനങ്ങൾ തിരയുക...',
      allCategories: 'എല്ലാ വിഭാഗങ്ങളും',
      electronics: 'ഇലക്ട്രോണിക്സ്',
      clothing: 'വസ്ത്രങ്ങൾ',
      food: 'ഭക്ഷണം',
      other: 'മറ്റുള്ളവ',
      exportCSV: 'CSV കയറ്റുമതി ചെയ്യുക',
      printInvoice: 'ഇൻവോയ്സ് പ്രിന്റ് ചെയ്യുക',
      actions: 'പ്രവർത്തനങ്ങൾ',
      totalAmount: 'ആകെ തുക',
      name: 'പേര്',
      email: 'ഇമെയിൽ',
      phone: 'ഫോൺ',
      address: 'വിലാസം',
      itemNumber: 'ഇനം നമ്പർ'
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key];
  };

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

  const handleItemSelect = (e) => {
    const selectedItem = predefinedItems.find(item => item.id === e.target.value);
    if (selectedItem) {
      setForm({
        ...form,
        itemNumber: selectedItem.id,
        price: selectedItem.price.toString(),
        category: selectedItem.category
      });
    }
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
    const newItems = items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((sum, item) => sum + item.total, 0);
    setItems(newItems);
    setTotalAmount(newTotal);
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
    // Generate invoice number
    const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`;
    
    // Prepare headers and customer info section
    const headers = [
      ['INVOICE DETAILS'],
      ['Invoice Number:', invoiceNumber],
      ['Date:', new Date().toLocaleDateString()],
      [],
      ['CUSTOMER INFORMATION'],
      ['Name:', customerInfo.name || ''],
      ['Email:', customerInfo.email || ''],
      ['Phone:', customerInfo.phone || ''],
      ['Address:', customerInfo.address || ''],
      [],
      ['ITEM DETAILS'],
      ['Date', 'Item Number', 'Item Name', 'Category', 'Quantity', 'Price (₹)', 'Total (₹)', 'GST']
    ];

    // Prepare items data with GST calculations
    const itemsData = items.map(item => {
      let gstRate;
      switch(item.category.toLowerCase()) {
        case 'electronics':
          gstRate = 0.18;
          break;
        case 'clothing':
          gstRate = 0.05;
          break;
        case 'food':
          gstRate = 0.12;
          break;
        default:
          gstRate = 0.18;
      }
      
      const gstAmount = item.total * gstRate;
      const itemName = predefinedItems.find(pItem => pItem.id === item.itemNumber)?.name || item.itemNumber;

      return [
        item.date,
        item.itemNumber,
        itemName,
        item.category,
        item.quantity,
        item.price.toFixed(2),
        item.total.toFixed(2),
        `${(gstRate * 100)}% (₹${gstAmount.toFixed(2)})`
      ];
    });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const totalGST = items.reduce((sum, item) => {
      let gstRate;
      switch(item.category.toLowerCase()) {
        case 'electronics': gstRate = 0.18; break;
        case 'clothing': gstRate = 0.05; break;
        case 'food': gstRate = 0.12; break;
        default: gstRate = 0.18;
      }
      return sum + (item.total * gstRate);
    }, 0);
    const grandTotal = subtotal + totalGST;

    // Add summary section
    const summary = [
      [],
      ['SUMMARY'],
      ['Subtotal:', `₹${subtotal.toFixed(2)}`],
      ['Total GST:', `₹${totalGST.toFixed(2)}`],
      ['Grand Total:', `₹${grandTotal.toFixed(2)}`],
      [],
      ['Generated on:', new Date().toLocaleString()],
      ['MJ Labs, Technopark phase 1, Trivandrum']
    ];

    // Combine all data
    const csvData = [
      ...headers,
      ...itemsData,
      ...summary
    ];
      
    // Create and download CSV file
    const csvContent = "data:text/csv;charset=utf-8," + 
      csvData.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `billing_report_${invoiceNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const PrintLayout = () => {
    const calculateCategoryTotals = () => {
      return items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            subtotal: 0,
            gst: 0
          };
        }
        acc[item.category].subtotal += item.total;
        
        switch(item.category) {
          case 'electronics':
            acc[item.category].gst = acc[item.category].subtotal * 0.18;
            break;
          case 'clothing':
            acc[item.category].gst = acc[item.category].subtotal * 0.05;
            break;
          case 'food':
            acc[item.category].gst = acc[item.category].subtotal * 0.12;
            break;
          default:
            acc[item.category].gst = acc[item.category].subtotal * 0.18;
        }
        return acc;
      }, {});
    };

    const categoryTotals = calculateCategoryTotals();
    const totalGST = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.gst, 0);
    const finalTotal = totalAmount + totalGST;

    return (
      <div className="print-only">
        <div className="print-header">
          <div className="company-info">
            <h1>MJ Labs</h1>
            <p>Technopark phase 1</p>
            <p>Trivandrum</p>
            <p>Phone: 8590276004</p>
            <p>Email: mjlabstvm@gmail.com</p>
          </div>
          <div className="invoice-details">
            <h2>INVOICE</h2>
            <p>Invoice #: INV-{new Date().getTime().toString().slice(-6)}</p>
            <p>Date: {formatDate(new Date())}</p>
          </div>
        </div>

        <div className="print-customer-info">
          <div className="bill-to">
            <h3>Bill To:</h3>
            <p>{customerInfo.name}</p>
            <p>{customerInfo.address}</p>
            {customerInfo.phone && <p>Phone: {customerInfo.phone}</p>}
            {customerInfo.email && <p>Email: {customerInfo.email}</p>}
          </div>
        </div>

        <div className="print-items">
          <table className="print-table">
            <thead>
              <tr>
                <th>Item Number</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemNumber}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="print-summary">
          <div className="summary-calculations">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            
            {Object.entries(categoryTotals).map(([category, values]) => (
              <div className="summary-row" key={category}>
                <span>GST for {category} ({
                  category === 'electronics' ? '18%' :
                  category === 'clothing' ? '5%' :
                  category === 'food' ? '12%' : '18%'
                }):</span>
                <span>₹{values.gst.toFixed(2)}</span>
              </div>
            ))}
            
            <div className="summary-row total">
              <span>Total (Including GST):</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          
        </div>

        <div className="print-footer">
          <div className="terms-conditions">
            <h4>Terms & Conditions</h4>
            <p>1. Payment is due within 30 days</p>
            <p>2. Please include invoice number on your payment</p>
            <p>3. Thank you for your business!</p>
          </div>
          <div className="signature-section">
            <div className="signature-line">
              <hr />
              <p>Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleScanComplete = (scannedData) => {
    // Here you can process the scanned barcode/QR code data
    console.log('Scanned data:', scannedData);
    
    // Example: Add item based on scanned code
    const newItem = {
      itemNumber: scannedData,
      date: new Date().toISOString().split('T')[0],
      quantity: 1,
      price: 0, // You would need to look up the price based on the code
      total: 0
    };
    
    // Add the item to your items list
    setItems(prevItems => [...prevItems, newItem]);
    setShowScanner(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>{t('title')}</h1>
        <div className="header-controls">
          <TranslationSelector 
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
          <div className="header-buttons">
            <button 
              className="btn-toggle-customer"
              onClick={() => setShowSummary(!showSummary)}
            >
              {showSummary ? t('hideSummary') : t('summary')}
            </button>
            <button 
              className="btn-toggle-analytics"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              {showAnalytics ? t('hideAnalytics') : t('analytics')}
            </button>
            <button 
              className="btn-toggle-environmental"
              onClick={() => setShowEnvironmental(!showEnvironmental)}
            >
              {showEnvironmental ? t('hideEnvironmental') : t('environmental')}
            </button>
          </div>
        </div>
      </header>

      {showSummary && (
        <section className="summary-section">
          <div className="customer-form">
            <h3>Customer Information</h3>
            <input
              type="text"
              placeholder={t('name')}
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            />
            <input
              type="email"
              placeholder={t('email')}
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            />
            <input
              type="tel"
              placeholder={t('phone')}
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
            />
            <textarea
              placeholder={t('address')}
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
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h4>Categories</h4>
              <p>{new Set(items.map(item => item.category)).size}</p>
            </div>
          </div>
        </section>
      )}

      {showAnalytics && (
        <section className="analytics-container">
          <AnalyticsDashboard items={items} t={t} />
        </section>
      )}

      {showEnvironmental && (
        <section className="environmental-section">
          <EnvironmentalImpact items={items} t={t} />
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
            <select
              name="itemNumber"
              value={form.itemNumber}
              onChange={handleItemSelect}
              required
            >
              <option value="">Select Item</option>
              {predefinedItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.name} (₹{item.price})
                </option>
              ))}
            </select>
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
              <option value="">{t('selectItem')}</option>
              <option value="Electronics">{t('electronics')}</option>
              <option value="Clothing">{t('clothing')}</option>
              <option value="Food">{t('food')}</option>
              <option value="Other">{t('other')}</option>
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
                    placeholder={t('searchItems')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="action-buttons">
                <button 
                  className="btn-scan"
                  onClick={() => setShowScanner(true)}
                >
                  <FaCamera /> Scan Receipt
                </button>
                <button className="btn-export" onClick={exportToCSV}>
                  <FaFileExport /> {t('exportCSV')}
                </button>
                <button className="btn-print" onClick={handlePrint}>
                  <FaPrint /> {t('printInvoice')}
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('date')}>{t('date')}</th>
                  <th onClick={() => handleSort('itemNumber')}>{t('itemNumber')}</th>
                  <th onClick={() => handleSort('itemName')}>{t('selectItem')}</th>
                  <th onClick={() => handleSort('category')}>{t('category')}</th>
                  <th onClick={() => handleSort('quantity')}>{t('quantity')}</th>
                  <th onClick={() => handleSort('price')}>{t('price')}</th>
                  <th onClick={() => handleSort('total')}>{t('total')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.date}</td>
                    <td>{item.itemNumber}</td>
                    <td>{predefinedItems.find(pItem => pItem.id === item.itemNumber)?.name || item.itemNumber}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{item.total.toFixed(2)}</td>
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
          <h3 className="total-amount">Total: ₹{totalAmount.toFixed(2)}</h3>
        </section>
      </main>

      <PrintLayout />

      {showScanner && (
        <Scanner 
          onClose={() => setShowScanner(false)}
          onScan={handleScanComplete}
        />
      )}
    </div>
  );
}

export default App;
