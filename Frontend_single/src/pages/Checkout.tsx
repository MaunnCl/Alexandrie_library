import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { planName } = (location.state as { planName?: string }) || {};

  // Mock payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cardNumber.trim().length < 12 || expiryDate.trim() === '' || cvv.trim().length < 3) {
      setError('Please fill out all payment details correctly.');
      return;
    }
    navigate('/profile-creation', { state: { planName } });
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Payment Details</h1>
        <p className="checkout-subtitle">
          You have selected the <strong>{planName || 'No Plan Selected'}</strong> plan.
        </p>

        {error && <p className="checkout-error">{error}</p>}

        <form className="checkout-form" onSubmit={handlePaymentSubmit}>
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
          />

          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/YY"
          />

          <label htmlFor="cvv">CVV</label>
          <input
            type="password"
            id="cvv"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
          />

          <button type="submit" className="checkout-button">
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
