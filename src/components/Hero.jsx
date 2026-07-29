import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import './Hero.css';

const Hero = ({ onDonateClick }) => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      
      <motion.div 
        className="hero-bg-globe"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '50%',
          right: '-10%',
          transform: 'translateY(-50%)',
          zIndex: 1,
          opacity: 0.15,
          pointerEvents: 'none'
        }}
      >
        <Globe size={800} strokeWidth={0.5} color="var(--bg-white)" />
      </motion.div>

      <div className="container hero-content" style={{ position: 'relative', zIndex: 2 }}>
        <h3 className="hero-subtitle">Welcome to We Are Youth Foundation</h3>
        <h1 className="hero-title">Empowering Youth,<br/><span className="text-gold">Transforming Communities</span></h1>
        <p className="hero-text">Join us in our mission to inspire, educate, and uplift the next generation. Together, we can create a legacy of positive change and sustainable growth.</p>
        <div className="hero-buttons">
          <button className="btn btn-white" onClick={onDonateClick}>Donate to the Cause</button>
          <button className="btn btn-glass" onClick={() => { document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' }); }}>Discover Our Impact</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
