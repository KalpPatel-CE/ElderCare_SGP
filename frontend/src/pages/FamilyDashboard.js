import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';
import SlidePanel from '../components/SlidePanel';
import VitalsGrid from '../components/VitalsGrid';
import AppointmentEntry from '../components/AppointmentEntry';
import './FamilyDashboard.css';

function FamilyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [elder, setElder] = useState(null);
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [baselineVitals, setBaselineVitals] = useState(null);
  const [requests, setRequests] = useState([]);
  const [careLogs, setCareLogs] = useState([]);
  const [showElderPanel, setShowElderPanel] = useState(false);
  const [showMedicationPanel, setShowMedicationPanel] = useState(false);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showVitalsPanel, setShowVitalsPanel] = useState(false);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [appointments, setAppointments] = useState([]);
  // Payment modal state
  const [paymentModal, setPaymentModal] = useState(null); // { request, paymentType }
  const [payMethod, setPayMethod] = useState('upi');
  const [payProcessing, setPayProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState(null); // { txnId, amount, type }
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadData();
  }, []);

  // Re-fetch when returning from PaymentGateway
  useEffect(() => {
    if (location.state?.paymentCompleted) {
      loadData();
    }
  }, [location.key]);

  const loadData = async () => {
    try {
      // Use new optimized dashboard endpoint (1 API call instead of 6)
      const dashboardRes = await api.get('/family/dashboard');
      const data = dashboardRes.data;
      
      setElder(data.elder);
      setMedications(data.medications);
      setActivities(data.activities);
      setBaselineVitals(data.baseline_vitals);
      setRequests(data.requests);
      setCareLogs(data.care_logs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const saveElder = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await api.post('/family/elder', Object.fromEntries(formData));
      setElder(res.data);
      setShowElderPanel(false);
      loadData();
    } catch (err) {
      alert('Failed to save elder profile');
    }
  };

  const addMedication = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/family/medications', Object.fromEntries(formData));
      setShowMedicationPanel(false);
      loadData();
    } catch (err) {
      alert('Failed to add medication');
    }
  };

  const deleteMedication = async (id) => {
    if (!window.confirm('Delete this medication?')) return;
    try {
      await api.delete(`/family/medications/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const addActivity = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/family/activities', Object.fromEntries(formData));
      setShowActivityPanel(false);
      loadData();
    } catch (err) {
      alert('Failed to add activity');
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.delete(`/family/activities/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const saveBaselineVitals = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await api.post('/family/baseline-vitals', Object.fromEntries(formData));
      setBaselineVitals(res.data);
      setShowVitalsPanel(false);
      loadData();
    } catch (err) {
      alert('Failed to save vitals');
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.appointments = appointments;

    // Validate dates
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    
    if (endDate <= startDate) {
      alert('End date must be after start date');
      return;
    }

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
      alert('Service must be at least 1 day');
      return;
    }

    const totalAmount = days * 800;
    const advanceAmount = totalAmount / 2;

    const startFormatted = new Date(data.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const endFormatted = new Date(data.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    setShowRequestPanel(false);
    setAppointments([]);

    // Navigate to payment gateway with request data (not created yet)
    navigate('/payment', {
      state: {
        requestData: data,
        amount: advanceAmount,
        paymentType: 'advance',
        serviceDates: `${startFormatted} – ${endFormatted}`,
        isNewRequest: true
      }
    });
  };

  const renderOverview = () => (
    <>
      <section className="dashboard-section">
        <h3 className="section-label">YOUR ELDERS</h3>
        {!elder ? (
          <EmptyState message="No elders assigned to you yet. Please contact your administrator." />
        ) : (
          <div className="elder-cards-grid">
            <div className="elder-card">
              <div className="elder-card-header">
                <div className="elder-avatar">{elder.full_name?.charAt(0)}</div>
                <div className="elder-info">
                  <h4 className="elder-name">{elder.full_name}</h4>
                  <p className="elder-meta">{elder.age} years · Room {elder.room || 'N/A'}</p>
                </div>
              </div>
              <div className="elder-status">
                <StatusBadge status="completed">All clear today</StatusBadge>
              </div>
              <div className="elder-stats">
                <div className="elder-stat">
                  <div className="elder-stat-value">{activities.length}</div>
                  <div className="elder-stat-label">Events</div>
                </div>
                <div className="elder-stat">
                  <div className="elder-stat-value">{medications.filter(m => m.status === 'completed').length}</div>
                  <div className="elder-stat-label">Meds taken</div>
                </div>
                <div className="elder-stat">
                  <div className="elder-stat-value">0</div>
                  <div className="elder-stat-label">Alerts</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {elder && (
        <>
          <section className="dashboard-section">
            <h3 className="section-label">TODAY'S TIMELINE</h3>
            <div className="timeline-card">
              {medications.length === 0 && activities.length === 0 ? (
                <EmptyState message="No events scheduled for today" />
              ) : (
                <>
                  {medications.map((med, idx) => (
                    <div key={`med-${idx}`} className="timeline-row">
                      <div className="timeline-time">09:00</div>
                      <div className="timeline-icon timeline-icon-medication">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="4" y="4" width="8" height="8" rx="1" fill="var(--teal-600)"/>
                        </svg>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title">{med.medicine_name}</div>
                        <div className="timeline-subtitle">{med.dosage} · {med.frequency}</div>
                      </div>
                      <StatusBadge status={med.status || 'pending'}>{med.status || 'Pending'}</StatusBadge>
                    </div>
                  ))}
                  {activities.map((act, idx) => (
                    <div key={`act-${idx}`} className="timeline-row">
                      <div className="timeline-time">{act.preferred_time || '14:00'}</div>
                      <div className="timeline-icon timeline-icon-activity">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="4" fill="var(--gray-500)"/>
                        </svg>
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-title">{act.activity_name}</div>
                        <div className="timeline-subtitle">{act.duration_minutes} minutes</div>
                      </div>
                      <StatusBadge status="pending">Scheduled</StatusBadge>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          <section className="dashboard-section">
            <h3 className="section-label">ALERTS</h3>
            <EmptyState message="No alerts right now" />
          </section>
        </>
      )}
    </>
  );

  const renderCarePlan = () => (
    <>
      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">Elder profile</h3>
            <button className="btn-ghost" onClick={() => setShowElderPanel(true)}>
              {elder ? 'Edit' : 'Set up profile'}
            </button>
          </div>
          {!elder ? (
            <EmptyState message="No elder profile set up yet" />
          ) : (
            <div className="info-grid">
              <div className="info-item"><span className="info-label">Full name:</span> {elder.full_name}</div>
              <div className="info-item"><span className="info-label">Age:</span> {elder.age}</div>
              <div className="info-item"><span className="info-label">Gender:</span> {elder.gender}</div>
              <div className="info-item"><span className="info-label">Medical history:</span> {elder.medical_history || 'None'}</div>
              <div className="info-item"><span className="info-label">Allergies:</span> {elder.allergies || 'None'}</div>
              <div className="info-item"><span className="info-label">Emergency contact:</span> {elder.emergency_contact}</div>
              <div className="info-item"><span className="info-label">Emergency phone:</span> {elder.emergency_phone}</div>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">Medications</h3>
            <button className="btn-primary" onClick={() => setShowMedicationPanel(true)}>+ Add medication</button>
          </div>
          {medications.length === 0 ? (
            <EmptyState message="No medications added yet" />
          ) : (
            <div className="list-items">
              {medications.map(m => (
                <div key={m.id} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-title">{m.medicine_name}</div>
                    <div className="list-item-subtitle">{m.dosage} · {m.frequency}</div>
                    {m.instructions && <div className="list-item-pill">{m.instructions}</div>}
                  </div>
                  <button className="btn-icon-delete" onClick={() => deleteMedication(m.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">Preferred activities</h3>
            <button className="btn-primary" onClick={() => setShowActivityPanel(true)}>+ Add activity</button>
          </div>
          {activities.length === 0 ? (
            <EmptyState message="No activities added yet" />
          ) : (
            <div className="list-items">
              {activities.map(a => (
                <div key={a.id} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-title">{a.activity_name}</div>
                    <div className="list-item-subtitle">{a.preferred_time} · {a.duration_minutes} minutes</div>
                    {a.notes && <div className="list-item-pill">{a.notes}</div>}
                  </div>
                  <button className="btn-icon-delete" onClick={() => deleteActivity(a.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">Baseline vitals</h3>
            <button className="btn-ghost" onClick={() => setShowVitalsPanel(true)}>Update vitals</button>
          </div>
          {!baselineVitals ? (
            <EmptyState message="Baseline vitals not recorded yet" />
          ) : (
            <VitalsGrid vitals={baselineVitals} />
          )}
        </div>
      </section>
    </>
  );

  const openPaymentModal = (request, paymentType) => {
    setPaymentModal({ request, paymentType });
    setPayMethod('upi');
    setPaySuccess(null);
  };

  const closePaymentModal = () => {
    const wasSuccess = !!paySuccess;
    setPaymentModal(null);
    setPaySuccess(null);
    setPayProcessing(false);
    // Re-fetch from DB after successful payment to ensure UI matches backend
    if (wasSuccess) loadData();
  };

  const handleConfirmPayment = async () => {
    if (!paymentModal) return;
    setPayProcessing(true);
    const { request, paymentType } = paymentModal;
    try {
      const res = await api.post(`/family/requests/${request.id}/payment`, { payment_type: paymentType });
      const txnId = res.data.advance_transaction_id || res.data.final_transaction_id || 'TXN-' + Date.now();
      const amount = Number(request.total_amount) / 2;
      setPaySuccess({ txnId, amount, type: paymentType });
      // Update local state immediately
      setRequests(prev => prev.map(r => {
        if (r.id !== request.id) return r;
        return paymentType === 'advance'
          ? { ...r, advance_paid: true }
          : { ...r, final_paid: true };
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setPayProcessing(false);
    }
  };

  const renderServiceRequest = () => (
    <>
      <section className="dashboard-section">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">My service requests</h3>
            <button className="btn-primary" onClick={() => setShowRequestPanel(true)}>+ New request</button>
          </div>
          {requests.length === 0 ? (
            <EmptyState message="No service requests yet" />
          ) : (
            <div className="requests-list">
              {requests.map(r => {
                const startFormatted = new Date(r.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                const endFormatted = new Date(r.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                const advancePaid = r.advance_paid;
                const finalPaid = r.final_paid;
                const totalAmt = Number(r.total_amount) || 0;
                const halfAmt = totalAmt / 2;
                return (
                  <div key={r.id} className="request-card">
                    <div className="request-card-header">
                      <div>
                        <div className="request-code">{r.request_code}</div>
                        <div className="request-dates">{startFormatted} – {endFormatted}</div>
                      </div>
                      <StatusBadge status={r.status}>{r.status}</StatusBadge>
                    </div>
                    {r.caretaker_name && (
                      <div className="request-caretaker">
                        <strong>Caretaker:</strong> {r.caretaker_name} ({r.caretaker_city})
                      </div>
                    )}
                    {totalAmt > 0 && (
                      <>
                        <div className="payment-status-row">
                          <span className={`pay-badge ${advancePaid ? 'paid' : 'pending'}`}>
                            {advancePaid ? '✓ Advance Paid' : '⏳ Advance Pending'}
                          </span>
                          <span className={`pay-badge ${finalPaid ? 'paid' : 'pending'}`}>
                            {finalPaid ? '✓ Final Paid' : '⏳ Final Pending'}
                          </span>
                          <span className="total-amount-badge">Total: ₹{totalAmt.toLocaleString('en-IN')}</span>
                        </div>
                        {advancePaid && finalPaid ? (
                          <div className="pay-fully-paid-badge">✅ Fully Paid</div>
                        ) : (
                          <div className="pay-buttons-row">
                            {!advancePaid && (
                              <button className="pay-action-btn pay-advance-btn" onClick={() => openPaymentModal(r, 'advance')}>
                                💳 Pay Advance — ₹{halfAmt.toLocaleString('en-IN')}
                              </button>
                            )}
                            {!finalPaid && (
                              <button className="pay-action-btn pay-final-action-btn" onClick={() => openPaymentModal(r, 'final')}>
                                💳 Pay Final — ₹{halfAmt.toLocaleString('en-IN')}
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {r.status === 'cancelled' && r.rejection_reason && (
                      <div style={{ marginTop: '10px', padding: '10px', background: '#fff5f5', borderRadius: '6px', fontSize: '0.9rem', color: '#c53030' }}>
                        <strong>Rejection Reason:</strong> {r.rejection_reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="pay-modal-overlay" onClick={closePaymentModal}>
          <div className="pay-modal" onClick={e => e.stopPropagation()}>
            {paySuccess ? (
              <div className="pay-modal-success">
                <div className="pay-success-icon">✓</div>
                <h3>Payment Successful!</h3>
                <p className="pay-success-amount">₹{paySuccess.amount.toLocaleString('en-IN')}</p>
                <div className="pay-receipt">
                  <div className="pay-receipt-row"><span>Transaction ID</span><span>{paySuccess.txnId}</span></div>
                  <div className="pay-receipt-row"><span>Request</span><span>{paymentModal.request.request_code}</span></div>
                  <div className="pay-receipt-row"><span>Type</span><span>{paySuccess.type === 'advance' ? '50% Advance' : '50% Final'}</span></div>
                  <div className="pay-receipt-row"><span>Status</span><span className="pay-badge paid">PAID</span></div>
                </div>
                <button className="pay-modal-close-btn" onClick={closePaymentModal}>Close</button>
              </div>
            ) : (
              <>
                <div className="pay-modal-header">
                  <h3>Confirm Payment</h3>
                  <button className="pay-modal-x" onClick={closePaymentModal}>×</button>
                </div>
                <div className="pay-modal-body">
                  <div className="pay-modal-summary">
                    <div className="pay-modal-row"><span>Request</span><strong>{paymentModal.request.request_code}</strong></div>
                    {paymentModal.request.caretaker_name && <div className="pay-modal-row"><span>Caretaker</span><strong>{paymentModal.request.caretaker_name}</strong></div>}
                    <div className="pay-modal-row"><span>Payment Type</span><strong>{paymentModal.paymentType === 'advance' ? '50% Advance' : '50% Final'}</strong></div>
                    <div className="pay-modal-row pay-modal-amount"><span>Amount</span><strong>₹{(Number(paymentModal.request.total_amount) / 2).toLocaleString('en-IN')}</strong></div>
                  </div>
                  <div className="pay-method-tabs">
                    {['upi', 'card', 'netbanking'].map(m => (
                      <button key={m} className={`pay-method-tab ${payMethod === m ? 'active' : ''}`} onClick={() => setPayMethod(m)}>
                        {m === 'upi' ? '📱 UPI' : m === 'card' ? '💳 Card' : '🏦 Net Banking'}
                      </button>
                    ))}
                  </div>
                  {payMethod === 'upi' && (
                    <div className="pay-method-form">
                      <label>UPI ID</label>
                      <input type="text" placeholder="yourname@upi" className="pay-input" />
                      <div className="pay-upi-apps">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(a => <span key={a} className="pay-upi-chip">{a}</span>)}
                      </div>
                    </div>
                  )}
                  {payMethod === 'card' && (
                    <div className="pay-method-form">
                      <label>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="pay-input" maxLength={19} />
                      <div className="pay-form-row">
                        <div><label>Expiry</label><input type="text" placeholder="MM/YY" className="pay-input" maxLength={5} /></div>
                        <div><label>CVV</label><input type="password" placeholder="•••" className="pay-input" maxLength={3} /></div>
                      </div>
                      <label>Cardholder Name</label>
                      <input type="text" placeholder="Name on card" className="pay-input" />
                    </div>
                  )}
                  {payMethod === 'netbanking' && (
                    <div className="pay-method-form">
                      <label>Select Bank</label>
                      <div className="pay-bank-grid">
                        {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'BOB'].map(b => <div key={b} className="pay-bank-chip">{b}</div>)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="pay-modal-footer">
                  <button className="pay-confirm-btn" onClick={handleConfirmPayment} disabled={payProcessing}>
                    {payProcessing ? 'Processing...' : `Pay ₹${(Number(paymentModal.request.total_amount) / 2).toLocaleString('en-IN')}`}
                  </button>
                  <button className="pay-cancel-btn" onClick={closePaymentModal}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  const renderCareLogs = () => (
    <>
      <section className="dashboard-section">
        <div className="section-card">
          <h3 className="section-card-title">Care logs from caretaker</h3>
          {careLogs.length === 0 ? (
            <EmptyState message="No care logs available yet" />
          ) : (
            <div className="care-logs">
              {careLogs.map((log, idx) => (
                <div key={idx} className="care-log-card">
                  <div className="care-log-header">
                    <div className="care-log-date">{new Date(log.log_date).toLocaleDateString()}</div>
                    <div className="care-log-caretaker">{log.caretaker_name}</div>
                  </div>
                  <div className="care-log-grid">
                    <div className="care-log-field">
                      <div className="care-log-label">Medications given</div>
                      <div className="care-log-value">{log.medications_given}</div>
                    </div>
                    <div className="care-log-field">
                      <div className="care-log-label">Activities done</div>
                      <div className="care-log-value">{log.activities_done}</div>
                    </div>
                    <div className="care-log-field">
                      <div className="care-log-label">Meals served</div>
                      <div className="care-log-value">{log.meals_served}</div>
                    </div>
                    <div className="care-log-field">
                      <div className="care-log-label">Observations</div>
                      <div className="care-log-value">{log.observations}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );

  return (
    <div className="family-dashboard">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/logo.png" alt="ElderCare" style={{ height: '32px', width: 'auto' }} />
          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', fontWeight: '600', color: '#0D6E6E' }}>Elder Care</span>
          <StatusBadge status="info">Family</StatusBadge>
        </div>
        <div className="navbar-right">
          <span className="navbar-user">{user?.full_name}</span>
          <div className="navbar-avatar">{user?.full_name?.charAt(0)}</div>
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="greeting-header">
          <h2 className="greeting-title">{getGreeting()}, {user?.full_name?.split(' ')[0]}</h2>
          <p className="greeting-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {elder && ` · 1 elder assigned to you`}
          </p>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab ${activeTab === 'care-plan' ? 'tab-active' : ''}`} onClick={() => setActiveTab('care-plan')}>Care Plan</button>
          <button className={`tab ${activeTab === 'service-request' ? 'tab-active' : ''}`} onClick={() => setActiveTab('service-request')}>Service Request</button>
          <button className={`tab ${activeTab === 'care-logs' ? 'tab-active' : ''}`} onClick={() => setActiveTab('care-logs')}>Care Logs</button>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'care-plan' && renderCarePlan()}
        {activeTab === 'service-request' && renderServiceRequest()}
        {activeTab === 'care-logs' && renderCareLogs()}
      </div>

      <SlidePanel isOpen={showElderPanel} onClose={() => setShowElderPanel(false)} title="Edit elder profile">
        <form onSubmit={saveElder} className="slide-panel-form">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input name="full_name" className="form-input" defaultValue={elder?.full_name} required />
          </div>
          <div className="form-field">
            <label className="form-label">Age</label>
            <input name="age" type="number" className="form-input" defaultValue={elder?.age} required />
          </div>
          <div className="form-field">
            <label className="form-label">Gender</label>
            <select name="gender" className="form-input" defaultValue={elder?.gender} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Medical History</label>
            <textarea name="medical_history" className="form-input" rows="3" defaultValue={elder?.medical_history}></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Allergies</label>
            <textarea name="allergies" className="form-input" rows="2" defaultValue={elder?.allergies}></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Emergency Contact Name</label>
            <input name="emergency_contact" className="form-input" defaultValue={elder?.emergency_contact} />
          </div>
          <div className="form-field">
            <label className="form-label">Emergency Phone</label>
            <input name="emergency_phone" className="form-input" defaultValue={elder?.emergency_phone} />
          </div>
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setShowElderPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={showMedicationPanel} onClose={() => setShowMedicationPanel(false)} title="Add medication">
        <form onSubmit={addMedication} className="slide-panel-form">
          <div className="form-field">
            <label className="form-label">Medicine Name</label>
            <input name="medicine_name" className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Dosage</label>
            <input name="dosage" className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Frequency</label>
            <select name="frequency" className="form-input" required>
              <option value="">Select frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="As needed">As needed</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Instructions</label>
            <textarea name="instructions" className="form-input" rows="2"></textarea>
          </div>
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setShowMedicationPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={showActivityPanel} onClose={() => setShowActivityPanel(false)} title="Add activity">
        <form onSubmit={addActivity} className="slide-panel-form">
          <div className="form-field">
            <label className="form-label">Activity Name</label>
            <input name="activity_name" className="form-input" required />
          </div>
          <div className="form-field">
            <label className="form-label">Preferred Time</label>
            <input name="preferred_time" type="time" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Duration (minutes)</label>
            <input name="duration_minutes" type="number" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-input" rows="2"></textarea>
          </div>
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setShowActivityPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={showVitalsPanel} onClose={() => setShowVitalsPanel(false)} title="Update baseline vitals">
        <form onSubmit={saveBaselineVitals} className="slide-panel-form">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">BP Systolic</label>
              <input name="blood_pressure_systolic" type="number" className="form-input" defaultValue={baselineVitals?.blood_pressure_systolic} />
            </div>
            <div className="form-field">
              <label className="form-label">BP Diastolic</label>
              <input name="blood_pressure_diastolic" type="number" className="form-input" defaultValue={baselineVitals?.blood_pressure_diastolic} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Blood Glucose</label>
              <input name="blood_glucose" type="number" step="0.01" className="form-input" defaultValue={baselineVitals?.blood_glucose} />
            </div>
            <div className="form-field">
              <label className="form-label">SpO2 (%)</label>
              <input name="spo2" type="number" className="form-input" defaultValue={baselineVitals?.spo2} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Body Temperature (°C)</label>
              <input name="body_temperature" type="number" step="0.1" className="form-input" defaultValue={baselineVitals?.body_temperature} />
            </div>
            <div className="form-field">
              <label className="form-label">Heart Rate</label>
              <input name="heart_rate" type="number" className="form-input" defaultValue={baselineVitals?.heart_rate} />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Weight (kg)</label>
            <input name="weight" type="number" step="0.01" className="form-input" defaultValue={baselineVitals?.weight} />
          </div>
          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea name="notes" className="form-input" rows="2" defaultValue={baselineVitals?.notes}></textarea>
          </div>
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setShowVitalsPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>

      <SlidePanel isOpen={showRequestPanel} onClose={() => setShowRequestPanel(false)} title="New service request">
        <form onSubmit={submitRequest} className="slide-panel-form">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Start Date</label>
              <input 
                name="start_date" 
                type="date" 
                className="form-input" 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const endDateInput = e.target.form.elements.end_date;
                  endDateInput.min = e.target.value;
                }}
                required 
              />
            </div>
            <div className="form-field">
              <label className="form-label">End Date</label>
              <input 
                name="end_date" 
                type="date" 
                className="form-input" 
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Service Address</label>
            <textarea name="service_address" className="form-input" rows="2" placeholder="Where will the caretaker provide service?" required></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Service City</label>
            <select name="service_city" className="form-input" required>
              <option value="">Select city</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
              <option value="Bhavnagar">Bhavnagar</option>
              <option value="Jamnagar">Jamnagar</option>
            </select>
          </div>
          <div className="form-field">
            <label className="form-label">Special Requirements</label>
            <textarea name="special_requirements" className="form-input" rows="2"></textarea>
          </div>
          <div className="form-section-header">MEAL PLAN DETAILS</div>
          <div className="form-field">
            <label className="form-label">Meal Plan</label>
            <textarea name="meal_plan" className="form-input" rows="2"></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Dietary Restrictions</label>
            <textarea name="dietary_restrictions" className="form-input" rows="2"></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Meal Timings</label>
            <input name="meal_timings" className="form-input" />
          </div>
          <div className="form-section-header">LOGISTICS</div>
          <div className="form-field">
            <label className="form-label">Medication Location</label>
            <input name="medication_location" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Equipment Location</label>
            <input name="equipment_location" className="form-input" />
          </div>
          <div className="form-field">
            <label className="form-label">Emergency Instructions</label>
            <textarea name="emergency_instructions" className="form-input" rows="2"></textarea>
          </div>
          <div className="form-field">
            <label className="form-label">Additional Notes</label>
            <textarea name="additional_notes" className="form-input" rows="2"></textarea>
          </div>
          <div className="form-section-header">
            APPOINTMENTS
            <button type="button" className="btn-ghost-sm" onClick={() => setAppointments([...appointments, {}])}>+ Add appointment</button>
          </div>
          {appointments.map((apt, idx) => (
            <AppointmentEntry
              key={idx}
              appointment={apt}
              onChange={(updated) => {
                const newApts = [...appointments];
                newApts[idx] = updated;
                setAppointments(newApts);
              }}
              onRemove={() => setAppointments(appointments.filter((_, i) => i !== idx))}
            />
          ))}
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Submit request</button>
            <button type="button" className="btn-ghost" onClick={() => setShowRequestPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>
    </div>
  );
}

export default FamilyDashboard;
