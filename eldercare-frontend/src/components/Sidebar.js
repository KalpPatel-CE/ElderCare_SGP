import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Elder Care System</div>
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
          {user.role?.toUpperCase()} Portal
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {user.role === 'family' && (
          <div className={`sidebar-link ${isActive('/family') ? 'active' : ''}`} onClick={() => navigate('/family')}>
            📊 Dashboard
          </div>
        )}
        
        {user.role === 'caretaker' && (
          <div className={`sidebar-link ${isActive('/caretaker') ? 'active' : ''}`} onClick={() => navigate('/caretaker')}>
            📊 Dashboard
          </div>
        )}
        
        {user.role === 'admin' && (
          <div className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => navigate('/admin')}>
            ⚙️ Admin Panel
          </div>
        )}
        
        <div className="sidebar-link" onClick={handleLogout}>
          🚪 Logout
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
