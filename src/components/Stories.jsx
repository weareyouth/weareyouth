import React, { useState, useRef } from 'react';
import './Stories.css';
import { supabase } from '../lib/supabaseClient';
import { Plus, X } from 'lucide-react';

const Stories = ({ stories = [] }) => {
  const defaultStories = [
    {
      id: 1,
      name: 'Aarti',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"The foundation gave me the confidence to pursue higher education against all odds."',
      role: 'Student Beneficiary',
      approved: true
    },
    {
      id: 2,
      name: 'Rahul',
      image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"Volunteering here changed my perspective. We are building a family, not just an NGO."',
      role: 'Lead Volunteer',
      approved: true
    },
    {
      id: 3,
      name: 'Neha',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"Thanks to the vocational training, I now run my own small enterprise."',
      role: 'Entrepreneur',
      approved: true
    }
  ];

  // Sirf approved=true wali stories dikhao — unapproved admin ke paas pending rahegi
  const displayStories = stories.length > 0 
    ? stories.filter(s => s.approved === true)
    : defaultStories;

  // Story submit karne ka modal — yeh state track karta hai modal open hai ya nahi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !quote) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    let imageUrl = 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // Agar user photo nahi upload kare toh yeh default image use hogi

    try {
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `stories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Gallery')
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from('Gallery')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // Story insert kar rahe hain — approved=false set karo, admin review ke baad approve karega
      const { error } = await supabase
        .from('stories')
        .insert([{
          name,
          role,
          quote,
          image: imageUrl,
          approved: false
        }]);

      if (error) throw error;

      alert('Success! Your story has been submitted for moderation. It will display on the website once approved by our administrator.');
      
      // Submission ke baad form reset karo aur modal band karo — clean state
      setName('');
      setRole('');
      setQuote('');
      setSelectedFile(null);
      setPreview('');
      setIsModalOpen(false);

    } catch (err) {
      alert('Error submitting story: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="stories" className="section stories section-bg-light">
      <div className="container">
        <h4 className="subtitle text-gold text-center">Transforming Lives</h4>
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">Read firsthand how your support changes the trajectory of young lives.</p>
        
        {/* Stories ka horizontally scrollable cards wala section — mobile par bhi easily scroll hoga */}
        <div className="stories-scroll-container">
          <div className="stories-grid-elegant">
            {displayStories.map(story => (
              <div key={story.id} className="story-card-elegant">
                <div className="story-header">
                  <img src={story.image} alt={story.name} className="story-avatar" />
                  <div className="story-meta">
                    <span className="story-name">{story.name}</span>
                    <span className="story-role">{story.role}</span>
                  </div>
                </div>
                <p className="story-quote">{story.quote}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA button — 'Share Your Story' — click karne par submission modal khulega */}
        <div className="text-center" style={{ marginTop: '50px' }}>
          <button 
            className="btn btn-outline-dark" 
            onClick={() => setIsModalOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Share Your Experience / Story
          </button>
        </div>
      </div>
    </section>

      {/* Story submit karne ka modal — naam, role, quote, aur photo upload yahan hota hai */}
      {isModalOpen && (
        <div className="story-submit-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="story-submit-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h3>Submit Your Story</h3>
            <p>Tell us how We Are Youth Foundation has impacted your life or community.</p>

            <form onSubmit={handleSubmit}>
              {/* Photo upload zone — click karo toh file selector khulega, preview bhi dikhega */}
              <div 
                className="story-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '50%',
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  position: 'relative'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileSelect} 
                  style={{ display: 'none' }} 
                />
                {preview ? (
                  <img src={preview} alt="Upload Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px' }}>
                    <div style={{ fontSize: '20px' }}>📷</div>
                    Add Pic
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Your Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Priyanshu Sharma" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Your Role / Connection *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Beneficiary Student, Volunteer, Villager" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Your Experience / Quote *</label>
                <textarea 
                  placeholder="Share details of your journey or thoughts here..." 
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting for Review...' : 'Submit Story'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
