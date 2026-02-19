import { useEffect, useState } from "react";
import api from "../api";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import StatsCard from "../components/StatsCard";
import "../Dashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [elders, setElders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [userForm, setUserForm] = useState({ user_code: '', role: 'family' });
  const [assignForm, setAssignForm] = useState({ user_code: '', elder_code: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, eldersRes] = await Promise.all([
        api.get('/users'),
        api.get('/elders')
      ]);
      
      setUsers(usersRes.data);
      setElders(eldersRes.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', userForm);
      alert('User added successfully');
      setUserForm({ user_code: '', role: 'family' });
      setShowUserForm(false);
      fetchData();
    } catch (err) {
      alert('Error adding user');
    }
  };

  const handleAssignElder = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/assign-elder', assignForm);
      alert('Elder assigned successfully');
      setAssignForm({ user_code: '', elder_code: '' });
      setShowAssignForm(false);
    } catch (err) {
      alert('Error assigning elder');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <TopNavbar title="Admin Dashboard" />
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <TopNavbar title="Admin Dashboard" />
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Admin Control Panel</h1>
            <p className="dashboard-subtitle">Manage users, elders, and system settings</p>
          </div>

          <div className="stats-grid">
            <StatsCard label="Total Users" value={users.length} color="#2563eb" />
            <StatsCard label="Total Elders" value={elders.length} color="#8b5cf6" />
          </div>

          {/* User Management */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">👥 User Management</h3>
              <button onClick={() => setShowUserForm(!showUserForm)} className="btn btn-success">
                {showUserForm ? 'Cancel' : '+ Add User'}
              </button>
            </div>

            {showUserForm && (
              <div className="form-container">
                <form onSubmit={handleAddUser}>
                  <div className="form-group">
                    <input
                      className="form-input"
                      placeholder="User Code (e.g., USR-F2)"
                      value={userForm.user_code}
                      onChange={(e) => setUserForm({...userForm, user_code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    >
                      <option value="family">Family</option>
                      <option value="caretaker">Caretaker</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">Add User</button>
                </form>
              </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>User Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{user.user_code}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 12px', background: '#e0e7ff', color: '#3730a3', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Elder Assignment */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">🔗 Assign Elder to User</h3>
              <button onClick={() => setShowAssignForm(!showAssignForm)} className="btn btn-primary">
                {showAssignForm ? 'Cancel' : '+ Assign Elder'}
              </button>
            </div>

            {showAssignForm && (
              <div className="form-container">
                <form onSubmit={handleAssignElder}>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={assignForm.user_code}
                      onChange={(e) => setAssignForm({...assignForm, user_code: e.target.value})}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.user_code}>{user.user_code} ({user.role})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-input"
                      value={assignForm.elder_code}
                      onChange={(e) => setAssignForm({...assignForm, elder_code: e.target.value})}
                      required
                    >
                      <option value="">Select Elder</option>
                      {elders.map((elder) => (
                        <option key={elder.id} value={elder.elder_code}>{elder.full_name} ({elder.elder_code})</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Assign</button>
                </form>
              </div>
            )}
          </div>

          {/* All Elders */}
          <div className="card">
            <h3 className="card-title">👴 All Elders</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Elder Code</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Age</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>Gender</th>
                </tr>
              </thead>
              <tbody>
                {elders.map((elder) => (
                  <tr key={elder.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px' }}>{elder.elder_code}</td>
                    <td style={{ padding: '12px', fontWeight: '600' }}>{elder.full_name}</td>
                    <td style={{ padding: '12px' }}>{elder.age}</td>
                    <td style={{ padding: '12px' }}>{elder.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
