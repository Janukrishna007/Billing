import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import './PredictiveBilling.css';

const Card = ({ children, className = '', title, subtitle, action }) => (
  <div className={`prediction-card ${className}`}>
    <div className="card-header">
      <div>
        {title && <h3>{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="card-action">{action}</div>}
    </div>
    {children}
  </div>
);

const InsightCard = ({ icon, title, value, trend, description }) => (
  <div className="insight-card">
    <div className="insight-header">
      <div className="insight-icon">{icon}</div>
      <div className="insight-trend">
        <span className={trend >= 0 ? 'positive' : 'negative'}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
        vs last month
      </div>
    </div>
    <div className="insight-content">
      <h4>{title}</h4>
      <div className="insight-value">{value}</div>
      <p className="insight-description">{description}</p>
    </div>
  </div>
);

const PredictiveBilling = ({ items }) => {
  const COLORS = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    gray: '#64748b'
  };

  const predictions = useMemo(() => {
    // Monthly aggregation
    const monthlyData = items.reduce((acc, item) => {
      const month = item.date.substring(0, 7);
      if (!acc[month]) {
        acc[month] = {
          revenue: 0,
          orders: 0,
          categories: {},
          gst: 0
        };
      }
      acc[month].revenue += item.total;
      acc[month].orders += 1;
      acc[month].gst += item.gstAmount;
      acc[month].categories[item.category] = (acc[month].categories[item.category] || 0) + item.total;
      return acc;
    }, {});

    // Calculate trends
    const months = Object.keys(monthlyData).sort();
    const lastMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];

    const revenueTrend = prevMonth
      ? ((monthlyData[lastMonth].revenue - monthlyData[prevMonth].revenue) / monthlyData[prevMonth].revenue) * 100
      : 0;

    // Predict next 3 months
    const revenueData = months.map(month => ({
      month,
      actual: monthlyData[month].revenue,
      predicted: null
    }));

    // Simple linear regression
    const xValues = Array.from({ length: revenueData.length }, (_, i) => i);
    const yValues = revenueData.map(d => d.actual);
    
    const xMean = xValues.reduce((a, b) => a + b, 0) / xValues.length;
    const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;
    
    const slope = xValues.reduce((acc, x, i) => 
      acc + (x - xMean) * (yValues[i] - yMean), 0
    ) / xValues.reduce((acc, x) => acc + Math.pow(x - xMean, 2), 0);
    
    const intercept = yMean - slope * xMean;

    // Add predictions
    for (let i = 1; i <= 3; i++) {
      const nextX = xValues.length + i - 1;
      const predictedValue = slope * nextX + intercept;
      const nextMonth = new Date(lastMonth);
      nextMonth.setMonth(nextMonth.getMonth() + i);
      const nextMonthStr = nextMonth.toISOString().substring(0, 7);
      
      revenueData.push({
        month: nextMonthStr,
        actual: null,
        predicted: predictedValue
      });
    }

    // Category analysis
    const categoryTrends = Object.entries(
      items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.total;
        return acc;
      }, {})
    ).map(([category, value]) => ({
      category,
      value,
      fullMark: Math.max(...Object.values(monthlyData[lastMonth]?.categories || {}))
    }));

    return {
      revenueData,
      categoryTrends,
      lastMonthData: monthlyData[lastMonth] || { revenue: 0, orders: 0, gst: 0 },
      revenueTrend,
      predictedGrowth: (slope / yMean) * 100
    };
  }, [items]);

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="predictive-billing">
      <div className="prediction-header">
        <div>
          <h2>Revenue Predictions</h2>
          <p className="prediction-subtitle">AI-powered revenue forecasting and insights</p>
        </div>
        <div className="prediction-period">
          <span className="active">3 Months</span>
          <span>6 Months</span>
          <span>1 Year</span>
        </div>
      </div>

      <div className="insights-grid">
        <InsightCard
          icon="📈"
          title="Projected Revenue"
          value={formatCurrency(predictions.revenueData[predictions.revenueData.length - 1].predicted)}
          trend={predictions.predictedGrowth}
          description="Expected revenue for next month based on current trends"
        />
        <InsightCard
          icon="💰"
          title="Current Revenue"
          value={formatCurrency(predictions.lastMonthData.revenue)}
          trend={predictions.revenueTrend}
          description="Current month's revenue performance"
        />
        <InsightCard
          icon="📊"
          title="Growth Rate"
          value={`${Math.abs(predictions.predictedGrowth).toFixed(1)}%`}
          trend={predictions.predictedGrowth}
          description="Predicted monthly growth rate"
        />
      </div>

      <div className="prediction-grid">
        <Card 
          className="span-full"
          title="Revenue Forecast"
          subtitle="Historical and predicted revenue trends"
        >
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={predictions.revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b2b40" />
              <XAxis 
                dataKey="month" 
                stroke={COLORS.gray}
                tick={{ fill: COLORS.gray }}
              />
              <YAxis 
                stroke={COLORS.gray}
                tick={{ fill: COLORS.gray }}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 45, 0.98)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={COLORS.primary}
                fill="url(#colorRevenue)"
                name="Actual Revenue"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke={COLORS.secondary}
                strokeDasharray="5 5"
                name="Predicted Revenue"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveBilling; 