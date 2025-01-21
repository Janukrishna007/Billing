import { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await analyticsApi.getDashboard();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bills</h3>
          <p>{stats.totalBills}</p>
        </div>
        <div className="stat-card">
          <h3>Paid Bills</h3>
          <p>{stats.paidBills}</p>
        </div>
        <div className="stat-card">
          <h3>Overdue Bills</h3>
          <p>{stats.overdueBills}</p>
        </div>
        <div className="stat-card">
          <h3>Total Amount</h3>
          <p>${stats.totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 