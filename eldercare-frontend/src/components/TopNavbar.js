function TopNavbar({ title }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : {};

  return (
    <div className="top-navbar">
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>{title}</h1>
      </div>
      <div className="navbar-user">
        <span className="user-role">
          {user.user_code || 'User'} • {user.role || 'N/A'}
        </span>
      </div>
    </div>
  );
}

export default TopNavbar;
