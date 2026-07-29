import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import spareLogo from '../assets/spareLogo.png';
import './Header.css';

const Header = ({ onAdminClick, onDonateClick, isSubPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled glass-panel' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <div className="logo" onClick={() => window.location.hash = '#'} style={{ cursor: 'pointer' }}>
          <h1>We Are Youth<br/><span>Foundation</span></h1>
        </div>
        
        {/* Desktop navigation links — yeh sirf bade screens par dikhenge, mobile mein nahi */}
        <div className="header-center">
          <div 
            className="globe-container" 
            onClick={() => window.location.hash = '#'}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '4px',
              width: '45px',
              height: '45px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
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
            {isSubPage && <a href="#" style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>Home</a>}
            <a href="#about">About Us</a>
            <a href="#programs">Programs</a>
            <a href="#impact">Impact</a>
            <a href="#stories">Stories</a>
            <a href="#blog">Blog</a>
            <a href="#gallery">Gallery</a>
            <a href="#get-involved">Get Involved</a>
          </nav>
        </div>
        
        {/* Desktop action buttons — Join Us aur Donate Now, sirf desktop par dikhenge */}
        <div className="header-actions">
          <button className={`btn ${scrolled ? 'btn-outline-dark' : 'btn-outline-light'}`} style={{marginRight: '12px'}} onClick={() => { document.getElementById('get-involved')?.scrollIntoView({ behavior: 'smooth' }); }}>Join Us</button>
          <button className={`btn ${scrolled ? 'btn-primary' : 'btn-glass-primary'}`} onClick={onDonateClick}>Donate Now</button>
        </div>

        {/* Mobile mein hamburger button — tap karo toh drawer menu khulega */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile navigation drawer — mobile users ke liye side/top se slide karne wala menu */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-container">
          <div 
            className="mobile-globe-container" 
            onClick={() => { closeMenu(); window.location.hash = '#'; }}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginBottom: '10px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
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
          <nav className="mobile-nav-links">
            {isSubPage && <a href="#" onClick={closeMenu} style={{ fontWeight: '700', color: 'var(--accent-gold)' }}>Home</a>}
            <a href="#about" onClick={closeMenu}>About Us</a>
            <a href="#programs" onClick={closeMenu}>Programs</a>
            <a href="#impact" onClick={closeMenu}>Impact</a>
            <a href="#stories" onClick={closeMenu}>Stories</a>
            <a href="#blog" onClick={closeMenu}>Blog</a>
            <a href="#gallery" onClick={closeMenu}>Gallery</a>
            <a href="#get-involved" onClick={closeMenu}>Get Involved</a>
          </nav>
          <div className="mobile-nav-actions">
            <button className="btn btn-outline-light" onClick={() => { closeMenu(); document.getElementById('get-involved')?.scrollIntoView({ behavior: 'smooth' }); }}>Join Us</button>
            <button className="btn btn-primary" onClick={() => { closeMenu(); onDonateClick(); }}>Donate Now</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
