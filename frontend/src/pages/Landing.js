import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Landing.css';

function Landing() {
  const [testimonials, setTestimonials] = useState([]);
  const [caretakers, setCaretakers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/auth/testimonials')
      .then(res => setTestimonials(res.data))
      .catch(err => console.error(err));
    
    axios.get('http://localhost:5000/admin/caretakers/available')
      .then(res => setCaretakers(res.data.slice(0, 3)))
      .catch(err => console.error(err));
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0D6E6E" strokeWidth="2"/>
              <path d="M12 8V12L14 14" stroke="#0D6E6E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>ElderCare</span>
          </div>
          <div className="navbar-links">
            <a onClick={() => scrollToSection('services')}>Services</a>
            <a onClick={() => scrollToSection('how-it-works')}>How It Works</a>
            <a onClick={() => scrollToSection('caretakers')}>Our Caretakers</a>
            <a onClick={() => scrollToSection('trust')}>Trust & Safety</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </div>
          <Link to="/signup" className="btn-get-started">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <h1 className="hero-title">Your Loved Ones Deserve the Best Care</h1>
            <p className="hero-subtitle">
              ElderCare connects families with background-verified, professionally trained caretakers. 
              City-matched, company-employed, fully trustworthy.
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-hero-primary">Request a Caretaker →</Link>
              <button onClick={() => scrollToSection('how-it-works')} className="btn-hero-outline">Learn More ↓</button>
            </div>
            <div className="trust-badges">
              <div className="trust-badge">✓ Background Verified</div>
              <div className="trust-badge">✓ Company Employed</div>
              <div className="trust-badge">✓ City Matched</div>
              <div className="trust-badge">✓ Daily Reports</div>
            </div>
          </div>
          <div className="hero-right">
            <svg className="hero-illustration" viewBox="0 0 400 300" fill="none">
              <circle cx="120" cy="80" r="40" fill="#FAF7F2"/>
              <rect x="80" y="120" width="80" height="120" rx="10" fill="#0D6E6E" opacity="0.1"/>
              <circle cx="280" cy="100" r="35" fill="#E8735A" opacity="0.2"/>
              <path d="M240 140 L280 180 L320 140" stroke="#0D6E6E" strokeWidth="3" fill="none"/>
              <circle cx="280" cy="200" r="20" fill="#FAF7F2"/>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Families Served</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Verified Caretakers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4</div>
            <div className="stat-label">Cities — Ahmedabad, Surat, Vadodara, Rajkot</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8★</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">📝</div>
            <h3 className="step-title">Create Your Profile</h3>
            <p className="step-desc">Register and set up your elder's medical history and daily routine</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">📋</div>
            <h3 className="step-title">Submit a Request</h3>
            <p className="step-desc">Tell us the service dates, meal plan, and home instructions</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🔍</div>
            <h3 className="step-title">We Find the Match</h3>
            <p className="step-desc">Admin assigns a verified caretaker from your city</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <div className="step-icon">🏠</div>
            <h3 className="step-title">Care Begins</h3>
            <p className="step-desc">Your caretaker arrives informed and prepared</p>
          </div>
          <div className="step-card">
            <div className="step-number">5</div>
            <div className="step-icon">📊</div>
            <h3 className="step-title">Daily Updates</h3>
            <p className="step-desc">Receive daily care logs and vitals reports</p>
          </div>
        </div>
      </section>

      {/* Why Choose ElderCare */}
      <section id="services" className="why-choose">
        <h2 className="section-title">Why Choose ElderCare</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Background Verified</h3>
            <p className="feature-desc">Every caretaker undergoes police verification, ID proof check, and reference verification before joining our team</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3 className="feature-title">Professionally Trained</h3>
            <p className="feature-desc">All caretakers are certified in elderly care, first aid, and dementia/post-surgery support</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3 className="feature-title">City Matched</h3>
            <p className="feature-desc">We only assign caretakers from your city — familiar with local hospitals, pharmacies, and routes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3 className="feature-title">Photo Verified</h3>
            <p className="feature-desc">View your caretaker's photo and profile before they arrive. You decide who enters your home</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-title">Daily Reports</h3>
            <p className="feature-desc">Receive detailed daily care logs including medications given, vitals recorded, meals served and observations</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3 className="feature-title">Legal Protection</h3>
            <p className="feature-desc">Every service is covered by a signed service agreement protecting both the family and our caretakers</p>
          </div>
        </div>
      </section>

      {/* Meet Our Caretakers */}
      <section id="caretakers" className="meet-caretakers">
        <h2 className="section-title">Meet Our Caretakers</h2>
        <div className="caretakers-grid">
          {caretakers.map(c => (
            <div key={c.id} className="caretaker-card">
              <div className="caretaker-photo">
                {c.photo_url ? (
                  <img src={`http://localhost:5000${c.photo_url}`} alt={c.full_name} />
                ) : (
                  <svg viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="#FAF7F2"/>
                    <circle cx="50" cy="35" r="15" fill="#0D6E6E"/>
                    <path d="M25 75 Q50 60 75 75" fill="#0D6E6E"/>
                  </svg>
                )}
              </div>
              <h3 className="caretaker-name">{c.full_name}</h3>
              <p className="caretaker-city">{c.city}</p>
              <p className="caretaker-spec">{c.specialization}</p>
              <div className="caretaker-meta">
                <span className="experience-badge">{c.experience_years} years</span>
                <span className="rating-badge">⭐ {c.rating}</span>
              </div>
              {c.background_check_status === 'verified' && (
                <div className="verified-badge">Verified ✓</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Families Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.id} className="testimonial-card">
              <div className="quote-icon">"</div>
              <p className="testimonial-message">{t.message}</p>
              <div className="testimonial-footer">
                <div className="testimonial-author">{t.family_name}</div>
                <div className="testimonial-city">{t.city}</div>
                <div className="testimonial-rating">{'⭐'.repeat(t.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal & Trust Section */}
      <section id="trust" className="legal-trust">
        <h2 className="section-title-light">Your Safety is Our Responsibility</h2>
        <div className="legal-grid">
          <div className="legal-card">
            <h3 className="legal-title">Service Agreement</h3>
            <p className="legal-desc">
              Every booking is covered by a formal service agreement between ElderCare, the family, and the assigned caretaker. 
              This agreement clearly defines duties, working hours, conduct rules, and liability.
            </p>
          </div>
          <div className="legal-card">
            <h3 className="legal-title">Our Commitment</h3>
            <ul className="legal-list">
              <li>Caretakers are company employees — not freelancers</li>
              <li>Zero tolerance policy for misconduct</li>
              <li>24/7 emergency support line</li>
              <li>All caretakers carry company ID at all times</li>
              <li>Families may request caretaker replacement at any time</li>
            </ul>
          </div>
        </div>
        <p className="legal-disclaimer">
          ElderCare Services Pvt. Ltd. is registered under the Companies Act. Our caretakers are bound by a professional 
          code of conduct and employment agreement. Any misconduct is subject to immediate termination and legal action.
        </p>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0D6E6E" strokeWidth="2"/>
              </svg>
              <span>ElderCare</span>
            </div>
            <p className="footer-tagline">Professional elderly care services you can trust</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Services</a>
              <a href="#">Cities</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="/terms">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:support@eldercare.in">support@eldercare.in</a>
              <a href="tel:+919999900000">+91 99999 00000</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-cities">Cities served: Ahmedabad | Surat | Vadodara | Rajkot</p>
          <p className="footer-copyright">Copyright © 2026 ElderCare Services Pvt. Ltd.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
