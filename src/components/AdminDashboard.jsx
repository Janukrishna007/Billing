import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaFileInvoiceDollar, FaUsers, FaChartBar, FaBox,
  FaCog, FaSignOutAlt, FaWallet, FaChartLine 
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [performance, setPerformance] = useState({
    finished: 18,
    tracked: '31h',
    efficiency: '93%',
    tasks: '+8 tasks',
    hours: '-6 hours',
    improvement: '+12%'
  });

  useEffect(() => {
    // Fetch data when component mounts
    fetchUsers();
    fetchProducts();
    fetchOrders();
    calculatePerformance();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculatePerformance = () => {
    // Calculate performance metrics based on orders and products
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const efficiency = (orders.length / products.length) * 100;
    
    setPerformance({
      totalSales,
      totalOrders: orders.length,
      efficiency: Math.round(efficiency) + '%'
    });
  };

  const menuItems = [
    {
      title: 'Billing & Invoicing',
      icon: <FaFileInvoiceDollar />,
      description: 'Create bills, manage invoices, and track payments',
      path: '/billing',
      color: '#3b82f6',
      stats: {
        value: '₹45,678',
        trend: '+12.5%',
        label: 'Total Billing'
      }
    },
    {
      title: 'Analytics',
      icon: <FaChartBar />,
      description: 'View business insights and reports',
      path: '/analytics',
      color: '#10b981',
      stats: {
        value: '1,234',
        trend: '+5.3%',
        label: 'Transactions'
      }
    },
    {
      title: 'Inventory',
      icon: <FaBox />,
      description: 'Manage products and stock',
      path: '/inventory',
      color: '#f59e0b',
      stats: {
        value: '89',
        trend: '-2.1%',
        label: 'Items in Stock'
      }
    },
    {
      title: 'Financial Health',
      icon: <FaWallet />,
      description: 'Monitor financial metrics and health',
      path: '/financial',
      color: '#8b5cf6',
      stats: {
        value: '₹12,345',
        trend: '+8.4%',
        label: 'Revenue'
      }
    }
  ];

  const handleNavigation = (path) => {
    if (path === '/billing') {
      // Navigate to the original billing page with all features
      navigate('/billing', { state: { showAllFeatures: true } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <img src="/logo.png" alt="Logip" className="h-8 w-8" />
            logip
          </h1>
        </div>

        <nav className="space-y-6">
          <a href="#" className="flex items-center gap-3 text-gray-600">
            <span>🏠</span> Home
          </a>
          <div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-3">
                <span>📋</span> Projects
              </span>
              <button className="text-xl">+</button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center gap-3">
                <span>✓</span> Tasks
              </span>
              <button className="text-xl">+</button>
            </div>
          </div>
          <a href="#" className="flex items-center gap-3 text-gray-600">
            <span>👥</span> Team
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-600">
            <span>⚙️</span> Settings
          </a>
        </nav>

        <div className="mt-auto pt-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-1">Upgrade to Pro</h3>
            <p className="text-sm text-gray-500 mb-3">Get 1 month free and unlock</p>
            <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium">
              Upgrade
            </button>
          </div>
          
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-3 text-gray-600">
              <span>❓</span> Help & Information
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-600">
              <span>↪️</span> Log out
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello, Admin</h1>
            <p className="text-gray-500">Track team progress here. You almost reach a goal!</p>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-gray-600">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <div className="flex items-center gap-3">
              <img src="/admin-avatar.png" alt="Admin" className="h-10 w-10 rounded-full" />
              <div>
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">@admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="px-6 grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span>✓</span>
              <h3>Finished</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{performance.finished}</span>
              <span className="text-green-500 text-sm">{performance.tasks}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span>⏱️</span>
              <h3>Tracked</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{performance.tracked}</span>
              <span className="text-red-500 text-sm">{performance.hours}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <span>📈</span>
              <h3>Efficiency</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{performance.efficiency}</span>
              <span className="text-green-500 text-sm">{performance.improvement}</span>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="px-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Performance</h2>
              <select className="border rounded-lg px-3 py-1">
                <option>01-07 May</option>
              </select>
            </div>
            {/* Add your performance chart component here */}
          </div>
        </div>

        {/* Current Tasks */}
        <div className="px-6 mt-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Current Tasks</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Done 30%</span>
                <select className="border rounded-lg px-3 py-1">
                  <option>Week</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span>📋</span>
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-500">In progress</span>
                    <span className="text-gray-400">{order.total}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 