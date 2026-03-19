import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './CaretakerDashboard.css';

function CaretakerDashboard() {
  const [elders, setElders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('elders');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(user);
    fetchElders();
  }, []);

  const fetchElders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [eldersRes, alertsRes] = await Promise.all([
        api.get(`/elders/user/${user.user_code}`),
        user.user_code ? api.get(`/alerts/${user.user_code}`) : Promise.resolve({ data: [] })
      ]);
      setElders(eldersRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="caretaker-dashboard page-fade-in">
      <div className="caretaker-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">{user?.user_code?.slice(0, 2).toUpperCase() || 'CT'}</div>
          <div className="user-info">
            <strong>{user?.full_name || user?.user_code}</strong>
            <span className="role-badge">CARETAKER</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'elders' ? 'active' : ''}`} onClick={() => setActiveTab('elders')}>
            📋 My Elders
          </div>
          <div className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
            🔔 Alerts
          </div>
        </nav>
        <div className="sidebar-footer">
          <Link to="/" className="home-link">🏠 Home</Link>
          <button onClick={handleLogout} className="btn-logout-sidebar">Logout</button>
        </div>
      </div>

      <div className="caretaker-main">
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-label">Assigned Elders</div>
            <div className="stat-value">{elders.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Active Alerts</div>
            <div className="stat-value">{alerts.length}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Medications Today</div>
            <div className="stat-value">{elders.reduce((sum, e) => sum + (e.medications?.length || 0), 0)}</div>
          </div>
        </div>

        <div className="elders-list">
          {(elders || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>📋 No elders assigned yet</p>
            </div>
          ) : (
            (elders || []).map(elder => (
              <ElderManageCard key={elder.elder_code} elder={elder} onRefresh={fetchElders} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ElderManageCard({ elder, onRefresh }) {
  const [activeTab, setActiveTab] = useState('medications');
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [elder.elder_code]);

  const fetchData = async () => {
    try {
      const [medRes, actRes, apptRes] = await Promise.all([
        api.get(`/medications/elder/${elder.elder_code}`),
        api.get(`/activities/elder/${elder.elder_code}`),
        api.get(`/appointments/elder/${elder.elder_code}`)
      ]);
      setMedications(medRes.data);
      setActivities(actRes.data);
      setAppointments(apptRes.data);
    } catch (err) {}
  };

  const addMedication = async (data) => {
    await api.post(`/medications/${elder.elder_code}`, data);
    fetchData();
    setShowForm(false);
  };

  const updateMedStatus = async (id, status) => {
    await api.put(`/medications/${id}`, { status });
    fetchData();
  };

  const addActivity = async (data) => {
    await api.post(`/activities/${elder.elder_code}`, data);
    fetchData();
    setShowForm(false);
  };

  const addAppointment = async (data) => {
    await api.post(`/appointments/${elder.elder_code}`, data);
    fetchData();
    setShowForm(false);
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'CT';

  return (
    <div className="elder-manage-card card">
      <div className="elder-header">
        <div className="elder-avatar-sm">{getInitials(elder.name)}</div>
        <div className="elder-details">
          <h3>{elder.name}</h3>
          <span>{elder.age} years • {elder.gender}</span>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'medications' ? 'active' : ''}`} onClick={() => { setActiveTab('medications'); setShowForm(false); }}>Medications</button>
        <button className={`tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => { setActiveTab('activities'); setShowForm(false); }}>Activities</button>
        <button className={`tab ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => { setActiveTab('appointments'); setShowForm(false); }}>Appointments</button>
      </div>

      <div className="tab-content">
        {activeTab === 'medications' && (
          <>
            <button className="btn-emerald btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Medication</button>
            {showForm && <MedForm onSubmit={addMedication} />}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(medications || []).map(med => (
                  <tr key={med.id}>
                    <td>{med.medicine_name}</td>
                    <td>{med.dosage}</td>
                    <td>{med.frequency}</td>
                    <td><span className={`status-badge ${med.status}`}>{med.status || 'pending'}</span></td>
                    <td>
                      <button className="btn-icon" onClick={() => updateMedStatus(med.id, 'taken')}>✅</button>
                      <button className="btn-icon" onClick={() => updateMedStatus(med.id, 'missed')}>❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'activities' && (
          <>
            <button className="btn-emerald btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Activity</button>
            {showForm && <ActForm onSubmit={addActivity} />}
            <div className="activity-log">
              {(activities || []).map(act => (
                <div key={act.id} className="log-entry">
                  <strong>{act.activity_type}</strong>
                  <span>{new Date(act.scheduled_time).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <>
            <button className="btn-emerald btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Appointment</button>
            {showForm && <ApptForm onSubmit={addAppointment} />}
            <div className="appointment-log">
              {(appointments || []).map(appt => (
                <div key={appt.id} className="log-entry">
                  <strong>{appt.doctor_name}</strong>
                  <span>{appt.hospital_name} • {new Date(appt.appointment_date).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MedForm({ onSubmit }) {
  const [data, setData] = useState({ medicine_name: '', dosage: '', frequency: '' });
  return (
    <form className="quick-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Medicine" value={data.medicine_name} onChange={(e) => setData({ ...data, medicine_name: e.target.value })} required />
      <input placeholder="Dosage" value={data.dosage} onChange={(e) => setData({ ...data, dosage: e.target.value })} required />
      <input placeholder="Frequency" value={data.frequency} onChange={(e) => setData({ ...data, frequency: e.target.value })} required />
      <button type="submit" className="btn-emerald btn-sm">Save</button>
    </form>
  );
}

function ActForm({ onSubmit }) {
  const [data, setData] = useState({ activity_type: '', scheduled_time: '' });
  return (
    <form className="quick-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Activity Type" value={data.activity_type} onChange={(e) => setData({ ...data, activity_type: e.target.value })} required />
      <input type="datetime-local" value={data.scheduled_time} onChange={(e) => setData({ ...data, scheduled_time: e.target.value })} required />
      <button type="submit" className="btn-emerald btn-sm">Save</button>
    </form>
  );
}

function ApptForm({ onSubmit }) {
  const [data, setData] = useState({ doctor_name: '', hospital_name: '', appointment_date: '' });
  return (
    <form className="quick-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
      <input placeholder="Doctor Name" value={data.doctor_name} onChange={(e) => setData({ ...data, doctor_name: e.target.value })} required />
      <input placeholder="Hospital" value={data.hospital_name} onChange={(e) => setData({ ...data, hospital_name: e.target.value })} required />
      <input type="datetime-local" value={data.appointment_date} onChange={(e) => setData({ ...data, appointment_date: e.target.value })} required />
      <button type="submit" className="btn-emerald btn-sm">Save</button>
    </form>
  );
}

export default CaretakerDashboard;
