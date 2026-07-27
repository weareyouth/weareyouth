import React, { useState, useEffect } from 'react';
import './DonationModal.css';

/**
 * QR Code & UPI Donation Workflow
 * ──────────────────────────────
 * This allows donors to pay directly using any UPI App (GPay, PhonePe, Paytm, BHIM)
 * by scanning a dynamically generated QR Code containing the chosen donation amount.
 * 
 * After scanning, the donor enters their 12-digit transaction ID / UPI Ref Number.
 * The submission goes to the Admin Dashboard for verification and approval.
 */
const UPI_ID = 'UJJ83981816499@Ujjivan'; // Foundation UPI ID
const PAYEE_NAME = 'We Are Youth Foundation';

const DonationModal = ({ isOpen, onClose, campaigns, initialCampaignId, onAddDonationSubmission }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = QR code scanner, 3 = success
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCampaignId) {
      setCampaignId(initialCampaignId);
    } else if (campaigns && campaigns.length > 0) {
      setCampaignId(campaigns[0].id);
    }
    // Reset inputs when modal opens
    if (isOpen) {
      setStep(1);
      setTransactionId('');
    }
  }, [initialCampaignId, campaigns, isOpen]);

  if (!isOpen) return null;

  const getFinalAmount = () => {
    return amount === 'custom' ? parseInt(customAmount) : parseInt(amount);
  };

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount('custom');
  };

  const getSelectedCampaign = () => {
    return campaigns.find(c => c.id === parseInt(campaignId)) || campaigns[0];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!donorName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!donorEmail.trim()) {
      alert('Please enter your email');
      return;
    }
    if (!donorPhone.trim()) {
      alert('Please enter your phone number');
      return;
    }
    setStep(2); // Go to QR Code Scanner step
  };

  const handlePaymentVerification = (e) => {
    e.preventDefault();
    if (!transactionId.trim() || transactionId.length !== 12 || isNaN(transactionId)) {
      alert('Please enter a valid 12-digit UPI Reference Number / Transaction ID');
      return;
    }

    setIsSubmitting(true);

    // Simulate verification submit network delay
    setTimeout(() => {
      const selectedCampaign = getSelectedCampaign();
      onAddDonationSubmission({
        id: Date.now(),
        donorName,
        email: donorEmail,
        phone: donorPhone,
        amount: getFinalAmount(),
        campaignTitle: selectedCampaign ? selectedCampaign.title : 'General Fund',
        transactionId: transactionId.trim(),
        status: 'Pending',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      setIsSubmitting(false);
      setStep(3); // Show success screen
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const campaign = getSelectedCampaign();
  const finalAmount = getFinalAmount();

  // Generate standard UPI payload link
  const upiPayload = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent('Donation ' + (campaign ? campaign.title : ''))}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(upiPayload)}`;

  return (
    <div className="donation-modal-overlay" onClick={handleClose}>
      <div className="donation-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>&times;</button>

        {/* ──── STEP 1: Donation Info Form ──── */}
        {step === 1 && (
          <>
            <div className="modal-icon">💝</div>
            <h2>Make a Donation</h2>
            <p>Your contribution helps us create a better world for youth everywhere.</p>

            <form onSubmit={handleFormSubmit} className="donation-form">
              <div className="form-group">
                <label>Select Campaign</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  required
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Select Amount (₹)</label>
                <div className="amount-options">
                  {['500', '1000', '2500', '5000'].map(val => (
                    <button
                      type="button"
                      key={val}
                      className={`amount-btn ${amount === val ? 'active' : ''}`}
                      onClick={() => handleAmountClick(val)}
                    >
                      ₹{parseInt(val).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="custom-amount-wrapper">
                  <span className="currency-symbol">₹</span>
                  <input
                    type="number"
                    placeholder="Custom Amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    onFocus={() => setAmount('custom')}
                    className="custom-amount-input"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Rohan Varma"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="rohan@example.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 80903 34855"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  required
                />
              </div>

              {/* Payment Summary */}
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Campaign</span>
                  <span className="summary-value">{campaign?.title}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Donation</span>
                  <span className="summary-value summary-amount">
                    ₹{(finalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Continue to Payment ➔
              </button>

              <div className="payment-trust">
                <span className="trust-badge">🛡️ Secure UPI Payment Portal</span>
              </div>
            </form>
          </>
        )}

        {/* ──── STEP 2: UPI QR Code & Verification Input ──── */}
        {step === 2 && (
          <div className="qr-donation-section">
            <div className="modal-icon" style={{ fontSize: '32px', marginBottom: '8px' }}>📲</div>
            <h2>Scan QR to Donate</h2>
            <p className="qr-helper-text">
              Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
            </p>

            <div className="qr-container-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div className="ujjivan-pay-header" style={{
                background: '#044343', /* Dark teal green matching Ujjivan Pay */
                color: 'white',
                padding: '12px 16px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                letterSpacing: '1px',
                gap: '4px',
                fontFamily: 'sans-serif'
              }}>
                <span style={{ color: '#f97316' }}>UJJIVAN</span>
                <span style={{ color: '#ffffff' }}>PAY</span>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div className="qr-amount-header">
                  <span className="qr-amount-title">Donation Amount</span>
                  <span className="qr-amount-value">₹{finalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="qr-wrapper">
                  <img src={qrCodeUrl} alt="UPI QR Code" className="upi-qr-image" />
                  <span className="qr-scan-badge">Scan & Pay</span>
                </div>

                <div className="upi-info-details">
                  <div>
                    <span className="info-label">Payee:</span>
                    <span className="info-value">{PAYEE_NAME}</span>
                  </div>
                  <div>
                    <span className="info-label">UPI ID:</span>
                    <span className="info-value" style={{ textTransform: 'none' }}>{UPI_ID}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentVerification} className="verification-form">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  Enter UPI Ref No. / Transaction ID *
                </label>
                <input
                  type="text"
                  maxLength="12"
                  placeholder="Enter 12-digit number (e.g. 518392018374)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, ''))} // numbers only
                  required
                  style={{ textAlign: 'center', letterSpacing: '2px', fontSize: '15px' }}
                />
                <small className="help-text">
                  Usually found in your transaction details screen after a successful payment.
                </small>
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}></span>
                    Submitting...
                  </>
                ) : (
                  'Confirm & Submit Donation'
                )}
              </button>

              <div className="qr-actions">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)} disabled={isSubmitting}>
                  ◀ Back
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ──── STEP 3: Verification Success Receipt ──── */}
        {step === 3 && (
          <div className="payment-status success">
            <div className="status-animation">
              <div className="success-checkmark">
                <div className="check-icon">✓</div>
              </div>
            </div>
            <h2>Donation Submitted! 🎉</h2>
            <p>Thank you! Your transaction details have been logged for verification.</p>

            <div className="receipt-card">
              <div className="receipt-row">
                <span className="receipt-label">Amount</span>
                <span className="receipt-value receipt-amount">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Campaign</span>
                <span className="receipt-value">{campaign?.title}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Ref ID</span>
                <span className="receipt-value receipt-id" style={{ letterSpacing: '1px' }}>{transactionId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Donor</span>
                <span className="receipt-value">{donorName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status</span>
                <span className="receipt-value" style={{ color: '#d97706', fontWeight: 'bold' }}>Pending Verification</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Date</span>
                <span className="receipt-value">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <p className="receipt-note" style={{ fontSize: '13px', color: 'var(--text-gray)', margin: '15px 0' }}>
              Once our finance team verifies the Reference ID, the donation will be approved and campaign progress will reflect your contribution.
            </p>

            <button className="btn btn-primary submit-btn" onClick={handleClose}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
