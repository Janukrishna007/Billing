import { useState, useEffect } from 'react';
import { inventoryApi } from '../../services/api';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const data = await inventoryApi.fetchAll();
        setInventory(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch inventory:', err);
        setError('Failed to load inventory. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const updated = await inventoryApi.update({
        id,
        quantity: newQuantity
      });
      setInventory(inventory.map(item => 
        item._id === updated._id ? updated : item
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading inventory...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h2>Inventory</h2>
      {inventory.length === 0 ? (
        <p>No inventory items found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item._id}>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
                <td>
                  <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>
                    +
                  </button>
                  <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>
                    -
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryList; 