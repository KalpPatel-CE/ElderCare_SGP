import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.dataset.delay = (i % 3) * 100;
      observer.observe(el);
    });

    const handleScroll = () => {
      const nav = document.querySelector('.navbar');
      if (nav) {
        nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(13,79,92,0.08)' : 'none';
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="landing-page">
      <nav className="navbar">
        <a href="#" className="logo">
          <div className="logo-icon">🏥</div>
          <span>Elder Care System</span>
        </a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How It Works</a></li>
          <li><a href="#roles">User Roles</a></li>
          <li><button className="cta-button" onClick={() => navigate('/login')}>Login</button></li>
        </ul>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌿 Built for SGP-2 · CSPIT, Charusat</div>
          <h1 className="hero-title">Care That Never <em>Misses</em> a Beat</h1>
          <p className="hero-subtitle">A complete health monitoring platform that helps family members and caretakers track medications, appointments, and daily activities for their elderly loved ones — all in one place.</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Get Started →</button>
            <button className="btn-secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Explore Features</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="mockup-container">
            <div className="mockup-card">
              <div className="mockup-dot"></div>
              <div className="mockup-header">
                <span className="mockup-title">Haribhai Patel</span>
                <span className="mockup-badge">72 yrs · Male</span>
              </div>
              <div className="mockup-stats">
                <div className="stat-box">
                  <span className="num">3</span>
                  <div className="lbl">Medications</div>
                </div>
                <div className="stat-box">
                  <span className="num" style={{ color: 'var(--amber)' }}>2</span>
                  <div className="lbl">Appointments</div>
                </div>
              </div>
              <div className="mockup-med">
                <div className="med-info">
                  <div className="med-name">Metformin 500mg</div>
                  <div className="med-time">Morning · Daily</div>
                </div>
                <span className="med-status-taken">Taken ✓</span>
              </div>
              <div className="mockup-med">
                <div className="med-info">
                  <div className="med-name">Insulin 10 units</div>
                  <div className="med-time">Evening · Daily</div>
                </div>
                <span className="med-status-pending">Pending</span>
              </div>
              <div className="mockup-alert">
                🔔 Cardiology appointment tomorrow at 10:00 AM
              </div>
            </div>
            <div className="mockup-card-2">
              <div className="label">Active Alerts</div>
              <div className="val">0</div>
              <div className="sub">All doses on track today</div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">3</span>
          <div className="stat-label">Distinct User Roles</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">Real-Time</span>
          <div className="stat-label">Alerts & Notifications</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">Zero</span>
          <div className="stat-label">Missed Doses Goal</div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">Everything You Need to<br/>Monitor Elder Care</h2>
        <p className="section-sub">From medication reminders to appointment tracking — all the tools caregivers need in a single, easy-to-use dashboard.</p>
        <div className="features-grid">
          {[
            { icon: '💊', title: 'Medication Tracking', desc: 'Schedule medications with dosage, frequency, and date range. Mark doses as taken or missed and keep a complete intake history.' },
            { icon: '📅', title: 'Appointment Management', desc: 'Add doctor visits with hospital name, department, and time. Never miss an upcoming appointment with timely reminders.' },
            { icon: '🏃', title: 'Daily Activity Monitoring', desc: 'Log and track daily activities like walking, meditation, and exercises. Keep a running record of the elder\'s wellness routines.' },
            { icon: '🔐', title: 'Role-Based Access', desc: 'Separate portals for Admin, Family, and Caretaker — each with tailored permissions and views designed for their specific needs.' },
            { icon: '🔔', title: 'Alert Notifications', desc: 'Automatic alerts when a dose is missed, an appointment is skipped, or no activity has been recorded for the day.' },
            { icon: '📊', title: 'Activity Reports', desc: 'Daily and weekly summaries of medication adherence, appointment attendance, and activity logs to identify care patterns.' }
          ].map((feature, i) => (
            <div key={i} className="feature-card fade-in">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="workflow" id="how">
        <div className="section-label">Simple Process</div>
        <h2 className="section-title">Up and Running in 3 Steps</h2>
        <p className="section-sub">Getting started is straightforward — no technical knowledge required.</p>
        <div className="workflow-steps">
          {[
            { num: '1', title: 'Register & Set Up Elder Profile', desc: 'Create an account and add your elderly loved one\'s basic profile including name, age, and gender.' },
            { num: '2', title: 'Add Medications & Appointments', desc: 'Enter medication schedules with dosage details and add upcoming doctor appointments to the system.' },
            { num: '3', title: 'Monitor & Receive Alerts', desc: 'Track daily activity on your dashboard and receive instant alerts whenever a dose or appointment is missed.' }
          ].map((step, i) => (
            <div key={i} className="workflow-step fade-in">
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="roles" id="roles">
        <div className="section-label">Who Uses It</div>
        <h2 className="section-title">Three Roles, One Shared Goal</h2>
        <p className="section-sub">Each user type has a dedicated portal designed around their specific responsibilities in the care ecosystem.</p>
        <div className="roles-grid">
          <div className="role-card admin fade-in">
            <span className="role-icon">⚙️</span>
            <h3 className="role-title">Admin</h3>
            <p className="role-description">System-level oversight and user management for the entire platform.</p>
          </div>
          <div className="role-card family fade-in">
            <span className="role-icon">👨👩👧</span>
            <h3 className="role-title">Family Member</h3>
            <p className="role-description">Stay connected with your loved one's daily health routine from anywhere.</p>
          </div>
          <div className="role-card caretaker fade-in">
            <span className="role-icon">🩺</span>
            <h3 className="role-title">Caretaker</h3>
            <p className="role-description">Professional care management for multiple assigned elderly patients.</p>
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <h2 className="cta-title">Start Monitoring Elder Care Today</h2>
        <p className="cta-text">Join the system and give your loved ones the attentive care they deserve — powered by smart monitoring and real-time alerts.</p>
        <button className="cta-button-large" onClick={() => navigate('/signup')}>Create Your Account →</button>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-heading">🏥 Elder Care System</h3>
            <p className="footer-text">Built for SGP-2 · Department of CE · CSPIT, Charusat University</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Project Team</h3>
            <p className="footer-text">Kalp Patel · Yash Desai · Harsh Hirpara</p>
          </div>
          <div className="footer-section">
            <h3 className="footer-heading">Academic Details</h3>
            <p className="footer-text">Subject: SGP-2<br/>Guide: Ronak R Patel</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Elder Care System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
