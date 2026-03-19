import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminDashboard.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [elders, setElders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [user, setUser] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (e) {
      setUser({});
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const [usersRes, eldersRes, alertsRes] = await Promise.all([
        api.get('/users'),
        api.get('/elders'),
        user.user_code ? api.get(`/alerts/${user.user_code}`) : Promise.resolve({ data: [] })
      ]);
      setUsers(usersRes.data);
      setElders(eldersRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const addUser = async (data) => {
    await api.post('/users', data);
    fetchData();
    setShowUserForm(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="admin-dashboard page-fade-in">
      <div className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>🏥 Elder Care</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <div className="admin-nav-item active">🏠 Overview</div>
          <div className="admin-nav-item">👥 User Management</div>
          <div className="admin-nav-item">🧓 Elders</div>
          <div className="admin-nav-item">📊 Reports</div>
          <div className="admin-nav-item">⚙️ Settings</div>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="version-info">v1.0.0</div>
          <button onClick={handleLogout} className="btn-logout-admin">Logout</button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <div className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span> / </span>
            <span>Admin Control Panel</span>
          </div>
          <div className="admin-user-badge">
            {user?.user_code || 'USR-A1'} • <span className="badge-admin">Admin</span>
          </div>
        </div>

        <div className="kpi-row">
          <div className="kpi-card">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <div className="kpi-value">{users.length}</div>
              <div className="kpi-label">Total Users</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">🧓</div>
            <div className="kpi-content">
              <div className="kpi-value">{elders.length}</div>
              <div className="kpi-label">Total Elders</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">🔔</div>
            <div className="kpi-content">
              <div className="kpi-value">{alerts.length}</div>
              <div className="kpi-label">Active Alerts</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <div className="kpi-value">{users.length + elders.length}</div>
              <div className="kpi-label">Total Records</div>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-title-row">
            <h2>User Management</h2>
            <button className="btn-amber" onClick={() => setShowUserForm(!showUserForm)}>+ Add User</button>
          </div>

          {showUserForm && <UserForm onSubmit={addUser} />}

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Code</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map(u => (
                  <tr key={u.id}>
                    <td>{u.user_code}</td>
                    <td>{u.full_name || '-'}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                    <td>{u.email || '-'}</td>
                    <td>
                      <button className="btn-icon-admin">✏️</button>
                      <button className="btn-icon-admin">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section">
          <div className="section-title-row">
            <h2>Elder Registry</h2>
          </div>
          <div className="elder-grid">
            {(elders || []).length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <p>📋 No elders registered yet</p>
              </div>
            ) : (
              (elders || []).map(elder => (
                <div key={elder.elder_code} className="elder-info-card">
                  <div className="elder-card-header">
                    <div className="elder-avatar-admin">{elder.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'EL'}</div>
                    <div>
                      <h3>{elder.name || 'Unknown'}</h3>
                      <span>{elder.age} years • {elder.gender}</span>
                    </div>
                  </div>
                  <div className="elder-card-footer">
                    <span>Code: {elder.elder_code}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserForm({ onSubmit }) {
  const [data, setData] = useState({ user_code: '', full_name: '', email: '', role: '', password: '' });
  const [error, setError] = useState('');

  const handleRoleChange = async (e) => {
    const selectedRole = e.target.value;
    setData({ ...data, role: selectedRole, user_code: '' });
    setError('');

    if (selectedRole) {
      try {
        const res = await api.get(`/users/generate-code?role=${selectedRole}`);
        setData(prev => ({ ...prev, user_code: res.data.user_code }));
      } catch (err) {
        setError('Could not generate user code. Please try again.');
      }
    }
  };

  return (
    <form className="admin-form" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <select value={data.role} onChange={handleRoleChange} required style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
        <option value="">Select a role</option>
        <option value="family">Family</option>
        <option value="caretaker">Caretaker</option>
        <option value="admin">Admin</option>
      </select>

      {!data.role ? (
        <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '10px' }}>
          Select a role to generate your user code
        </div>
      ) : data.user_code ? (
        <div className="code-box" style={{
          border: '2px solid #008080',
          backgroundColor: '#e6f2f2',
          padding: '10px',
          borderRadius: '5px',
          fontWeight: 'bold',
          color: '#004d4d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span>🪪 {data.user_code}</span>
          <span style={{ fontWeight: 'normal', fontSize: '0.85em' }}>Generated Code</span>
        </div>
      ) : null}

      <input placeholder="Full Name" value={data.full_name} onChange={(e) => setData({ ...data, full_name: e.target.value })} required style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      <input placeholder="Email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
      <input placeholder="Password" type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required style={{ marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

      <button type="submit" className="btn-amber" disabled={!data.user_code} style={{ padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>Save User</button>
    </form>
  );
}

export default AdminDashboard;
