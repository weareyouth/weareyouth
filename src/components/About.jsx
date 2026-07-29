import React from 'react';
import './About.css';

const About = ({ aboutData }) => {
  if (!aboutData) return null;

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="about-grid">
          {/* Left side — photo column, yahan NGO ki image aur experience badge dikhega */}
          <div className="about-images">
            <div className="single-img-wrapper">
              <img 
                src={aboutData.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
                alt="Youth Empowerment" 
                className="about-single-img" 
              />
            </div>
            <div className="experience-badge glass-panel">
              <span className="years">10+</span>
              <span className="text">Years of<br/>Impact</span>
            </div>
          </div>
          
          {/* Right side — text column, yahan About ka poora content — mission, vision, story hoga */}
          <div className="about-text">
            <h4 className="subtitle text-gold">{aboutData.subtitle || "About Us"}</h4>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
              {aboutData.title ? aboutData.title.split(',').map((part, index, arr) => (
                <React.Fragment key={index}>
                  {part}{index < arr.length - 1 ? <br/> : ''}
                </React.Fragment>
              )) : (
                <>Empowering the Youth,<br/>Securing the Future</>
              )}
            </h2>
            <p className="lead-text">
              {aboutData.lead_text || "We Are Youth Foundation is committed to creating a world where every young person is empowered to reach their full potential."}
            </p>
            
            <div className="mission-vision">
              <div className="mv-card">
                <div className="icon-gold">🌟</div>
                <div>
                  <h3>{aboutData.mission_title || "Our Mission"}</h3>
                  <p>{aboutData.mission_desc || "To provide quality education, skills training, and mentorship to underprivileged youth across the nation."}</p>
                </div>
              </div>
              <div className="mv-card">
                <div className="icon-gold">👁️</div>
                <div>
                  <h3>{aboutData.vision_title || "Our Vision"}</h3>
                  <p>{aboutData.vision_desc || "A society where every young mind is nurtured, educated, and equipped to become a leader of tomorrow."}</p>
                </div>
              </div>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }} 
              onClick={() => window.location.hash = '#about-story'}
            >
              Read Our Full Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
