import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './PaymentGateway.css';

function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestId, requestData, amount, paymentType, requestCode, serviceDates, isNewRequest } = location.state || {};

  const [stage, setStage] = useState('review'); // review → processing → success
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [finalRequestCode, setFinalRequestCode] = useState(requestCode);
  const [error, setError] = useState('');

  // Redirect if no state passed
  useEffect(() => {
    if (!amount) navigate('/family');
  }, [amount, navigate]);

  const handlePay = async () => {
    setError('');
    setStage('processing');

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        if (isNewRequest) {
          // Create request first, then mark payment as done
          const res = await api.post('/family/requests', requestData);
          const request = res.data;
          
          // Now pay advance
          const paymentRes = await api.post(`/family/requests/${request.id}/pay-advance`);
          setTransactionId(paymentRes.data.transaction_id);
          setFinalRequestCode(request.request_code);
        } else {
          // Existing request - use unified payment endpoint
          const res = await api.post(`/family/requests/${requestId}/payment`, {
            payment_type: paymentType
          });
          setTransactionId(res.data.advance_transaction_id || res.data.final_transaction_id || 'TXN-' + Date.now());
        }
        setStage('success');
      } catch (err) {
        console.error('Payment error:', err);
        setStage('review');
        setError(err.response?.data?.error || 'Payment failed. Please try again.');
      }
    }, 1500);
  };

  const handleCancel = () => navigate('/family');

  const formatCard = (val) => {
    return val.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g,'').substring(0,4);
    return clean.length >= 2 ? clean.substring(0,2) + '/' + clean.substring(2) : clean;
  };

  if (stage === 'processing') {
    return (
      <div className="pg-overlay">
        <div className="pg-processing">
          <div className="pg-spinner"></div>
          <h3>Processing Payment...</h3>
          <p>Please do not close this window</p>
          <p className="pg-amount-processing">₹{amount?.toLocaleString('en-IN')}</p>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="pg-overlay">
        <div className="pg-success">
          <div className="pg-success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p className="pg-success-amount">₹{amount?.toLocaleString('en-IN')}</p>
          <div className="pg-receipt">
            <div className="pg-receipt-row">
              <span>Transaction ID</span>
              <span>{transactionId}</span>
            </div>
            {finalRequestCode && (
              <div className="pg-receipt-row">
                <span>Request Code</span>
                <span>{finalRequestCode}</span>
              </div>
            )}
            <div className="pg-receipt-row">
              <span>Payment Type</span>
              <span>{paymentType === 'advance' ? '50% Advance' : '50% Final Payment'}</span>
            </div>
            <div className="pg-receipt-row">
              <span>Status</span>
              <span className="pg-paid-badge">PAID</span>
            </div>
          </div>
          {paymentType === 'advance' ? (
            <p className="pg-next-info">✅ Your caretaker request has been submitted. Admin will assign your caretaker shortly.</p>
          ) : (
            <p className="pg-next-info">✅ Service marked as complete. Thank you for choosing ElderCare!</p>
          )}
          <button className="pg-btn-primary" onClick={() => navigate('/family')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pg-overlay">
      <div className="pg-container">

        {/* Header */}
        <div className="pg-header">
          <div className="pg-logo">🛡️ ElderCare</div>
          <div className="pg-secure-badge">🔒 Secure Payment</div>
        </div>

        {/* Order Summary */}
        <div className="pg-summary">
          <div className="pg-summary-label">
            {paymentType === 'advance' ? '50% Advance Payment' : '50% Final Payment'}
          </div>
          {finalRequestCode && <div className="pg-summary-detail">Request: {finalRequestCode}</div>}
          {!finalRequestCode && isNewRequest && <div className="pg-summary-detail">New Service Request</div>}
          {serviceDates && <div className="pg-summary-detail">Service: {serviceDates}</div>}
          <div className="pg-summary-amount">₹{amount?.toLocaleString('en-IN')}</div>
          {paymentType === 'advance' && (
            <div className="pg-summary-note">Remaining 50% to be paid after service completion</div>
          )}
        </div>

        {/* Payment Method Selector */}
        <div className="pg-methods">
          <button
            className={`pg-method-btn ${selectedMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('upi')}>
            📱 UPI
          </button>
          <button
            className={`pg-method-btn ${selectedMethod === 'card' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('card')}>
            💳 Card
          </button>
          <button
            className={`pg-method-btn ${selectedMethod === 'netbanking' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('netbanking')}>
            🏦 Net Banking
          </button>
        </div>

        {/* UPI Form */}
        {selectedMethod === 'upi' && (
          <div className="pg-form">
            <label>UPI ID</label>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              className="pg-input"
            />
            <div className="pg-upi-apps">
              <span>Pay using:</span>
              <div className="pg-upi-icons">
                <span className="pg-upi-app">GPay</span>
                <span className="pg-upi-app">PhonePe</span>
                <span className="pg-upi-app">Paytm</span>
                <span className="pg-upi-app">BHIM</span>
              </div>
            </div>
          </div>
        )}

        {/* Card Form */}
        {selectedMethod === 'card' && (
          <div className="pg-form">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={e => setCardNumber(formatCard(e.target.value))}
              className="pg-input"
              maxLength={19}
            />
            <div className="pg-form-row">
              <div>
                <label>Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                  className="pg-input"
                  maxLength={5}
                />
              </div>
              <div>
                <label>CVV</label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value.replace(/\D/,'').substring(0,3))}
                  className="pg-input"
                  maxLength={3}
                />
              </div>
            </div>
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="Name on card"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              className="pg-input"
            />
          </div>
        )}

        {/* Net Banking */}
        {selectedMethod === 'netbanking' && (
          <div className="pg-form">
            <label>Select Your Bank</label>
            <div className="pg-bank-grid">
              {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'BOB'].map(bank => (
                <div key={bank} className="pg-bank-option">{bank}</div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="pg-error">{error}</div>}

        {/* Action Buttons */}
        <div className="pg-actions">
          <button className="pg-btn-primary" onClick={handlePay}>
            Pay ₹{amount?.toLocaleString('en-IN')}
          </button>
          <button className="pg-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        <div className="pg-footer-note">
          🔒 Your payment is encrypted and secure. ElderCare does not store card details.
        </div>

      </div>
    </div>
  );
}

export default PaymentGateway;
