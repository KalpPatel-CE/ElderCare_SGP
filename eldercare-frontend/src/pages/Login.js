import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [formData, setFormData] = useState({ user_code: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.user_code.trim() || !formData.password.trim()) {
      alert('Please enter user code and password');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'family') {
        navigate('/family');
      } else if (user.role === 'caretaker') {
        navigate('/caretaker');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Elder Care System</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="User Code"
            value={formData.user_code}
            onChange={(e) => setFormData({...formData, user_code: e.target.value})}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <button 
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#1976d2', cursor: 'pointer' }}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
