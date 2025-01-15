import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AnalyticsDashboard = ({ items }) => {
  // Calculate spending heatmap data
  const spendingHeatmap = useMemo(() => {
    const monthlyData = items.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          total: 0,
          intensity: 0
        };
      }
      acc[monthYear].total += item.total;
      return acc;
    }, {});

    // Calculate intensity (0-1) based on spending amounts
    const maxSpending = Math.max(...Object.values(monthlyData).map(d => d.total));
    return Object.values(monthlyData).map(data => ({
      ...data,
      intensity: data.total / maxSpending
    }));
  }, [items]);

  // Calculate predictive analytics
  const predictiveAnalytics = useMemo(() => {
    const monthlyTotals = items.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += item.total;
      return acc;
    }, {});

    const monthlyData = Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      actual: total,
      predicted: total * (1 + calculateTrend(monthlyTotals))
    }));

    // Predict next 3 months
    const lastMonth = monthlyData[monthlyData.length - 1];
    const trend = calculateTrend(monthlyTotals);
    
    for (let i = 1; i <= 3; i++) {
      const predictedValue = lastMonth.actual * (1 + trend * i);
      monthlyData.push({
        month: `Forecast ${i}`,
        predicted: predictedValue,
        isForecast: true
      });
    }

    return monthlyData;
  }, [items]);

  // Category breakdown with recommendations
  const categoryAnalysis = useMemo(() => {
    const analysis = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          total: 0,
          count: 0,
          avgSpending: 0,
          trend: 0
        };
      }
      acc[item.category].total += item.total;
      acc[item.category].count += 1;
      acc[item.category].avgSpending = acc[item.category].total / acc[item.category].count;
      return acc;
    }, {});

    // Calculate recommendations
    return Object.entries(analysis).map(([category, data]) => ({
      category,
      ...data,
      recommendation: generateRecommendation(category, data)
    }));
  }, [items]);

  // Helper functions
  function calculateTrend(monthlyTotals) {
    const values = Object.values(monthlyTotals);
    if (values.length < 2) return 0;
    const change = (values[values.length - 1] - values[0]) / values[0];
    return change / values.length;
  }

  function generateRecommendation(category, data) {
    const avgPerTransaction = data.total / data.count;
    if (avgPerTransaction > 5000) {
      return `High spending detected in ${category}. Consider setting a budget.`;
    } else if (data.count > 10) {
      return `Frequent ${category} purchases. Look for bulk buying opportunities.`;
    }
    return `Spending in ${category} is within normal range.`;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="analytics-dashboard">
      {/* Spending Heatmap Section */}
      <div className="dashboard-section">
        <h2>Spending Heatmap</h2>
        <div className="heatmap-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingHeatmap}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar 
                dataKey="total" 
                fill="#8884d8" 
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictive Analytics Section */}
      <div className="dashboard-section">
        <h2>Spending Predictions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={predictiveAnalytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Analysis Section */}
      <div className="dashboard-section">
        <h2>Category Breakdown</h2>
        <div className="category-analysis">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryAnalysis}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="recommendations">
            <h3>Saving Recommendations</h3>
            {categoryAnalysis.map((cat, index) => (
              <div key={index} className="recommendation-card">
                <h4>{cat.category}</h4>
                <p>Total Spent: ₹{cat.total.toFixed(2)}</p>
                <p>Average per Transaction: ₹{cat.avgSpending.toFixed(2)}</p>
                <p className="recommendation-text">{cat.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;