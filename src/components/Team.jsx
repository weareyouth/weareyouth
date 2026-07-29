import React from 'react';
import './Team.css';

const defaultTeamMembers = [
  {
    id: 1,
    name: 'Priyanshu Sharma',
    role: 'Founder & President',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    bio: 'Dedicated to creating vocational training systems and football development programs for rural youth.',
    linkedin: '#',
    twitter: '#',
    email: 'priyanshu@weareyouthfoundation.com'
  },
  {
    id: 2,
    name: 'Aarti Jaiswal',
    role: 'Co-Founder & Secretary',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees educational support initiatives and manages community relationship building and operations.',
    linkedin: '#',
    twitter: '#',
    email: 'aarti@weareyouthfoundation.com'
  },
  {
    id: 3,
    name: 'Rahul Kumar',
    role: 'Lead Project Coordinator',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    bio: 'Directs clean-up events, tree plantations, and manages volunteer outreach and partnerships.',
    linkedin: '#',
    twitter: '#',
    email: 'rahul@weareyouthfoundation.com'
  }
];

const Team = ({ teamMembers = [] }) => {
  const displayTeam = teamMembers && teamMembers.length > 0 ? teamMembers : defaultTeamMembers;

  return (
    <section id="team" className="section team-section">
      <div className="container">
        <h4 className="subtitle text-gold text-center">People Behind the Cause</h4>
        <h2 className="section-title">Our Dedicated Team</h2>
        <p className="section-subtitle">
          Meet the visionary minds and passionate community leaders driving growth and empowerment at We Are Youth Foundation.
        </p>

        <div className="team-grid">
          {displayTeam.map(member => (
            <div key={member.id} className="team-card-elegant">
              <div className="team-image-wrapper">
                <img src={member.image} alt={member.name} className="team-image" />
                <div className="team-social-overlay">
                  <a href={member.linkedin} className="team-social-icon" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href={member.twitter} className="team-social-icon" aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  <a href={`mailto:${member.email}`} className="team-social-icon" aria-label="Email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </a>
                </div>
              </div>
              <div className="team-info-card glass-panel">
                <span className="team-role-tag">{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <a href="#all-team" className="btn btn-outline-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '2px solid var(--primary-dark)', color: 'var(--primary-dark)' }}>
            Meet All Team Members <span style={{ fontSize: '16px' }}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Team;
