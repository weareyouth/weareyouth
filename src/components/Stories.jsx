import React from 'react';
import './Stories.css';

const Stories = () => {
  const stories = [
    {
      id: 1,
      name: 'Aarti',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"The foundation gave me the confidence to pursue higher education against all odds."',
      role: 'Student Beneficiary'
    },
    {
      id: 2,
      name: 'Rahul',
      image: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"Volunteering here changed my perspective. We are building a family, not just an NGO."',
      role: 'Lead Volunteer'
    },
    {
      id: 3,
      name: 'Neha',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      quote: '"Thanks to the vocational training, I now run my own small enterprise."',
      role: 'Entrepreneur'
    }
  ];

  return (
    <section id="stories" className="section stories section-bg-light">
      <div className="container">
        <h4 className="subtitle text-gold text-center">Transforming Lives</h4>
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">Read firsthand how your support changes the trajectory of young lives.</p>
        
        <div className="stories-grid-elegant">
          {stories.map(story => (
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
    </section>
  );
};

export default Stories;
