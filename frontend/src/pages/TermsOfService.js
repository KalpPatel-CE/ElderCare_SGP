import React from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.css';

function TermsOfService() {
  return (
    <div className="terms-page">
      <div className="terms-header">
        <Link to="/" className="terms-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0D6E6E" strokeWidth="2"/>
          </svg>
          <span>ElderCare</span>
        </Link>
      </div>

      <div className="terms-container">
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-updated">Last updated: January 2026</p>

        <section className="terms-section">
          <h2>1. Service Agreement</h2>
          <p>
            ElderCare Services Pvt. Ltd. ("ElderCare", "we", "us") provides professional elderly care services 
            connecting families with background-verified, trained caretakers. By registering and using our platform, 
            you ("Family", "you") agree to the following terms:
          </p>
          <ul>
            <li>ElderCare will assign a qualified caretaker based on your requirements and city location</li>
            <li>All caretakers are company employees, not independent contractors or freelancers</li>
            <li>Service delivery is subject to caretaker availability in your city</li>
            <li>You agree to provide accurate and complete information about the elder's medical history, medications, and care requirements</li>
            <li>You agree to maintain a safe and respectful environment for our caretakers</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>2. Caretaker Code of Conduct</h2>
          <p>All ElderCare caretakers are bound by a professional code of conduct as company employees:</p>
          <ul>
            <li>Maintain professionalism, punctuality, and respectful behavior at all times</li>
            <li>Follow the care plan, medication schedule, and meal plan provided by the family</li>
            <li>Submit daily care logs including vitals, medications administered, meals served, and observations</li>
            <li>Maintain confidentiality of all family and elder information</li>
            <li>Report any medical emergencies or concerns immediately to the family and ElderCare</li>
            <li>Carry company ID at all times during service hours</li>
            <li>Any violation of this code is subject to immediate termination and legal action</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Privacy Policy</h2>
          <p>ElderCare collects and processes the following information:</p>
          <ul>
            <li><strong>Family Information:</strong> Name, email, phone, address, city, relation to elder</li>
            <li><strong>Elder Information:</strong> Name, age, gender, medical history, allergies, medications, daily routine, baseline vitals</li>
            <li><strong>Service Information:</strong> Care requests, service dates, special requirements, daily care logs, vitals records</li>
            <li><strong>Caretaker Information:</strong> Name, contact details, qualifications, experience, background check status, performance ratings</li>
          </ul>
          <p>
            All data is stored securely and used solely for service delivery, quality improvement, and legal compliance. 
            We do not sell or share your data with third parties except as required by law. You have the right to 
            access, update, or delete your data by contacting us at privacy@eldercare.in.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Liability Disclaimer</h2>
          <p>ElderCare provides professional caretaking services with due diligence. However:</p>
          <ul>
            <li>ElderCare is not liable for pre-existing medical conditions or natural progression of illnesses</li>
            <li>ElderCare is not liable for medical emergencies beyond the reasonable control of the caretaker</li>
            <li>ElderCare is not liable for acts of nature, accidents, or events outside the caretaker's scope of duties</li>
            <li>Families are responsible for ensuring the elder's home environment is safe and suitable for care</li>
            <li>Families must inform ElderCare of any changes in the elder's medical condition or care requirements</li>
            <li>ElderCare caretakers are trained in basic first aid but are not medical professionals unless explicitly stated</li>
          </ul>
          <p>
            In case of medical emergencies, caretakers will immediately contact emergency services and the family. 
            ElderCare maintains liability insurance for all service assignments.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Cancellation Policy</h2>
          <ul>
            <li><strong>Before Assignment:</strong> Families may cancel a request at any time before a caretaker is assigned with no penalty</li>
            <li><strong>After Assignment (48+ hours before start):</strong> Full refund minus 10% processing fee</li>
            <li><strong>After Assignment (less than 48 hours before start):</strong> 50% refund</li>
            <li><strong>After Service Starts:</strong> No refund for services already rendered. Families may terminate ongoing services with 24-hour notice</li>
            <li><strong>ElderCare-Initiated Cancellation:</strong> Full refund if ElderCare cannot fulfill the service due to caretaker unavailability</li>
          </ul>
          <p>
            Families may request caretaker replacement at any time if they are unsatisfied with the assigned caretaker. 
            Replacement requests are processed within 24 hours subject to availability.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Payment Terms</h2>
          <ul>
            <li>Payment is due at the time of caretaker assignment confirmation</li>
            <li>Accepted payment methods: Bank transfer, UPI, credit/debit cards</li>
            <li>Service fees are calculated based on service duration, caretaker experience, and specialization</li>
            <li>Additional charges may apply for extended hours, special requirements, or emergency assignments</li>
            <li>Invoices are provided via email within 24 hours of payment</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>7. Dispute Resolution</h2>
          <p>
            In case of any disputes, concerns, or complaints regarding service quality, caretaker conduct, or billing:
          </p>
          <ul>
            <li>Contact our support team at support@eldercare.in or +91 99999 00000</li>
            <li>Formal complaints can be submitted to legal@eldercare.in</li>
            <li>We aim to resolve all disputes within 7 business days</li>
            <li>If resolution cannot be reached, disputes will be subject to arbitration under Indian law</li>
            <li>Jurisdiction: Courts of Gujarat, India</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>8. Modifications to Terms</h2>
          <p>
            ElderCare reserves the right to modify these Terms of Service at any time. Families will be notified 
            of significant changes via email. Continued use of the platform after changes constitutes acceptance 
            of the updated terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Contact Information</h2>
          <p><strong>ElderCare Services Pvt. Ltd.</strong></p>
          <p>Email: support@eldercare.in</p>
          <p>Phone: +91 99999 00000</p>
          <p>Legal: legal@eldercare.in</p>
          <p>Privacy: privacy@eldercare.in</p>
        </section>

        <div className="terms-footer">
          <Link to="/" className="btn-back-home">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
