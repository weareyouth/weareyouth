import React, { useState } from 'react';
import { ArrowLeft, Share2, Copy, Check, Calendar, Clock, User } from 'lucide-react';
import './BlogDetailPage.css';

const BlogDetailPage = ({ blog }) => {
  const [copied, setCopied] = useState(false);

  if (!blog) return null;

  const blogUrl = `${window.location.origin}${window.location.pathname}#blog/${blog.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderFormattedContent = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      // Header 3
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} className="blog-detail-h3">{trimmed.replace('### ', '')}</h3>;
      }
      
      // Header 2
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} className="blog-detail-h2">{trimmed.replace('## ', '')}</h2>;
      }

      // Unordered lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split(/\n[*|-]\s+/).map(item => item.replace(/^[*|-]\s+/, ''));
        return (
          <ul key={index} className="blog-detail-ul">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      }

      // Ordered lists
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split(/\n\d+\.\s+/).map(item => item.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={index} className="blog-detail-ol">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ol>
        );
      }

      return <p key={index} className="blog-detail-p">{trimmed}</p>;
    });
  };

  return (
    <div className="blog-detail-page">
      {/* Back Button Container */}
      <div className="container" style={{ paddingTop: '100px' }}>
        <button className="back-btn-elegant" onClick={() => window.location.hash = '#all-blogs'}>
          <ArrowLeft size={18} />
          <span>Back to Blogs</span>
        </button>
      </div>

      <article className="blog-main-container">
        <div className="container">
          <div className="blog-detail-wrapper glass-panel">
            
            {/* Header info */}
            <header className="blog-detail-header">
              <span className="blog-detail-category">{blog.category}</span>
              <h1 className="blog-detail-title">{blog.title}</h1>
              
              <div className="blog-detail-meta">
                <div className="meta-item">
                  <User size={16} />
                  <span>By {blog.author || 'Admin'}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{blog.read_time || '3 min read'}</span>
                </div>
              </div>
            </header>

            {/* Cover image */}
            <div className="blog-detail-image">
              <img src={blog.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} alt={blog.title} />
            </div>

            {/* Grid layout for Content vs sharing/cta sidebar */}
            <div className="blog-detail-grid">
              
              {/* Content Column */}
              <div className="blog-detail-content">
                {renderFormattedContent(blog.content)}
              </div>

              {/* Sidebar Column */}
              <div className="blog-detail-sidebar">
                <div className="sidebar-widget share-widget glass-panel">
                  <h3>Share this Post</h3>
                  <p>Spread awareness about our initiatives by sharing this article with your network.</p>
                  
                  <div className="copy-link-box" style={{ marginTop: '15px' }}>
                    <input type="text" readOnly value={blogUrl} onClick={(e) => e.target.select()} />
                    <button className="copy-btn" onClick={handleCopyLink} title="Copy Link">
                      {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                    </button>
                  </div>
                  {copied && <span className="copied-tooltip">Copied link to clipboard!</span>}
                </div>

                <div className="sidebar-widget cta-widget glass-panel text-center">
                  <h3>Help Us Do More</h3>
                  <p>Your donation or volunteering can expand our digital schools and wellness camps.</p>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={() => window.location.hash = '#get-involved'}>
                    Get Involved
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
