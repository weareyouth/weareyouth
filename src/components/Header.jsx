import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import spareLogo from '../assets/spareLogo.png';
import './Header.css';

const Header = ({ onAdminClick, onDonateClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <h1>We Are Youth<br/><span>Foundation</span></h1>
        </div>
        
        <div className="header-center">
          <div className="globe-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginBottom: '4px',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'transparent'
          }}>
            <img 
              src={spareLogo} 
              alt="3D Spare Logo" 
              className="spinning-globe" 
              style={{ 
                width: '120%', 
                height: '120%', 
                objectFit: 'cover',
                clipPath: 'circle(40% at 50% 50%)',
                transformOrigin: 'center center'
              }} 
            />
          </div>
          <nav className="nav-links">
            <a href="#about">About Us</a>
            <a href="#work">Our Work</a>
            <a href="#impact">Impact</a>
            <a href="#stories">Stories</a>
            <a href="#gallery">Gallery</a>
            <a href="#get-involved">Get Involved</a>
            <a href="#admin" onClick={(e) => { e.preventDefault(); onAdminClick(); }} style={{ color: 'var(--accent-gold)' }}>Admin Panel</a>
          </nav>
        </div>
        
        <div className="header-actions">
          <button className={`btn ${scrolled ? 'btn-outline-dark' : 'btn-outline-light'}`} style={{marginRight: '12px'}} onClick={() => { document.getElementById('get-involved')?.scrollIntoView({ behavior: 'smooth' }); }}>Join Us</button>
          <button className={`btn ${scrolled ? 'btn-primary' : 'btn-glass-primary'}`} onClick={onDonateClick}>Donate Now</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
