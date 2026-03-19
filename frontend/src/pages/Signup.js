import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    full_name: '',
    user_code: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = async (e) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole, user_code: '' });
    setError('');

    if (selectedRole) {
      try {
        const res = await api.get(`/users/generate-code?role=${selectedRole}`);
        setFormData(prev => ({ ...prev, user_code: res.data.user_code }));
      } catch (err) {
        setError('Could not generate user code. Please try again.');
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-page page-fade-in">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="back-link">← Elder Care Home</Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our care community</p>
        </div>

        <form onSubmit={handleSignup} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleRoleChange} required>
              <option value="">Select a role</option>
              <option value="family">Family Member</option>
              <option value="caretaker">Caretaker</option>
            </select>
          </div>

          {!formData.role ? (
            <div className="form-group" style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Select a role to generate your user code
            </div>
          ) : formData.user_code ? (
            <div className="form-group user-code-display">
              <label>Your User Code</label>
              <div className="code-box" style={{
                border: '2px solid #008080',
                backgroundColor: '#e6f2f2',
                padding: '12px 15px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#004d4d',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <span>🪪 {formData.user_code}</span>
                <span className="code-hint" style={{ fontWeight: 'normal', fontSize: '0.85em', color: '#006666' }}>This will be your login ID</span>
              </div>
            </div>
          ) : null}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">Create Account</button>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
