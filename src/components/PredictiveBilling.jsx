import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PredictiveBilling.css';

const PredictiveBilling = ({ items }) => {
  // Calculate monthly totals
  const monthlyData = items.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleString('default', { month: 'long' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += item.total;
    return acc;
  }, {});

  // Convert to array format for chart
  const chartData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
    predicted: total * 1.1 // Simple prediction: 10% increase
  }));

  return (
    <div className="predictive-billing-container">
      <h2>Billing Analytics</h2>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8" 
              name="Actual Amount"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#82ca9d" 
              name="Predicted Amount"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="predictions-summary">
        <h3>Monthly Predictions</h3>
        <div className="prediction-cards">
          {chartData.map((data, index) => (
            <div key={index} className="prediction-card">
              <h4>{data.month}</h4>
              <p>Actual: ₹{data.total.toFixed(2)}</p>
              <p>Predicted: ₹{data.predicted.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveBilling; 