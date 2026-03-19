import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.clear();
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      const role = response.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'family') navigate('/family');
      else if (role === 'caretaker') navigate('/caretaker');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page page-fade-in">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-link">← Elder Care Home</Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="btn-primary btn-full">Sign In</button>
          
          <p className="auth-footer">
            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
