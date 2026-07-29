import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './Gallery.css';
import { defaultAlbums } from '../data/albums';

const Gallery = ({ albums = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const displayAlbums = albums && albums.length > 0 ? albums : defaultAlbums;

  // Categories dynamically nikal rahe hain albums se — hardcode nahi kiye, jo bhi category database mein ho woh automatically aayegi
  const categories = ['All', ...Array.from(new Set(displayAlbums.map(alb => alb.category)))];

  const filteredAlbums = activeCategory === 'All'
    ? displayAlbums
    : displayAlbums.filter(alb => alb.category === activeCategory);

  // Homepage par sirf 6 albums dikhao — zyada hote hain toh page heavy lag jaata hai, baaki ke liye 'See All' link hai
  const homepageAlbums = filteredAlbums.slice(0, 6);

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

  // Keyboard support — Arrow keys se photos navigate kar sakte hain, Escape se lightbox band hoga
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
    <>
      <section id="gallery" className="section gallery-section">
        <div className="container">
          <h4 className="subtitle text-gold text-center">Visual Journey</h4>
          <h2 className="section-title">Our Event Albums</h2>
          <p className="section-subtitle">
            Browse through our organized albums. Click on any album cover to view photos of the event.
          </p>

          {/* Category filter buttons — All, Education, Health, etc. — click karo toh sirf woh albums dikhenge */}
          <div className="gallery-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Album cards ka grid — har card click karne par lightbox mein photos dikhenge */}
          <div className="gallery-grid" key={activeCategory}>
            {homepageAlbums.map((album) => (
              <div
                key={album.id}
                className="gallery-item"
                onClick={() => openLightbox(album)}
                role="button"
                tabIndex={0}
                aria-label={`View Album: ${album.title}`}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(album)}
              >
                <img
                  src={album.cover_image}
                  alt={album.title}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-overlay-tag">{album.category}</span>
                  <h4>{album.title}</h4>
                  <p>{album.description}</p>
                  <span className="gallery-photos-count" style={{
                    fontSize: '12px',
                    color: 'var(--accent-gold-light)',
                    display: 'block',
                    marginTop: '6px',
                    fontWeight: '600'
                  }}>
                    📂 {album.images?.length || 0} Photos
                  </span>
                </div>
                <div className="gallery-zoom-icon">⤢</div>
              </div>
            ))}
          </div>

          {displayAlbums.length > 0 && (
            <div className="text-center" style={{ marginTop: '50px' }}>
              <a href="#gallery-albums" className="btn btn-primary" style={{ gap: '8px' }}>
                Explore More Albums <span className="arrow" style={{ transition: 'transform 0.3s ease' }}>→</span>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox modal — photo click karne par full screen mein slideshow khulega, arrows se navigate karo */}
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
    </>
  );
};

export default Gallery;
