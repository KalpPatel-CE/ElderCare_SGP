function TopNavbar({ title }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="top-navbar">
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '600' }}>{title}</h1>
      </div>
      <div className="navbar-user">
        <span className="user-role">
          {user.user_code} • {user.role}
        </span>
      </div>
    </div>
  );
}

export default TopNavbar;
