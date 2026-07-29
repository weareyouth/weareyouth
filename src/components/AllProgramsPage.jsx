import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import './AllProgramsPage.css';
import { programs as defaultPrograms } from '../data/programs';

const AllProgramsPage = ({ programs }) => {
  const allPrograms = programs || defaultPrograms;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories extracted dynamically/statically
  const categories = ['All', 'Education', 'Empowerment', 'Health', 'Environment', 'Community'];

  const filteredPrograms = allPrograms.filter(prog => {
    const matchesSearch = prog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      const categoryKeywords = {
        'Education': ['education', 'learning', 'school', 'student', 'teach', 'counsel'],
        'Empowerment': ['empower', 'skill', 'train', 'enterprise', 'vocational', 'leadership'],
        'Health': ['health', 'hygiene', 'nutrition', 'medical', 'clinic', 'wellness', 'awareness'],
        'Environment': ['environment', 'green', 'clean', 'tree', 'plantation', 'waste'],
        'Community': ['community', 'family', 'village', 'sports', 'cultural', 'social']
      };
      
      const keywords = categoryKeywords[selectedCategory] || [];
      const textToSearch = (prog.title + ' ' + prog.description).toLowerCase();
      matchesCategory = keywords.some(keyword => textToSearch.includes(keyword));
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="all-programs-page">
      {/* Top Banner */}
      <section className="programs-banner">
        <div className="container">
          <a href="#" className="back-link">
            <ArrowLeft size={16} /> Back to Homepage
          </a>
          <h1 className="banner-title">Our Programs & Works</h1>
          <p className="banner-subtitle">
            Explore all our projects and ongoing activities dedicated to creating positive change.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-filter-container glass-panel">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search programs by title or description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-categories">
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Programs */}
      <section className="programs-grid-section">
        <div className="container">
          {filteredPrograms.length > 0 ? (
            <div className="programs-grid">
              {filteredPrograms.map(area => (
                <div key={area.id} className="program-card-elegant">
                  <div className="card-image-wrapper">
                    <img src={area.image} alt={area.title} className="program-card-img" />
                    {area.details?.target && (
                      <span className="target-badge">{area.details.target}</span>
                    )}
                  </div>
                  <div className="program-card-content glass-panel">
                    <h3>{area.title}</h3>
                    <p>{area.description}</p>
                    
                    {area.details?.activities && area.details.activities.length > 0 && (
                      <div className="activities-preview">
                        <strong>Key Activities:</strong>
                        <ul>
                          {area.details.activities.slice(0, 2).map((act, idx) => (
                            <li key={idx}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="card-actions">
                      <a href={`#program/${area.slug}`} className="btn-link">
                        Explore Program Details <span className="arrow">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center">
              <div className="no-results-icon">🔍</div>
              <h3>No Programs Found</h3>
              <p>We couldn't find any programs matching "{searchQuery}" under "{selectedCategory}" category.</p>
              <button 
                className="btn btn-outline-dark" 
                style={{ marginTop: '20px' }}
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Bottom CTA */}
      <section className="bottom-cta section">
        <div className="container text-center">
          <h2 className="cta-title">Want to support these initiatives?</h2>
          <p className="cta-desc">Your contribution enables us to grow these programs and reach more communities.</p>
          <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={() => window.location.hash = '#get-involved'} className="btn btn-primary">Get Involved</button>
            <a href="#" className="btn btn-outline-dark" style={{ border: '2px solid var(--primary-dark)', color: 'var(--primary-dark) !important' }}>Back to Home</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProgramsPage;
