import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import SlidePanel from '../components/SlidePanel';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [caretakers, setCaretakers] = useState([]);
  const [availableCaretakers, setAvailableCaretakers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAddCaretakerPanel, setShowAddCaretakerPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestCity, setRequestCity] = useState('');
  const [cityFiltered, setCityFiltered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, pendingRes, allReqRes, ctRes, availCtRes, famRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/requests/pending'),
        api.get('/admin/requests'),
        api.get('/admin/caretakers'),
        api.get('/admin/caretakers/available'),
        api.get('/admin/families')
      ]);
      setStats(statsRes.data);
      setPendingRequests(pendingRes.data);
      setAllRequests(allReqRes.data);
      setCaretakers(ctRes.data);
      setAvailableCaretakers(availCtRes.data);
      setFamilies(famRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openAssignPanel = async (request) => {
    setSelectedRequest(request);
    setShowAssignPanel(true);

    const serviceCity = request.service_city || request.family_city || '';
    setRequestCity(serviceCity);

    try {
      if (serviceCity) {
        const cityRes = await api.get(`/admin/caretakers/available?city=${encodeURIComponent(serviceCity)}`);
        if (cityRes.data.length > 0) {
          setAvailableCaretakers(cityRes.data);
          setCityFiltered(true);
          return;
        }
      }
      const allRes = await api.get('/admin/caretakers/available');
      setAvailableCaretakers(allRes.data);
      setCityFiltered(false);
    } catch (err) {
      console.error(err);
    }
  };

  const assignCaretaker = async (caretakerId) => {
    try {
      await api.post('/admin/assign', {
        request_id: selectedRequest.id,
        caretaker_id: caretakerId
      });
      alert('Caretaker assigned successfully!');
      setShowAssignPanel(false);
      loadData();
    } catch (err) {
      alert('Failed to assign');
    }
  };

  const addCaretaker = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await api.post('/admin/caretakers', Object.fromEntries(formData));
      alert('Caretaker added successfully!');
      setShowAddCaretakerPanel(false);
      e.target.reset();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add caretaker');
    }
  };

  const updateBackgroundCheck = async (id) => {
    try {
      await api.put(`/admin/caretakers/${id}/background-check`, { status: 'verified' });
      alert('Background check updated!');
      loadData();
    } catch (err) {
      alert('Failed to update');
    }
  };

  const filteredCaretakers = caretakers.filter(c =>
    c.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.caretaker_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFamilies = families.filter(f =>
    f.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.family_code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">ElderCare</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            Overview
          </button>
          <button 
            className={`nav-item ${activeSection === 'requests' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveSection('requests')}
          >
            Requests
          </button>
          <button 
            className={`nav-item ${activeSection === 'assignments' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveSection('assignments')}
          >
            Assignments
          </button>
          <button 
            className={`nav-item ${activeSection === 'caretakers' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveSection('caretakers')}
          >
            Caretakers
          </button>
          <button 
            className={`nav-item ${activeSection === 'families' ? 'nav-item-active' : ''}`}
            onClick={() => setActiveSection('families')}
          >
            Families
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-name">{user?.full_name}</div>
          <div className="sidebar-user-role">Super Administrator</div>
          <button className="btn-ghost-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-main">
        {activeSection === 'overview' && (
          <div className="admin-content">
            <div className="admin-header">
              <div>
                <h2 className="admin-title">Platform overview</h2>
                <p className="admin-subtitle">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <button className="btn-primary">+ Add user</button>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-accent" style={{ background: 'var(--teal-600)' }}></div>
                <div className="admin-stat-label">TOTAL FAMILIES</div>
                <div className="admin-stat-value" style={{ color: 'var(--teal-600)' }}>{stats.totalFamilies || 0}</div>
                <div className="admin-stat-trend">Registered families</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-accent" style={{ background: 'var(--blue-600)' }}></div>
                <div className="admin-stat-label">TOTAL CARETAKERS</div>
                <div className="admin-stat-value" style={{ color: 'var(--blue-600)' }}>{stats.totalCaretakers || 0}</div>
                <div className="admin-stat-trend">Active caretakers</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-accent" style={{ background: 'var(--amber-600)' }}></div>
                <div className="admin-stat-label">PENDING REQUESTS</div>
                <div className="admin-stat-value" style={{ color: 'var(--amber-600)' }}>{stats.pendingRequests || 0}</div>
                <div className="admin-stat-trend">Awaiting assignment</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-accent" style={{ background: 'var(--green-600)' }}></div>
                <div className="admin-stat-label">ACTIVE ASSIGNMENTS</div>
                <div className="admin-stat-value" style={{ color: 'var(--green-600)' }}>{stats.activeAssignments || 0}</div>
                <div className="admin-stat-trend">Currently active</div>
              </div>
            </div>

            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title">Recent pending requests</h3>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REQUEST CODE</th>
                      <th>FAMILY</th>
                      <th>ELDER</th>
                      <th>START DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.slice(0, 5).map(r => (
                      <tr key={r.id}>
                        <td>{r.request_code}</td>
                        <td>{r.family_name}</td>
                        <td>{r.elder_name}</td>
                        <td>{r.start_date}</td>
                        <td>
                          <button className="btn-primary-sm" onClick={() => openAssignPanel(r)}>Assign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'requests' && (
          <div className="admin-content">
            <div className="admin-header">
              <h2 className="admin-title">Pending Requests</h2>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REQUEST CODE</th>
                      <th>FAMILY</th>
                      <th>ELDER</th>
                      <th>START DATE</th>
                      <th>END DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(r => (
                      <tr key={r.id}>
                        <td>{r.request_code}</td>
                        <td>{r.family_name}</td>
                        <td>{r.elder_name}</td>
                        <td>{r.start_date}</td>
                        <td>{r.end_date}</td>
                        <td>
                          <button className="btn-primary-sm" onClick={() => openAssignPanel(r)}>Assign</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="admin-header" style={{ marginTop: '32px' }}>
              <h2 className="admin-title">All Requests</h2>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REQUEST CODE</th>
                      <th>FAMILY</th>
                      <th>ELDER</th>
                      <th>CARETAKER</th>
                      <th>START</th>
                      <th>END</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRequests.map(r => (
                      <tr key={r.id}>
                        <td>{r.request_code}</td>
                        <td>{r.family_name}</td>
                        <td>{r.elder_name}</td>
                        <td>{r.caretaker_name || 'Not assigned'}</td>
                        <td>{r.start_date}</td>
                        <td>{r.end_date}</td>
                        <td><StatusBadge status={r.status}>{r.status}</StatusBadge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'assignments' && (
          <div className="admin-content">
            <div className="admin-header">
              <h2 className="admin-title">All Assignments</h2>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>REQUEST CODE</th>
                      <th>FAMILY</th>
                      <th>ELDER</th>
                      <th>CARETAKER</th>
                      <th>START</th>
                      <th>END</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRequests.filter(r => r.status !== 'pending').map(r => (
                      <tr key={r.id}>
                        <td>{r.request_code}</td>
                        <td>{r.family_name}</td>
                        <td>{r.elder_name}</td>
                        <td>{r.caretaker_name}</td>
                        <td>{r.start_date}</td>
                        <td>{r.end_date}</td>
                        <td><StatusBadge status={r.status}>{r.status}</StatusBadge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'caretakers' && (
          <div className="admin-content">
            <div className="admin-header">
              <div>
                <h2 className="admin-title">Caretaker registry</h2>
              </div>
              <button className="btn-primary" onClick={() => setShowAddCaretakerPanel(true)}>+ Add caretaker</button>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title"></h3>
                <input 
                  type="text" 
                  className="admin-search" 
                  placeholder="Search caretakers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>FULL NAME</th>
                      <th>CITY</th>
                      <th>SPECIALIZATION</th>
                      <th>EXPERIENCE</th>
                      <th>STATUS</th>
                      <th>RATING</th>
                      <th>BACKGROUND CHECK</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaretakers.map(c => (
                      <tr key={c.id}>
                        <td>{c.caretaker_code}</td>
                        <td>{c.full_name}</td>
                        <td>{c.city || '—'}</td>
                        <td>{c.specialization}</td>
                        <td>{c.experience_years} years</td>
                        <td><StatusBadge status={c.availability_status}>{c.availability_status}</StatusBadge></td>
                        <td>{c.rating}</td>
                        <td>
                          {c.background_check_status === 'verified' ? (
                            <StatusBadge status="verified">Verified</StatusBadge>
                          ) : (
                            <button className="btn-verify" onClick={() => updateBackgroundCheck(c.id)}>
                              <StatusBadge status="unverified">Pending</StatusBadge>
                            </button>
                          )}
                        </td>
                        <td><a href="#" className="table-link">View</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'families' && (
          <div className="admin-content">
            <div className="admin-header">
              <h2 className="admin-title">Family accounts</h2>
            </div>
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title"></h3>
                <input 
                  type="text" 
                  className="admin-search" 
                  placeholder="Search families..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>FAMILY CODE</th>
                      <th>FULL NAME</th>
                      <th>EMAIL</th>
                      <th>PHONE</th>
                      <th>RELATION TO ELDER</th>
                      <th>ELDER NAME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFamilies.map(f => (
                      <tr key={f.id}>
                        <td>{f.family_code}</td>
                        <td>{f.full_name}</td>
                        <td>{f.email}</td>
                        <td>{f.phone}</td>
                        <td>{f.relation_to_elder}</td>
                        <td>{f.elder_name || 'Not created'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <SlidePanel isOpen={showAssignPanel} onClose={() => setShowAssignPanel(false)} title="Assign caretaker">
        {selectedRequest && (
          <div className="slide-panel-form">
            <div className="assign-info-card">
              <div className="assign-info-row">
                <span className="assign-info-label">Request code:</span>
                <span className="assign-info-value">{selectedRequest.request_code}</span>
              </div>
              <div className="assign-info-row">
                <span className="assign-info-label">Elder name:</span>
                <span className="assign-info-value">{selectedRequest.elder_name}</span>
              </div>
              <div className="assign-info-row">
                <span className="assign-info-label">Service City:</span>
                <span className="assign-info-value">{requestCity || 'Not specified'}</span>
              </div>
              <div className="assign-info-row">
                <span className="assign-info-label">Period:</span>
                <span className="assign-info-value">{selectedRequest.start_date} → {selectedRequest.end_date}</span>
              </div>
            </div>
            {cityFiltered ? (
              <div className="city-match-notice success">
                ✅ Showing caretakers available in <strong>{requestCity}</strong>
              </div>
            ) : requestCity ? (
              <div className="city-match-notice warning">
                ⚠️ No caretakers available in {requestCity}. Showing all available caretakers.
              </div>
            ) : null}
            <div className="form-section-header">AVAILABLE CARETAKERS</div>
            <div className="caretaker-list">
              {availableCaretakers.length === 0 ? (
                <p>No caretakers available right now.</p>
              ) : (
                availableCaretakers.map(c => (
                  <div key={c.id} className="caretaker-select-card">
                    <div className="caretaker-select-left">
                      <div className="caretaker-avatar">{c.full_name?.charAt(0)}</div>
                      <div>
                        <div className="caretaker-name">{c.full_name}</div>
                        <div className="caretaker-details">{c.specialization} · {c.experience_years} years</div>
                        <div className="caretaker-rating">⭐ {c.rating || '0.0'}</div>
                      </div>
                    </div>
                    <div className="caretaker-select-right">
                      <span className={`city-badge ${c.city?.toLowerCase() === requestCity?.toLowerCase() ? 'same-city' : 'diff-city'}`}>
                        📍 {c.city || 'City not set'}
                      </span>
                      <button className="btn-primary-sm" onClick={() => assignCaretaker(c.id)}>Select</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel isOpen={showAddCaretakerPanel} onClose={() => setShowAddCaretakerPanel(false)} title="Add caretaker">
        <form onSubmit={addCaretaker} className="slide-panel-form">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input name="full_name" className="form-input" required />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-input" required />
            </div>
            <div className="form-field">
              <label className="form-label">Experience (years)</label>
              <input name="experience_years" type="number" className="form-input" />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Specialization</label>
            <select name="specialization" className="form-input">
              <option value="">Select specialization</option>
              <option value="General Care">General Care</option>
              <option value="Dementia Care">Dementia Care</option>
              <option value="Post-Surgery">Post-Surgery</option>
              <option value="Physiotherapy">Physiotherapy</option>
              <option value="Palliative Care">Palliative Care</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">City *</label>
              <select name="city" className="form-input" required>
                <option value="">Select city</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Bhavnagar">Bhavnagar</option>
                <option value="Jamnagar">Jamnagar</option>
                <option value="Junagadh">Junagadh</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Anand">Anand</option>
                <option value="Nadiad">Nadiad</option>
                <option value="Mehsana">Mehsana</option>
                <option value="Morbi">Morbi</option>
                <option value="Surendranagar">Surendranagar</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">State</label>
              <input name="state" className="form-input" placeholder="e.g. Gujarat" />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">Full Address</label>
            <textarea name="address" className="form-input" placeholder="Street address, area..." rows={2}></textarea>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" required />
            </div>
            <div className="form-field">
              <label className="form-label">Confirm Password</label>
              <input name="confirm_password" type="password" className="form-input" required />
            </div>
          </div>
          <div className="slide-panel-actions">
            <button type="submit" className="btn-primary-full">Add Caretaker</button>
            <button type="button" className="btn-ghost" onClick={() => setShowAddCaretakerPanel(false)}>Cancel</button>
          </div>
        </form>
      </SlidePanel>
    </div>
  );
}

export default AdminDashboard;
