import React, { useState } from 'react';
import './About.css';
import StoryModal from './StoryModal';

const About = () => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-grid">
          <div className="about-images">
            <div className="img-wrapper img-1">
              <img src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Youth engagement" />
            </div>
            <div className="img-wrapper img-2 glass-panel">
              <img src="https://images.unsplash.com/photo-1526976663112-0050bc6742f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Community work" />
            </div>
            <div className="experience-badge glass-panel">
              <span className="years">10+</span>
              <span className="text">Years of<br/>Impact</span>
            </div>
          </div>
          
          <div className="about-text">
            <h4 className="subtitle text-gold">About Us</h4>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '30px' }}>Empowering the Youth,<br/>Securing the Future</h2>
            <p className="lead-text">
              We Are Youth Foundation is committed to creating a world where every young person is empowered to reach their full potential.
            </p>
            
            <div className="mission-vision">
              <div className="mv-card">
                <div className="icon-gold">🌟</div>
                <div>
                  <h3>Our Mission</h3>
                  <p>To provide quality education, skills training, and mentorship to underprivileged youth across the nation.</p>
                </div>
              </div>
              <div className="mv-card">
                <div className="icon-gold">👁️</div>
                <div>
                  <h3>Our Vision</h3>
                  <p>A society where every young mind is nurtured, educated, and equipped to become a leader of tomorrow.</p>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => setIsStoryOpen(true)}>Read Our Full Story</button>
          </div>
        </div>
      </div>
      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />
    </section>
  );
};

export default About;
