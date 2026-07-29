import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import './AllBlogsPage.css';
import { defaultBlogs } from '../data/blogs';

const AllBlogsPage = ({ blogs }) => {
  const allBlogs = blogs || defaultBlogs;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // List of categories for filtering
  const categories = ['All', 'Education', 'Health', 'Community', 'Events', 'General'];

  const filteredBlogs = allBlogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="all-blogs-page">
      {/* Top Banner */}
      <section className="blogs-banner">
        <div className="container">
          <a href="#" className="back-link">
            <ArrowLeft size={16} /> Back to Homepage
          </a>
          <h1 className="banner-title">Our Blog & Updates</h1>
          <p className="banner-subtitle">
            Stay updated with our weekly posts, field insights, community updates, and impact stories.
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
                placeholder="Search blogs by title, keywords or content..." 
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

      {/* Grid of Blogs */}
      <section className="blogs-grid-section">
        <div className="container">
          {filteredBlogs.length > 0 ? (
            <div className="blogs-grid">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="blog-card-elegant">
                  <div className="card-image-wrapper">
                    <img src={blog.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={blog.title} className="blog-card-img" />
                    <span className="blog-card-category-badge">{blog.category}</span>
                  </div>
                  <div className="blog-card-content glass-panel">
                    <div className="blog-card-meta">
                      <span>📅 {formatDate(blog.created_at)}</span>
                      <span>⏱️ {blog.read_time || '3 min read'}</span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.summary}</p>
                    
                    <div className="card-actions">
                      <a href={`#blog/${blog.slug}`} className="btn-link">
                        Read Full Blog <span className="arrow">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center">
              <div className="no-results-icon">🔍</div>
              <h3>No Blog Posts Found</h3>
              <p>We couldn't find any articles matching "{searchQuery}" under the selected filters.</p>
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
          <h2 className="cta-title">Subscribe to our initiatives?</h2>
          <p className="cta-desc">Support our organization and get involved in changing lives in underserved communities.</p>
          <div className="cta-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
            <button onClick={() => window.location.hash = '#get-involved'} className="btn btn-primary">Join as Volunteer</button>
            <a href="#" className="btn btn-outline-dark" style={{ border: '2px solid var(--primary-dark)', color: 'var(--primary-dark) !important' }}>Back to Home</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllBlogsPage;
