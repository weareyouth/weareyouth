import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import './AllGalleryAlbumsPage.css';
import { defaultAlbums } from '../data/albums';

const AllGalleryAlbumsPage = ({ albums }) => {
  const allAlbums = albums || defaultAlbums;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Categories extracted statically/dynamically
  const categories = ['All', 'Events', 'Education', 'Environment', 'Empowerment', 'Community', 'Health'];

  const filteredAlbums = allAlbums.filter(alb => {
    const matchesSearch = alb.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alb.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || alb.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const openLightbox = (album, index = 0) => {
    setSelectedAlbum(album);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedAlbum(null);
    document.body.style.overflow = '';
  };

  const goNext = useCallback(() => {
    if (!selectedAlbum || !selectedAlbum.images?.length) return;
    setLightboxIndex(prev => (prev + 1) % selectedAlbum.images.length);
  }, [selectedAlbum]);

  const goPrev = useCallback(() => {
    if (!selectedAlbum || !selectedAlbum.images?.length) return;
    setLightboxIndex(prev => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  }, [selectedAlbum]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, goNext, goPrev]);

  return (
    <div className="all-albums-page">
      {/* Top Banner */}
      <section className="albums-banner">
        <div className="container">
          <a href="#" className="back-link">
            <ArrowLeft size={16} /> Back to Homepage
          </a>
          <h1 className="banner-title">Our Event Photo Gallery</h1>
          <p className="banner-subtitle">
            A visual documentation of our programs, cleanups, classrooms, and community support milestones.
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
                placeholder="Search albums by name or theme..." 
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

      {/* Grid of Albums */}
      <section className="albums-grid-section">
        <div className="container">
          {filteredAlbums.length > 0 ? (
            <div className="albums-grid">
              {filteredAlbums.map((album) => (
                <div 
                  key={album.id} 
                  className="album-card-elegant"
                  onClick={() => openLightbox(album)}
                >
                  <div className="album-cover-wrapper">
                    <img src={album.cover_image} alt={album.title} className="album-cover-img" />
                    <span className="photos-count-badge">📂 {album.images?.length || 0} Photos</span>
                  </div>
                  <div className="album-card-content glass-panel">
                    <span className="album-category-tag">{album.category}</span>
                    <h3>{album.title}</h3>
                    <p>{album.description}</p>
                    <div className="album-card-action">
                      <span className="btn-link">
                        Open Album <span className="arrow">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center">
              <div className="no-results-icon">🔍</div>
              <h3>No Photo Albums Found</h3>
              <p>We couldn't find any albums matching "{searchQuery}" under the selected filters.</p>
              <button 
                className="btn btn-outline-dark" 
                style={{ marginTop: '20px' }}
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Slideshow */}
      {lightboxOpen && selectedAlbum && selectedAlbum.images && selectedAlbum.images[lightboxIndex] && (
        <div
          className="lightbox-overlay"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox"><X size={22} /></button>

          {selectedAlbum.images.length > 1 && (
            <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="lightbox-content">
            <img
              src={selectedAlbum.images[lightboxIndex]}
              alt={`${selectedAlbum.title} - Photo ${lightboxIndex + 1}`}
            />
            <div className="lightbox-info">
              <h3>{selectedAlbum.title}</h3>
              <p>{selectedAlbum.description}</p>
              <span className="lightbox-tag">{selectedAlbum.category} • Photo {lightboxIndex + 1} of {selectedAlbum.images.length}</span>
            </div>
          </div>

          {selectedAlbum.images.length > 1 && (
            <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Next image">
              <ChevronRight size={24} />
            </button>
          )}

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {selectedAlbum.images.length}
          </div>
        </div>
      )}
      
      {/* Bottom CTA */}
      <section className="bottom-cta section">
        <div className="container text-center">
          <h2 className="cta-title">Help us create more memories</h2>
          <p className="cta-desc">Your support directly funds cleaner environments, better education, and healthier lives.</p>
          <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={() => window.location.hash = '#get-involved'} className="btn btn-primary">Join as Volunteer</button>
            <a href="#" className="btn btn-outline-dark" style={{ border: '2px solid var(--primary-dark)', color: 'var(--primary-dark) !important' }}>Back to Home</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllGalleryAlbumsPage;
