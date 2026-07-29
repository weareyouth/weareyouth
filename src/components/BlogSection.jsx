import React from 'react';
import { defaultBlogs } from '../data/blogs';
import './BlogSection.css';

const BlogSection = ({ blogs: propBlogs }) => {
  const allBlogs = propBlogs || defaultBlogs;
  // Get latest 3 blogs
  const displayBlogs = [...allBlogs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

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
    <section id="blog" className="section blog-section">
      <div className="container">
        <h4 className="subtitle text-gold text-center">Updates & Stories</h4>
        <h2 className="section-title">Latest From Our Blog</h2>
        <p className="section-subtitle">Read about our latest activities, milestones, and perspectives on community change.</p>

        {displayBlogs.length > 0 ? (
          <div className="blog-grid">
            {displayBlogs.map((blog) => (
              <div key={blog.id} className="blog-card-elegant">
                <div className="blog-card-image">
                  <img src={blog.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={blog.title} />
                  <span className="blog-category-badge">{blog.category}</span>
                </div>
                <div className="blog-card-body glass-panel">
                  <div className="blog-meta">
                    <span>📅 {formatDate(blog.created_at)}</span>
                    <span>⏱️ {blog.read_time || '3 min read'}</span>
                  </div>
                  <h3>{blog.title}</h3>
                  <p>{blog.summary}</p>
                  <a href={`#blog/${blog.slug}`} className="btn-link" style={{ textDecoration: 'none' }}>
                    Read Blog <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center" style={{ color: 'var(--text-gray)' }}>
            No blogs posted yet.
          </div>
        )}

        {allBlogs.length > 3 && (
          <div className="text-center" style={{ marginTop: '50px' }}>
            <a href="#all-blogs" className="btn btn-primary" style={{ gap: '8px' }}>
              Explore All Blogs <span className="arrow" style={{ transition: 'transform 0.3s ease' }}>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
