const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Server error occurred'
    }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const fetchWithTimeout = (url, options = {}) => {
  const timeout = 5000; // 5 seconds timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(url, {
    ...options,
    signal: controller.signal
  })
    .finally(() => clearTimeout(id));
};

// Bills API
const billsApi = {
  fetchAll: async () => {
    try {
      console.log('Attempting to fetch bills...');
      const response = await fetch(`${API_URL}/bills`);
      console.log('Response received:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error in billsApi.fetchAll:', error);
      throw error;
    }
  },
  add: async (bill) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/bills/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error adding bill:', error);
      throw new Error('Failed to add bill. Please try again later.');
    }
  }
};

// Inventory API
const inventoryApi = {
  fetchAll: async () => {
    try {
      console.log('Attempting to fetch inventory...');
      const response = await fetch(`${API_URL}/inventory`);
      console.log('Response received:', response.status);
      return handleResponse(response);
    } catch (error) {
      console.error('Error in inventoryApi.fetchAll:', error);
      throw error;
    }
  },
  update: (item) => 
    fetch(`${API_URL}/inventory/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).then(handleResponse)
};

// IoT API
const iotApi = {
  addReading: (reading) => fetch(`${API_URL}/iot/reading`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reading)
  }).then(res => res.json())
};

// Rewards API
const rewardsApi = {
  getCustomerRewards: (customerId) => 
    fetch(`${API_URL}/rewards/customer/${customerId}`).then(res => res.json()),
  addPoints: (data) => fetch(`${API_URL}/rewards/add-points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
};

// Transactions API
const transactionsApi = {
  fetchAll: () => fetch(`${API_URL}/transactions`).then(res => res.json()),
  add: (transaction) => fetch(`${API_URL}/transactions/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  }).then(res => res.json())
};

// Analytics API
const analyticsApi = {
  getDashboard: () => fetch(`${API_URL}/analytics/dashboard`).then(res => res.json())
};

// Export all APIs as a single object and individual APIs
export {
  billsApi,
  inventoryApi,
  iotApi,
  rewardsApi,
  transactionsApi,
  analyticsApi,
  // Export combined api object
  /*api: {
    bills: billsApi,
    inventory: inventoryApi,
    iot: iotApi,
    rewards: rewardsApi,
    transactions: transactionsApi,
    analytics: analyticsApi
  }*/
}; 