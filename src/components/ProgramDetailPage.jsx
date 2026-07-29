import React, { useState } from 'react';
import { ArrowLeft, Share2, Copy, Check, Heart, UserPlus } from 'lucide-react';
import './ProgramDetailPage.css';

const ProgramDetailPage = ({ program, onDonateClick, onJoinClick }) => {
  const [copied, setCopied] = useState(false);

  if (!program) return null;

  const programUrl = `${window.location.origin}${window.location.pathname}#program/${program.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(programUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="program-detail-page">
      {/* Hero Banner */}
      <div className="program-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.85)), url(${program.image})` }}>
        <div className="container">
          <button className="back-btn-elegant" onClick={() => window.location.hash = '#programs'}>
            <ArrowLeft size={18} />
            <span>Back to Programs</span>
          </button>
          
          <div className="hero-content">
            <span className="tag">WE ARE YOUTH FOUNDATION &bull; PROGRAM</span>
            <h1>{program.title}</h1>
            <p className="lead">{program.description}</p>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="program-body-section">
        <div className="container">
          <div className="program-grid">
            
            {/* Left Column: Info, Activities */}
            <div className="program-main-content">
              {/* Target Group (if available) */}
              {program.details.target && (
                <div className="info-card target-card glass-panel">
                  <div className="card-header-icon">🎯</div>
                  <div className="card-header-text">
                    <h3>Target Group</h3>
                    <p>{program.details.target}</p>
                  </div>
                </div>
              )}

              {/* What We Do / Activities */}
              <div className="details-section-card glass-panel">
                <h3 className="section-subtitle-elegant">What We Do</h3>
                <p className="section-intro">Our structured initiatives are tailored to deliver sustainable growth and concrete results.</p>
                
                <ul className="activities-list-elegant">
                  {program.details.activities.map((activity, index) => {
                    const [title, desc] = activity.split(':');
                    return (
                      <li key={index} className="activity-item">
                        <div className="activity-bullet">✓</div>
                        <div className="activity-text">
                          {desc ? (
                            <>
                              <strong>{title}:</strong>{desc}
                            </>
                          ) : (
                            activity
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right Column: Impact Stats & Sharing / Call To Actions */}
            <div className="program-sidebar">
              {/* Impact Card */}
              {program.details.impact && program.details.impact.length > 0 && (
                <div className="sidebar-card impact-sidebar-card glass-panel">
                  <h3>Impact Metrics</h3>
                  <div className="impact-grid-elegant">
                    {program.details.impact.map((imp, index) => {
                      // Attempt to split by first whitespace or number to highlight the number
                      const match = imp.match(/^(\d+\+?\s*[a-zA-Z]*)\s+(.*)$/) || imp.match(/^(\d+\+?)(.*)$/);
                      if (match) {
                        return (
                          <div key={index} className="impact-stat-item">
                            <div className="stat-number">{match[1]}</div>
                            <div className="stat-label">{match[2].trim()}</div>
                          </div>
                        );
                      }
                      return (
                        <div key={index} className="impact-stat-item simple-text">
                          <p>{imp}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions Panel */}
              <div className="sidebar-card actions-sidebar-card glass-panel">
                <h3>Support this Initiative</h3>
                <p>Your contribution directly powers our {program.title} activities on the ground.</p>
                
                <div className="action-buttons">
                  <button className="btn btn-primary btn-full-width" onClick={() => onDonateClick(program.id)}>
                    <Heart size={18} style={{ marginRight: '8px' }} />
                    Donate Now
                  </button>
                  <button className="btn btn-outline-dark btn-full-width" onClick={onJoinClick}>
                    <UserPlus size={18} style={{ marginRight: '8px' }} />
                    Volunteer / Partner
                  </button>
                </div>

                <div className="share-section-elegant">
                  <div className="share-label">
                    <Share2 size={14} />
                    <span>Share Program Link</span>
                  </div>
                  <div className="copy-link-box">
                    <input type="text" readOnly value={programUrl} onClick={(e) => e.target.select()} />
                    <button className="copy-btn" onClick={handleCopyLink} title="Copy Link">
                      {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                    </button>
                  </div>
                  {copied && <span className="copied-tooltip">Copied link to clipboard!</span>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
