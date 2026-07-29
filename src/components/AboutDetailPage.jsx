import React, { useEffect } from 'react';
import './AboutDetailPage.css';
import { ArrowLeft, Heart, Award, ShieldCheck, Users2 } from 'lucide-react';

const AboutDetailPage = ({ aboutData }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storyParagraphs = aboutData.story_content 
    ? aboutData.story_content.split('\n\n').filter(p => p.trim())
    : [];

  return (
    <div className="about-detail-page">
      {/* Hero Section */}
      <div 
        className="about-hero"
        style={{ backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(${aboutData.image})` }}
      >
        <div className="container">
          <button className="back-btn-elegant" onClick={() => window.location.hash = '#about'}>
            <ArrowLeft size={16} /> Back to Home
          </button>
          
          <div className="hero-content">
            <span className="hero-tag">{aboutData.story_badge}</span>
            <h1>{aboutData.story_title}</h1>
            <p className="hero-lead">
              {aboutData.story_lead}
            </p>
          </div>
        </div>
      </div>

      {/* Main Body Section */}
      <section className="about-body-section">
        <div className="container">
          <div className="about-detail-grid">
            {/* Left Narrative Column */}
            <div className="narrative-column">
              <div className="narrative-card card-style">
                {storyParagraphs.map((para, index) => {
                  // Render quote after 1st paragraph or at the center
                  if (index === 1 && aboutData.story_quote) {
                    return (
                      <React.Fragment key={index}>
                        <p className="narrative-text">{para}</p>
                        <div className="narrative-blockquote">
                          <span className="quote-mark">“</span>
                          <p>{aboutData.story_quote}</p>
                        </div>
                      </React.Fragment>
                    );
                  }
                  return <p key={index} className="narrative-text">{para}</p>;
                })}
              </div>
            </div>

            {/* Right Info Sidebar */}
            <div className="info-sidebar">
              <div className="sidebar-card card-style highlights-sidebar">
                <h3>Our Core Pillars</h3>
                <div className="pillar-list">
                  <div className="pillar-item">
                    <div className="pillar-icon"><Heart size={20} /></div>
                    <div className="pillar-text">
                      <h4>Compassion First</h4>
                      <p>Keeping the well-being of the youth at the center of every single action we take.</p>
                    </div>
                  </div>
                  
                  <div className="pillar-item">
                    <div className="pillar-icon"><Award size={20} /></div>
                    <div className="pillar-text">
                      <h4>Absolute Integrity</h4>
                      <p>Operating with full transparency and maximum professional accountability.</p>
                    </div>
                  </div>
                  
                  <div className="pillar-item">
                    <div className="pillar-icon"><ShieldCheck size={20} /></div>
                    <div className="pillar-text">
                      <h4>Empowerment</h4>
                      <p>Not just providing aid, but teaching skills so individuals become completely self-reliant.</p>
                    </div>
                  </div>
                  
                  <div className="pillar-item">
                    <div className="pillar-icon"><Users2 size={20} /></div>
                    <div className="pillar-text">
                      <h4>Community Led</h4>
                      <p>Designing programs in collaboration with local grassroots leaders for long-term growth.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action Card */}
              <div className="sidebar-card card-style cta-sidebar-card">
                <h3>Be Part of Our Story</h3>
                <p>
                  Every milestone we achieve is written hand in hand with supporters like you. Contribute your skills, time, or funds to write the next chapter.
                </p>
                <div className="sidebar-cta-btns">
                  <button className="btn btn-primary btn-full" onClick={() => window.location.hash = '#get-involved'}>
                    Volunteer With Us
                  </button>
                  <button className="btn btn-outline btn-full" onClick={() => {
                    const el = document.getElementById('active-campaigns') || document.getElementById('campaigns');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.hash = '#';
                    }
                  }}>
                    Support Our Campaigns
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutDetailPage;
