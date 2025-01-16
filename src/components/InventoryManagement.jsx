import { useState, useEffect } from 'react';
import { FaBoxes, FaExclamationTriangle, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import './InventoryManagement.css';

const InventoryManagement = ({ items, predefinedItems }) => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Calculate inventory levels and generate alerts
  useEffect(() => {
    const calculateInventory = () => {
      const newInventory = predefinedItems.map(item => {
        // Count sold items
        const soldQuantity = items
          .filter(sale => sale.itemNumber === item.id)
          .reduce((total, sale) => total + sale.quantity, 0);

        // Simulate initial stock (you would get this from your database)
        const initialStock = 100;
        const currentStock = initialStock - soldQuantity;
        const reorderPoint = 20; // Threshold for reorder alert

        // Calculate daily sales rate
        const last30DaysSales = items
          .filter(sale => 
            sale.itemNumber === item.id && 
            new Date(sale.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          )
          .reduce((total, sale) => total + sale.quantity, 0);
        
        const dailySalesRate = last30DaysSales / 30;

        return {
          ...item,
          currentStock,
          reorderPoint,
          dailySalesRate,
          estimatedDaysLeft: dailySalesRate > 0 ? Math.round(currentStock / dailySalesRate) : null,
          status: currentStock <= reorderPoint ? 'low' : 'normal'
        };
      });

      setInventory(newInventory);

      // Generate alerts
      const newAlerts = newInventory
        .filter(item => item.status === 'low')
        .map(item => ({
          id: item.id,
          name: item.name,
          type: 'reorder',
          message: `Low stock alert: ${item.name} (${item.currentStock} units left)`,
          daysLeft: item.estimatedDaysLeft
        }));

      setAlerts(newAlerts);
    };

    calculateInventory();
  }, [items, predefinedItems]);

  return (
    <div className="inventory-management-container">
      <div className="inventory-header">
        <h2>Inventory Management</h2>
        <div className="alert-summary">
          <span className="alert-count">
            {alerts.length} Active Alerts
          </span>
        </div>
      </div>

      <div className="inventory-grid">
        {inventory.map(item => (
          <div key={item.id} className={`inventory-card ${item.status}`}>
            <div className="inventory-card-header">
              <FaBoxes className="inventory-icon" />
              <span className={`status-badge ${item.status}`}>
                {item.status === 'low' ? 'Low Stock' : 'In Stock'}
              </span>
            </div>
            <h3>{item.name}</h3>
            <div className="inventory-details">
              <p>Current Stock: {item.currentStock} units</p>
              <p>Daily Sales: {item.dailySalesRate.toFixed(1)} units</p>
              {item.estimatedDaysLeft && (
                <p className={item.estimatedDaysLeft < 7 ? 'warning' : ''}>
                  Estimated Days Left: {item.estimatedDaysLeft}
                </p>
              )}
            </div>
            <div className="stock-indicator">
              <div 
                className="stock-level" 
                style={{ 
                  width: `${Math.min((item.currentStock / 100) * 100, 100)}%`,
                  backgroundColor: item.status === 'low' ? '#ef4444' : '#22c55e'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Inventory Alerts</h3>
          <div className="alerts-container">
            {alerts.map((alert, index) => (
              <div key={index} className="alert-card">
                <FaExclamationTriangle className="alert-icon" />
                <div className="alert-content">
                  <p>{alert.message}</p>
                  <p className="alert-detail">
                    {alert.daysLeft 
                      ? `Estimated to run out in ${alert.daysLeft} days`
                      : 'Requires immediate attention'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement; 