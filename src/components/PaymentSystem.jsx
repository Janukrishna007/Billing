import React, { useState } from 'react';
import './PaymentSystem.css';

const PaymentSystem = ({ amount, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePayment = () => {
    switch (paymentMethod) {
      case 'card':
        return paymentDetails.cardNumber && 
               paymentDetails.expiryDate && 
               paymentDetails.cvv;
      case 'upi':
        return paymentDetails.upiId;
      case 'bank':
        return paymentDetails.bankName && 
               paymentDetails.accountNumber;
      default:
        return false;
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validatePayment()) {
      alert('Please fill all required fields');
      return;
    }

    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('completed');
      
      // Wait a moment to show success message before closing
      setTimeout(() => {
        onPaymentComplete && onPaymentComplete({
          method: paymentMethod,
          amount: amount,
          timestamp: new Date().toISOString(),
          status: 'success'
        });
      }, 1500);
      
    } catch (error) {
      setPaymentStatus('error');
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="payment-system">
      <div className="payment-header">
        <h2>Payment Details</h2>
        <div className="amount-display">
          Amount to Pay: {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
          }).format(amount)}
        </div>
      </div>

      <div className="payment-methods">
        <button 
          className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          💳 Card
        </button>
        <button 
          className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('upi')}
        >
          📱 UPI
        </button>
        <button 
          className={`method-btn ${paymentMethod === 'bank' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('bank')}
        >
          🏦 Net Banking
        </button>
      </div>

      <form onSubmit={handlePayment} className="payment-form">
        {paymentMethod === 'card' && (
          <div className="payment-fields">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                maxLength="16"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="payment-fields">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                name="upiId"
                placeholder="username@upi"
                value={paymentDetails.upiId}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        {paymentMethod === 'bank' && (
          <div className="payment-fields">
            <div className="form-group">
              <label>Bank Name</label>
              <select
                name="bankName"
                value={paymentDetails.bankName}
                onChange={handleInputChange}
              >
                <option value="">Select Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter account number"
                value={paymentDetails.accountNumber}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          className={`pay-button ${paymentStatus}`}
          disabled={paymentStatus === 'processing'}
        >
          {paymentStatus === 'processing' ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {paymentStatus === 'completed' && (
        <div className="payment-success">
          <div className="success-icon">✅</div>
          <h3>Payment Successful!</h3>
          <p>Thank you for your payment.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSystem; 