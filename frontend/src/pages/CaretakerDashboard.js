import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './CaretakerDashboard.css';

function CaretakerDashboard() {
  const [activeSection, setActiveSection] = useState('tasks');
  const [user, setUser] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [pastAssignments, setPastAssignments] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showLogModal, setShowLogModal] = useState(false);
  const [logForm, setLogForm] = useState({ observations: '', concerns: '', notes: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assignRes, medsRes, actsRes, aptsRes, pastRes] = await Promise.all([
        api.get('/caretaker/assignment'),
        api.get('/caretaker/medications'),
        api.get('/caretaker/activities'),
        api.get('/caretaker/appointments'),
        api.get('/caretaker/past-assignments')
      ]);
      setAssignment(assignRes.data);
      setMedications(medsRes.data);
      setActivities(actsRes.data);
      setAppointments(aptsRes.data);
      setPastAssignments(pastRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const submitEndOfDayLog = async () => {
    const completedMeds = medications.filter(m => completedTasks[`med-${m.id}`]).map(m => m.medicine_name).join(', ');
    const completedActs = activities.filter(a => completedTasks[`act-${a.id}`]).map(a => a.activity_name).join(', ');
    
    try {
      await api.post('/caretaker/care-log', {
        medications_given: completedMeds || 'None',
        activities_done: completedActs || 'None',
        meals_served: 'As per meal plan',
        observations: `${logForm.observations}${logForm.concerns ? ' | Concerns: ' + logForm.concerns : ''}${logForm.notes ? ' | ' + logForm.notes : ''}`
      });
      alert('End of day report submitted!');
      setShowLogModal(false);
      setLogForm({ observations: '', concerns: '', notes: '' });
      setCompletedTasks({});
    } catch (err) {
      alert('Failed to submit report');
    }
  };

  const recordVitals = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/caretaker/vitals', Object.fromEntries(formData));
      alert('Vitals recorded!');
      e.target.reset();
    } catch (err) {
      alert('Failed');
    }
  };

  const handleCompleteService = async () => {
    if (!window.confirm('Are you sure you want to mark this service as complete? This cannot be undone.')) return;
    try {
      await api.post('/caretaker/complete-assignment');
      alert('Service completed successfully! You are now available for new assignments.');
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to complete service');
    }
  };

  const totalTasks = medications.length + activities.length;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const renderTasks = () => (
    <div className="section-content">
      {!assignment ? (
        <div className="alert-info">No active assignment. Please wait for admin to assign you.</div>
      ) : (
        <>
          <div className="greeting-card">
            <h2>Good morning, {user?.full_name} 👋</h2>
            <p className="greeting-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })} · {assignment.elder_name}</p>
            <div className="progress-section">
              <div className="progress-label">Today's Progress</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <div className="progress-text">{completedCount}/{totalTasks} tasks</div>
            </div>
          </div>

          <div className="task-section">
            <h3 className="task-section-title">💊 MEDICATIONS ({medications.length} tasks)</h3>
            <div className="task-list">
              {medications.length === 0 ? (
                <div className="empty-state">No medications</div>
              ) : (
                medications.map(med => (
                  <div key={med.id} className={`todo-item ${completedTasks[`med-${med.id}`] ? 'completed' : ''}`}>
                    <button
                      className={`todo-check ${completedTasks[`med-${med.id}`] ? 'checked' : ''}`}
                      onClick={() => toggleTask(`med-${med.id}`)}
                    >
                      {completedTasks[`med-${med.id}`] ? '✓' : ''}
                    </button>
                    <div className="todo-content">
                      <span className="todo-title">{med.medicine_name} {med.dosage}</span>
                      <span className="todo-sub">{med.frequency} · {med.instructions}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="task-section">
            <h3 className="task-section-title">🏃 ACTIVITIES ({activities.length} tasks)</h3>
            <div className="task-list">
              {activities.length === 0 ? (
                <div className="empty-state">No activities</div>
              ) : (
                activities.map(act => (
                  <div key={act.id} className={`todo-item ${completedTasks[`act-${act.id}`] ? 'completed' : ''}`}>
                    <button
                      className={`todo-check ${completedTasks[`act-${act.id}`] ? 'checked' : ''}`}
                      onClick={() => toggleTask(`act-${act.id}`)}
                    >
                      {completedTasks[`act-${act.id}`] ? '✓' : ''}
                    </button>
                    <div className="todo-content">
                      <span className="todo-title">{act.activity_name}</span>
                      <span className="todo-sub">{act.preferred_time} · {act.duration_minutes} min</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {appointments.length > 0 && (
            <div className="task-section">
              <h3 className="task-section-title">📅 APPOINTMENTS TODAY</h3>
              <div className="task-list">
                {appointments.map(apt => (
                  <div key={apt.id} className="appointment-item">
                    <div className="appointment-content">
                      <span className="appointment-title">{apt.title}</span>
                      <span className="appointment-sub">Dr. {apt.doctor_name} · {apt.hospital}</span>
                      <span className="appointment-time">{new Date(apt.appointment_time).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="eod-section">
            <div className="eod-summary">
              <span>📋 {completedCount}/{totalTasks} tasks completed today</span>
            </div>
            <button onClick={() => setShowLogModal(true)} className="eod-btn">
              Submit End of Day Report
            </button>
            <button
              onClick={handleCompleteService}
              style={{ marginTop: '12px', width: '100%', padding: '14px', background: '#0D6E6E', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
              ✅ Complete Service
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderElderProfile = () => (
    <div className="section-content">
      <h2>Elder Profile</h2>
      {!assignment ? (
        <div className="alert-info">No active assignment</div>
      ) : (
        <div className="card">
          <h3>{assignment.elder_name} ({assignment.elder_code})</h3>
          <p><strong>Age:</strong> {assignment.age} | <strong>Gender:</strong> {assignment.gender}</p>
          
          <h4>Medical History</h4>
          <p>{assignment.medical_history || 'None'}</p>
          
          <h4>Allergies</h4>
          <p>{assignment.allergies || 'None'}</p>
          
          <h4>Emergency Contact</h4>
          <p>{assignment.emergency_contact} - {assignment.emergency_phone}</p>
          
          <h4>Meal Plan</h4>
          <p>{assignment.meal_plan || 'Not specified'}</p>
          <p><strong>Dietary Restrictions:</strong> {assignment.dietary_restrictions || 'None'}</p>
          <p><strong>Meal Timings:</strong> {assignment.meal_timings || 'Not specified'}</p>
          
          <h4>Home Information</h4>
          <p><strong>Medication Location:</strong> {assignment.medication_location || 'Not specified'}</p>
          <p><strong>Equipment Location:</strong> {assignment.equipment_location || 'Not specified'}</p>
          
          <h4>Emergency Instructions</h4>
          <p>{assignment.emergency_instructions || 'None'}</p>
          
          {assignment.additional_notes && (
            <>
              <h4>Additional Notes</h4>
              <p>{assignment.additional_notes}</p>
            </>
          )}
        </div>
      )}
    </div>
  );

  const renderRecordVitals = () => (
    <div className="section-content">
      <h2>Record Vitals</h2>
      {!assignment ? (
        <div className="alert-info">No active assignment</div>
      ) : (
        <form onSubmit={recordVitals} className="form">
          <h3>Vital Signs</h3>
          <input name="blood_pressure_systolic" type="number" placeholder="BP Systolic" />
          <input name="blood_pressure_diastolic" type="number" placeholder="BP Diastolic" />
          <input name="blood_glucose" type="number" step="0.01" placeholder="Blood Glucose" />
          <input name="spo2" type="number" placeholder="SpO2 (%)" />
          <input name="body_temperature" type="number" step="0.1" placeholder="Body Temperature (°C)" />
          <input name="heart_rate" type="number" placeholder="Heart Rate" />
          <input name="weight" type="number" step="0.01" placeholder="Weight (kg)" />
          <textarea name="notes" placeholder="Notes" rows="2"></textarea>
          <button type="submit" className="btn-primary">Record Vitals</button>
        </form>
      )}
    </div>
  );

  const renderPastAssignments = () => (
    <div className="section-content">
      <h2>Past Assignments</h2>
      <div className="list">
        {pastAssignments.map(a => (
          <div key={a.id} className="list-item">
            <div>
              <strong>{a.elder_name}</strong> (Age: {a.age})
              <p>{formatDate(a.start_date)} to {formatDate(a.end_date)}</p>
              <span className={`badge badge-${a.status}`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="section-content">
      <h2>Settings</h2>
      <div className="card">
        <p><strong>Name:</strong> {user?.full_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Code:</strong> {user?.code}</p>
        <button onClick={handleLogout} className="btn-danger">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Caretaker Dashboard</h2>
        <nav>
          <button onClick={() => setActiveSection('tasks')} className={activeSection === 'tasks' ? 'active' : ''}>✅ Today's Tasks</button>
          <button onClick={() => setActiveSection('elder-profile')} className={activeSection === 'elder-profile' ? 'active' : ''}>👴 Elder Profile</button>
          <button onClick={() => setActiveSection('record-vitals')} className={activeSection === 'record-vitals' ? 'active' : ''}>📊 Record Vitals</button>
          <button onClick={() => setActiveSection('past-assignments')} className={activeSection === 'past-assignments' ? 'active' : ''}>📁 Past Assignments</button>
          <button onClick={() => setActiveSection('settings')} className={activeSection === 'settings' ? 'active' : ''}>⚙️ Settings</button>
        </nav>
      </div>
      <div className="main-content">
        {activeSection === 'tasks' && renderTasks()}
        {activeSection === 'elder-profile' && renderElderProfile()}
        {activeSection === 'record-vitals' && renderRecordVitals()}
        {activeSection === 'past-assignments' && renderPastAssignments()}
        {activeSection === 'settings' && renderSettings()}
      </div>

      {showLogModal && (
        <div className="modal" onClick={() => setShowLogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>End of Day Report</h2>
            <div className="form">
              <label>How was the elder today?</label>
              <textarea
                value={logForm.observations}
                onChange={(e) => setLogForm({...logForm, observations: e.target.value})}
                placeholder="General observations..."
                rows="3"
                required
              ></textarea>
              
              <label>Any concerns?</label>
              <textarea
                value={logForm.concerns}
                onChange={(e) => setLogForm({...logForm, concerns: e.target.value})}
                placeholder="Health concerns or issues..."
                rows="2"
              ></textarea>
              
              <label>Additional notes</label>
              <textarea
                value={logForm.notes}
                onChange={(e) => setLogForm({...logForm, notes: e.target.value})}
                placeholder="Any other information..."
                rows="2"
              ></textarea>
              
              <div className="modal-buttons">
                <button onClick={submitEndOfDayLog} className="btn-primary">Submit Report</button>
                <button onClick={() => setShowLogModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaretakerDashboard;
