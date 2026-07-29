import React, { useState, useEffect } from 'react';
import './DonationModal.css';

/**
 * Razorpay Donation Workflow
 * ──────────────────────────────
 * Step 1 → Donor fills in name, email, phone, amount, campaign.
 * Step 2 → Razorpay Checkout popup opens automatically.
 *           On success  → payment_id is captured → saved to Supabase → Step 3 (receipt).
 *           On dismiss  → donor is returned to Step 1.
 *
 * Requirements:
 *   • Razorpay JS SDK loaded in index.html:
 *       <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 *   • VITE_RAZORPAY_KEY_ID set in .env.local  (test key starts with rzp_test_…)
 */

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const PAYEE_NAME      = 'We Are Youth Foundation';

const DonationModal = ({
  isOpen,
  onClose,
  campaigns,
  initialCampaignId,
  onProcessDonation,
  onAddDonationSubmission,
}) => {
  const [step, setStep]               = useState(1); // 1=form  2=processing  3=success
  const [amount, setAmount]           = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [campaignId, setCampaignId]   = useState('');
  const [donorName, setDonorName]     = useState('');
  const [donorEmail, setDonorEmail]   = useState('');
  const [donorPhone, setDonorPhone]   = useState('');
  const [paymentId, setPaymentId]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── sync campaign selection with parent ── */
  useEffect(() => {
    if (initialCampaignId) {
      setCampaignId(initialCampaignId);
    } else if (campaigns && campaigns.length > 0) {
      setCampaignId(campaigns[0].id);
    }
    if (isOpen) {
      setStep(1);
      setPaymentId('');
    }
  }, [initialCampaignId, campaigns, isOpen]);

  if (!isOpen) return null;

  /* ── helpers ── */
  const getFinalAmount = () =>
    amount === 'custom' ? parseInt(customAmount) || 0 : parseInt(amount) || 0;

  const getSelectedCampaign = () =>
    campaigns.find(c => c.id === parseInt(campaignId)) || campaigns[0];

  /* ── Step 1 submit ── */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalAmount = getFinalAmount();
    if (!finalAmount || finalAmount <= 0)    { alert('Please enter a valid amount'); return; }
    if (!donorName.trim())                   { alert('Please enter your name'); return; }
    if (!donorEmail.trim())                  { alert('Please enter your email'); return; }
    if (!donorPhone.trim())                  { alert('Please enter your phone number'); return; }
    openRazorpay();
  };

  /* ── Launch Razorpay Checkout ── */
  const openRazorpay = () => {
    const finalAmount = getFinalAmount();
    const campaign    = getSelectedCampaign();

    if (!window.Razorpay) {
      alert('Payment gateway failed to load. Please refresh the page and try again.');
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      alert('Razorpay Key ID is not configured. Please add VITE_RAZORPAY_KEY_ID to your .env.local file.');
      return;
    }

    setStep(2); // show "Processing…" overlay while Razorpay popup loads

    const options = {
      key:          RAZORPAY_KEY_ID,
      amount:       finalAmount * 100,          // Razorpay expects paise
      currency:     'INR',
      name:         PAYEE_NAME,
      description:  `Donation – ${campaign?.title || 'General Fund'}`,
      image:        '/src/assets/spareLogo.png',

      // ── Prefill donor info ──
      prefill: {
        name:    donorName,
        email:   donorEmail,
        contact: donorPhone,
      },

      notes: {
        campaign_title: campaign?.title || 'General Fund',
        campaign_id:    campaign?.id || '',
      },

      theme: { color: '#16a34a' },

      modal: {
        backdropclose: false,
        escape:        false,
        ondismiss: () => {
          // Donor closed the popup without paying → return to form
          setStep(1);
        },
      },

      // ── On successful payment ──
      handler: async (response) => {
        const pid = response.razorpay_payment_id;
        setPaymentId(pid);
        await saveAndComplete(pid, campaign, finalAmount);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      console.error('Razorpay payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      setStep(1);
    });
    rzp.open();
  };

  /* ── Save to Supabase and update campaign progress ── */
  const saveAndComplete = async (pid, campaign, finalAmount) => {
    setIsSubmitting(true);
    try {
      await onAddDonationSubmission({
        id:            Date.now(),
        donorName,
        email:         donorEmail,
        phone:         donorPhone,
        amount:        finalAmount,
        campaignTitle: campaign?.title || 'General Fund',
        transactionId: pid,      // razorpay_payment_id stored as transactionId
        status:        'Verified',
        date:          new Date().toLocaleDateString('en-IN', {
                         day: 'numeric', month: 'short', year: 'numeric',
                       }),
      });

      // Update campaign funded amount
      if (campaign?.id && onProcessDonation) {
        await onProcessDonation(campaign.id, finalAmount);
      }
    } catch (err) {
      console.error('Error saving donation:', err);
    } finally {
      setIsSubmitting(false);
      setStep(3); // show receipt
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const campaign    = getSelectedCampaign();
  const finalAmount = getFinalAmount();

  /* ════════════════════════════════════════════ RENDER ════════════════════════════════════════════ */
  return (
    <div className="donation-modal-overlay" onClick={step === 1 ? handleClose : undefined}>
      <div className="donation-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>&times;</button>

        {/* ──── STEP 1: Donation Info Form ──── */}
        {step === 1 && (
          <>
            <div className="modal-icon">💝</div>
            <h2>Make a Donation</h2>
            <p>Your contribution helps us create a better world for youth everywhere.</p>

            <form onSubmit={handleFormSubmit} className="donation-form">
              {/* Campaign selector */}
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

              {/* Amount picker */}
              <div className="form-group">
                <label>Select Amount (₹)</label>
                <div className="amount-options">
                  {['500', '1000', '2500', '5000'].map(val => (
                    <button
                      type="button"
                      key={val}
                      className={`amount-btn ${amount === val ? 'active' : ''}`}
                      onClick={() => { setAmount(val); setCustomAmount(''); }}
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
                    onChange={(e) => { setCustomAmount(e.target.value); setAmount('custom'); }}
                    onFocus={() => setAmount('custom')}
                    className="custom-amount-input"
                    min="1"
                  />
                </div>
              </div>

              {/* Donor info */}
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
                  placeholder="+91 98765 43210"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  required
                />
              </div>

              {/* Summary */}
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
                Proceed to Pay ➔
              </button>

              <div className="payment-trust">
                <span className="trust-badge">🔒 Secured by Razorpay</span>
              </div>
            </form>
          </>
        )}

        {/* ──── STEP 2: Processing / Razorpay popup open ──── */}
        {step === 2 && (
          <div className="payment-status processing" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="modal-icon" style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2>Opening Payment Gateway…</h2>
            <p style={{ color: 'var(--text-gray)', marginTop: '8px' }}>
              Complete the payment in the Razorpay window.<br />
              Do not close or refresh this page.
            </p>
            <div style={{ marginTop: '32px' }}>
              <div className="spinner" style={{
                width: '40px', height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #16a34a',
                borderRadius: '50%',
                animation: 'spin 0.9s linear infinite',
                margin: '0 auto',
              }} />
            </div>
            <button
              className="btn btn-outline"
              onClick={() => setStep(1)}
              style={{ marginTop: '32px' }}
            >
              ◀ Cancel & Go Back
            </button>
          </div>
        )}

        {/* ──── STEP 3: Success Receipt ──── */}
        {step === 3 && (
          <div className="payment-status success">
            <div className="status-animation">
              <div className="success-checkmark">
                <div className="check-icon">✓</div>
              </div>
            </div>
            <h2>Payment Successful! 🎉</h2>
            <p>Thank you, {donorName}! Your donation has been confirmed.</p>

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
                <span className="receipt-label">Payment ID</span>
                <span className="receipt-value receipt-id" style={{ letterSpacing: '0.5px', fontSize: '12px' }}>
                  {paymentId}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Donor</span>
                <span className="receipt-value">{donorName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status</span>
                <span className="receipt-value" style={{ color: '#16a34a', fontWeight: 'bold' }}>
                  ✅ Confirmed
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Date</span>
                <span className="receipt-value">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <p className="receipt-note" style={{ fontSize: '13px', color: 'var(--text-gray)', margin: '15px 0' }}>
              A confirmation email has been sent to <strong>{donorEmail}</strong>. The campaign progress will update shortly.
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
