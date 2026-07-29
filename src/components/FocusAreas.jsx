import React from 'react';
import { programs } from '../data/programs';
import './FocusAreas.css';

const FocusAreas = ({ programs: propPrograms }) => {
  const allPrograms = propPrograms || programs;
  const displayPrograms = allPrograms.slice(0, 3);

  return (
    <section id="programs" className="section section-bg-light focus-areas">
      <div className="container">
        <h4 className="subtitle text-gold text-center">What We Do</h4>
        <h2 className="section-title">Our Programs</h2>
        <p className="section-subtitle">Targeted initiatives designed to empower youth, children, and communities across multiple dimensions of life.</p>
        
        <div className="focus-grid">
          {displayPrograms.map(area => (
            <div key={area.id} className="focus-card-elegant">
              <img src={area.image} alt={area.title} className="focus-img" />
              <div className="focus-content glass-panel">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <a href={`#program/${area.slug}`} className="btn-link" style={{ textDecoration: 'none' }}>
                  Explore Program <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {allPrograms.length > 3 && (
          <div className="text-center" style={{ marginTop: '50px' }}>
            <a href="#all-programs" className="btn btn-primary" style={{ gap: '8px' }}>
              Explore More Programs <span className="arrow" style={{ transition: 'transform 0.3s ease' }}>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default FocusAreas;
