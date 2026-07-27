import React, { useState, useEffect, useCallback } from 'react';
import './Gallery.css';

const Gallery = ({ images = [] }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Derive categories dynamically from the images
  const categories = ['All', ...Array.from(new Set(images.map(img => img.category)))];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

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

  if (!images || images.length === 0) return null;

  return (
    <>
      <section id="gallery" className="section gallery-section">
        <div className="container">
          <h4 className="subtitle text-gold text-center">Visual Journey</h4>
          <h2 className="section-title">Our Gallery</h2>
          <p className="section-subtitle">
            Moments captured from our impactful initiatives across communities — every image tells a story of change.
          </p>

          {/* Category Filter */}
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

          {/* Masonry Grid */}
          <div className="gallery-grid" key={activeCategory}>
            {filteredImages.map((item, index) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => openLightbox(index)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title}`}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-overlay-tag">{item.category}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
                <div className="gallery-zoom-icon">⤢</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && filteredImages[lightboxIndex] && (
        <div
          className="lightbox-overlay"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close lightbox">✕</button>

          <button className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Previous image">‹</button>

          <div className="lightbox-content">
            <img
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].title}
            />
            <div className="lightbox-info">
              <h3>{filteredImages[lightboxIndex].title}</h3>
              <p>{filteredImages[lightboxIndex].description}</p>
              <span className="lightbox-tag">{filteredImages[lightboxIndex].category} • {filteredImages[lightboxIndex].date}</span>
            </div>
          </div>

          <button className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Next image">›</button>

          <div className="lightbox-counter">
            {lightboxIndex + 1} / {filteredImages.length}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
