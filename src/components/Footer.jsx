import React from 'react';
import './Footer.css';

const Footer = ({ siteSettings }) => {
  const place = siteSettings?.place || 'Corporate Office, New Delhi, India';
  const phone = siteSettings?.numbers || '+91 80903 34855';
  const email = siteSettings?.email || 'contact@weareyouthfoundation.com';
  
  // Clean phone number for WhatsApp links (leave only digits)
  const cleanPhone = phone.replace(/\D/g, '');

  return (
    <footer className="footer-elegant">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <h2 className="footer-logo">We Are Youth<br/><span className="text-gold">Foundation</span></h2>
            <p className="footer-desc">
              Empowering youth, transforming communities. Building a legacy of excellence, leadership, and positive change.
            </p>
            <div className="social-links-elegant">
              <a href="#twitter" aria-label="Twitter">X</a>
              <a href="#facebook" aria-label="Facebook">f</a>
              <a href="#instagram" aria-label="Instagram">in</a>
              <a href={`https://wa.me/${cleanPhone}?text=Hi!%20I%20want%20to%20know%20more%20about%20We%20Are%20Youth%20Foundation.`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="whatsapp-social">wa</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">Our Story</a></li>
              <li><a href="#programs">Our Programs</a></li>
              <li><a href="#impact">Our Impact</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Get In Touch</h3>
            <ul className="contact-info">
              <li>📍 {place}</li>
              <li>📞 <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{phone}</a></li>
              <li>💬 <a href={`https://wa.me/${cleanPhone}?text=Hi!%20I%20want%20to%20know%20more%20about%20We%20Are%20Youth%20Foundation.`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 'bold', textDecoration: 'none' }}>WhatsApp: {phone}</a></li>
              <li>✉️ <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h3>Stay Updated</h3>
            <p>Join our elegant newsletter to receive the latest updates on our initiatives.</p>
            <form className="newsletter-form-elegant">
              <input type="email" placeholder="Email Address" required />
              <button type="submit" className="btn btn-gold">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom-elegant">
          <p>&copy; {new Date().getFullYear()} We Are Youth Foundation. All rights reserved.</p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
