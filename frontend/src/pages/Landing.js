import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for fade-up animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* 1. Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-logo">
          <img src="/logo.png" alt="ElderCare" style={{ height: '36px', width: 'auto' }} />
          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.25rem', fontWeight: '600', color: '#0D6E6E', letterSpacing: '-0.01em' }}>Elder Care</span>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a onClick={() => scrollToSection('services')} className="nav-link">Services</a>
          <a onClick={() => scrollToSection('how-it-works')} className="nav-link">How It Works</a>
          <a onClick={() => scrollToSection('caretakers')} className="nav-link">Our Caretakers</a>
          <a onClick={() => scrollToSection('trust')} className="nav-link">Trust & Safety</a>
          <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started &rarr;</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="hero">
        <div className="hero-left fade-up">
          <div className="hero-badge">✦ Serving 12 cities across Gujarat</div>
          <h1 className="hero-title">Care that never misses<br/>a beat.</h1>
          <p className="hero-subtitle">
            Professional caretakers assigned to your home. Background verified, company trained, city matched — so you can step out with complete peace of mind.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Request a Caretaker &rarr;</Link>
            <button onClick={() => scrollToSection('how-it-works')} className="btn-outline">See How It Works</button>
          </div>
          <div className="hero-trust">
            <span>No freelancers</span>
            <span>Same-city caretakers</span>
            <span>Daily reports to family</span>
          </div>
        </div>
        <div className="hero-right fade-up">
          <div className="mockup-card">
            <div className="mockup-badge">
              <span style={{color: '#4CAF50', fontSize: '10px'}}>●</span> Active assignment
            </div>
            <div className="mockup-header">
              <div className="mockup-name">👴 Haribhai Patel, 72</div>
              <div className="mockup-meta">Ahmedabad · Day 3 of 14</div>
            </div>
            <div className="mockup-divider"></div>
            <div className="mockup-tasks">
              <div className="mockup-task done">✓ Morning medications</div>
              <div className="mockup-task done">✓ BP recorded: 120/80</div>
              <div className="mockup-task">○ Evening walk — 6:00 PM</div>
            </div>
            <div className="mockup-divider"></div>
            <div className="mockup-caretaker">
              <div className="mc-name">Caretaker: Suresh Care</div>
              <div className="mc-rating">⭐⭐⭐⭐⭐ <span>Verified</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <section className="stats-bar fade-up">
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Families served</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">120+</div>
          <div className="stat-label">Verified caretakers</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">12</div>
          <div className="stat-label">Cities covered</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">4.8★</div>
          <div className="stat-label">Average rating</div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="how-it-works fade-up">
        <h2 className="section-title">Getting care is simple</h2>
        <div className="steps-flow">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3 className="step-title">Create Profile</h3>
            <p className="step-desc">Add your elder's medical history, medications, and routine. Takes 5 minutes.</p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 className="step-title">Submit Request</h3>
            <p className="step-desc">Tell us your city, service dates, and any special needs.</p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h3 className="step-title">We Match</h3>
            <p className="step-desc">Admin reviews and assigns the best available caretaker from your city within 24 hours.</p>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <h3 className="step-title">Caretaker Arrives</h3>
            <p className="step-desc">Your verified caretaker arrives with full knowledge of your elder's needs.</p>
          </div>
          <div className="step-item">
            <div className="step-number">5</div>
            <div className="step-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </div>
            <h3 className="step-title">Daily Reports</h3>
            <p className="step-desc">Receive daily care logs, vitals updates, and alerts directly on your dashboard.</p>
          </div>
        </div>
      </section>

      {/* 5. Trust Section */}
      <section id="trust" className="trust-section fade-up">
        <div className="trust-left">
          <h2 className="trust-heading">Our caretakers are company employees, not freelancers.</h2>
          <p className="trust-para">Unlike generic platforms that merely match you with independent contractors, ElderCare takes full legal and professional responsibility for the care provided to your loved ones.</p>
          <div className="trust-quote">
            "We didn't just hire caregivers — we trained them, verified them, and made them part of our team. Your elder is not being handed to a stranger."
          </div>
          <div className="trust-author">— ElderCare Management</div>
        </div>
        <div className="trust-right">
          <div className="trust-card card">
            <div className="trust-card-icon">🛡️</div>
            <div className="trust-card-title">Background Verified</div>
            <div className="trust-card-desc">Full ID & police verification</div>
          </div>
          <div className="trust-card card">
            <div className="trust-card-icon">📋</div>
            <div className="trust-card-title">Professionally Trained</div>
            <div className="trust-card-desc">Certified elderly care training</div>
          </div>
          <div className="trust-card card">
            <div className="trust-card-icon">📍</div>
            <div className="trust-card-title">City Matched</div>
            <div className="trust-card-desc">Only caretakers from your city</div>
          </div>
          <div className="trust-card card">
            <div className="trust-card-icon">📸</div>
            <div className="trust-card-title">Photo Verified</div>
            <div className="trust-card-desc">See your caretaker before arrival</div>
          </div>
        </div>
      </section>

      {/* 6. Services */}
      <section id="services" className="services-section fade-up">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card card">
            <h3 className="service-title">Daily Care Management</h3>
            <p className="service-desc">Medications, meals, activities, and hygiene assistance tailored to your elder's routine.</p>
          </div>
          <div className="service-card card">
            <h3 className="service-title">Medical Care Assistance</h3>
            <p className="service-desc">Vitals tracking, doctor visits, health reports, and post-surgery supportive care.</p>
          </div>
          <div className="service-card card">
            <h3 className="service-title">Companionship Care</h3>
            <p className="service-desc">Social engagement, mental wellness, reading, and accompanying on walks.</p>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="testimonials-section fade-up">
        <h2 className="section-title">Families who trust us</h2>
        <div className="testi-grid">
          <div className="testi-card card">
            <div className="testi-stars">⭐⭐⭐⭐⭐</div>
            <div className="testi-quote">"The caretaker knew exactly what to do from day one. My father was comfortable within hours."</div>
            <div className="testi-author">— Priya Shah, Ahmedabad</div>
            <div className="testi-meta">Daughter · 14-day service</div>
          </div>
          <div className="testi-card card">
            <div className="testi-stars">⭐⭐⭐⭐⭐</div>
            <div className="testi-quote">"I travel for work 2 weeks every month. ElderCare gave me the confidence to go without worrying about my mother."</div>
            <div className="testi-author">— Rahul Mehta, Surat</div>
            <div className="testi-meta">Son · Recurring service</div>
          </div>
          <div className="testi-card card">
            <div className="testi-stars">⭐⭐⭐⭐⭐</div>
            <div className="testi-quote">"They sent us the caretaker's photo and ID before arrival. That level of transparency is rare."</div>
            <div className="testi-author">— Sunita Patel, Vadodara</div>
            <div className="testi-meta">Daughter-in-law · 30-day service</div>
          </div>
        </div>
      </section>

      {/* 8. Legal Section */}
      <section className="legal-section fade-up">
        <h2 className="trust-heading">Your trust is our responsibility</h2>
        <div className="legal-content">
          <div className="legal-left">
            <ul className="legal-list">
              <li>All caretakers sign a Code of Conduct before joining</li>
              <li>Zero tolerance for misconduct — immediate termination policy</li>
              <li>All caretakers are covered under company liability insurance</li>
              <li>Family has the right to request caretaker replacement at any time</li>
              <li>All personal data is confidential and never shared with third parties</li>
            </ul>
          </div>
          <div className="legal-right">
            <div className="legal-note-card">
              <p className="legal-note-text">
                "By requesting a caretaker, families agree to our Service Terms. ElderCare acts as a managed care coordinator. Caretakers are company employees bound by professional conduct standards. In case of any concern, our 24-hour support team is always available."
              </p>
              <Link to="/terms" className="legal-link">Read Full Terms &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA Banner */}
      <section className="cta-banner fade-up">
        <h2 className="cta-title">Ready to give your elder the care they deserve?</h2>
        <p className="cta-sub">Join 500+ families across Gujarat who trust ElderCare.</p>
        <Link to="/signup" className="btn-primary">Request a Caretaker Today &rarr;</Link>
        <span className="cta-note">Free consultation. No commitment required.</span>
      </section>

      {/* 10. Footer */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/logo.png" alt="ElderCare" style={{ height: '32px', width: 'auto' }} />
              <span style={{ fontFamily: 'Lora, serif', fontSize: '1.1rem', fontWeight: '600', color: '#0D6E6E' }}>Elder Care</span>
            </div>
            <div className="footer-tagline">Professional elderly care services you can trust.</div>
            <div className="footer-info">Serving 12 cities across Gujarat</div>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              <a href="#services">Daily Care</a>
              <a href="#services">Medical Care</a>
              <a href="#services">Companionship</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="#trust">About Us</a>
              <a href="#contact">Contact</a>
              <a href="#contact">Careers</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Legal</div>
            <div className="footer-links">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/terms">Privacy Policy</Link>
              <Link to="/terms">Service Agreement</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 ElderCare. All rights reserved.</div>
          <div className="footer-bottom-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
