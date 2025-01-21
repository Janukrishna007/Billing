import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import './AnalyticsDashboard.css';

const DashboardCard = ({ title, value, trend, icon, className }) => (
  <div className={`dashboard-stat-card ${className || ''}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-details">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
      {trend && (
        <span className={`stat-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const AnalyticsDashboard = ({ items }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartView, setChartView] = useState('revenue');

  const COLORS = {
    primary: '#4f46e5',
    secondary: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: '#94a3b8'
  };

  const analytics = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };

    const filteredItems = items.filter(item => 
      new Date(item.date) >= timeRanges[timeRange]
    );

    // Revenue Analysis
    const totalRevenue = filteredItems.reduce((sum, item) => sum + item.total, 0);
    const totalOrders = filteredItems.length;
    const averageOrder = totalRevenue / (totalOrders || 1);
    const totalGST = filteredItems.reduce((sum, item) => sum + item.gstAmount, 0);

    // Daily Revenue Trend
    const dailyRevenue = filteredItems.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0, gst: 0 };
      }
      acc[date].revenue += item.total;
      acc[date].orders += 1;
      acc[date].gst += item.gstAmount;
      return acc;
    }, {});

    // Category Distribution
    const categoryData = filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { name: item.category, value: 0, orders: 0 };
      }
      acc[item.category].value += item.total;
      acc[item.category].orders += 1;
      return acc;
    }, {});

    // GST Analysis
    const gstRates = filteredItems.reduce((acc, item) => {
      const rate = `${item.gstRate}%`;
      if (!acc[rate]) acc[rate] = 0;
      acc[rate] += item.gstAmount;
      return acc;
    }, {});

    return {
      totalRevenue,
      totalOrders,
      averageOrder,
      totalGST,
      dailyData: Object.values(dailyRevenue).sort((a, b) => new Date(a.date) - new Date(b.date)),
      categoryData: Object.values(categoryData),
      gstData: Object.entries(gstRates).map(([rate, amount]) => ({
        rate,
        amount
      }))
    };
  }, [items, timeRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>Smart Analytics Dashboard</h2>
          <p className="subtitle">Real-time insights and spending patterns</p>
        </div>
        <div className="dashboard-actions">
          <div className="time-filter">
            <button 
              className={timeRange === 'week' ? 'active' : ''} 
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={timeRange === 'month' ? 'active' : ''} 
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={timeRange === 'year' ? 'active' : ''} 
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(analytics.totalRevenue)}
          trend={12}
          icon="💰"
          className="revenue"
        />
        <DashboardCard
          title="Total Orders"
          value={analytics.totalOrders}
          trend={8}
          icon="📦"
          className="orders"
        />
        <DashboardCard
          title="Average Order"
          value={formatCurrency(analytics.averageOrder)}
          trend={5}
          icon="📊"
          className="average"
        />
        <DashboardCard
          title="Total GST"
          value={formatCurrency(analytics.totalGST)}
          trend={3}
          icon="💸"
          className="gst"
        />
      </div>

      <div className="charts-container">
        <div className="main-chart">
          <div className="chart-header">
            <h3>Revenue Overview</h3>
            <div className="chart-actions">
              <button 
                className={chartView === 'revenue' ? 'active' : ''}
                onClick={() => setChartView('revenue')}
              >
                Revenue
              </button>
              <button 
                className={chartView === 'orders' ? 'active' : ''}
                onClick={() => setChartView('orders')}
              >
                Orders
              </button>
              <button 
                className={chartView === 'gst' ? 'active' : ''}
                onClick={() => setChartView('gst')}
              >
                GST
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics.dailyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={value => formatCurrency(value)} />
              <Tooltip formatter={value => formatCurrency(value)} />
              <Area
                type="monotone"
                dataKey={chartView}
                stroke={COLORS.primary}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="secondary-charts">
          <div className="chart-card">
            <h3>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[Object.keys(COLORS)[index % Object.keys(COLORS).length]]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>GST Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.gstData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rate" />
                <YAxis tickFormatter={value => formatCurrency(value)} />
                <Tooltip formatter={value => formatCurrency(value)} />
                <Bar dataKey="amount" fill={COLORS.secondary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;