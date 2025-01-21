import { useState, useEffect } from 'react';
import { billsApi } from '../../services/api';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting bills fetch...');
        const data = await billsApi.fetchAll();
        console.log('Bills received:', data);
        setBills(data);
      } catch (err) {
        console.error('Error in BillsList:', err);
        setError(err.message || 'Failed to load bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Bills</h2>
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map(bill => (
              <tr key={bill._id}>
                <td>{bill.customerId}</td>
                <td>${bill.amount}</td>
                <td>{bill.status}</td>
                <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillsList; 