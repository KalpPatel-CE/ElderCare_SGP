import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import './Auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    relation_to_elder: '',
    address: '',
    city: '',
    pincode: '',
    terms_accepted: false
  });
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      setError('You must accept the Terms of Service');
      return;
    }
    try {
      await api.post('/auth/signup', formData);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-title">Join ElderCare — Register as a Family</h1>
        <p className="auth-subtitle">Create your account to request verified professional caretakers for your loved one</p>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-input"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Relation to Elder</label>
            <select
              name="relation_to_elder"
              className="form-input"
              value={formData.relation_to_elder}
              onChange={handleChange}
              required
            >
              <option value="">Select relation</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Home Address</label>
            <textarea
              name="address"
              className="form-input"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">City</label>
              <select
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
                required
              >
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
              <label className="form-label">Pincode</label>
              <input
                type="text"
                name="pincode"
                className="form-input"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="terms-section">
            <div className="terms-header" onClick={() => setShowTerms(!showTerms)}>
              <span>Terms & Conditions</span>
              <span>{showTerms ? '▼' : '▶'}</span>
            </div>
            {showTerms && (
              <div className="terms-content">
                <p>By registering with ElderCare Services, you agree that:</p>
                <ol>
                  <li>All information provided about your elder is accurate and complete.</li>
                  <li>You will treat our caretakers with respect and dignity.</li>
                  <li>ElderCare is not liable for pre-existing medical conditions of the elder.</li>
                  <li>Our caretakers are professional employees bound by a code of conduct — any concerns must be reported through the platform.</li>
                  <li>Payment for services is non-refundable after caretaker assignment unless cancelled 48 hours before service start.</li>
                  <li>ElderCare reserves the right to reassign or replace a caretaker in case of unforeseen circumstances.</li>
                </ol>
              </div>
            )}
            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms_accepted"
                name="terms_accepted"
                checked={formData.terms_accepted}
                onChange={handleChange}
              />
              <label htmlFor="terms_accepted">
                I have read and agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and Service Agreement
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary-full"
            disabled={!formData.terms_accepted}
          >
            Create Account
          </button>
          
          {error && (
            <div className="error-message">{error}</div>
          )}
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
