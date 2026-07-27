import React, { useState } from 'react';
import './FocusAreas.css';

const FocusAreas = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const areas = [
    {
      id: 1,
      title: 'Education Support',
      description: 'Ensuring quality learning, proper guidance, and confidence for children regardless of background.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        target: 'Children between 6–15 years, especially from underserved and rural communities in Chhapra, Bihar.',
        activities: [
          'After-School Learning Support: Daily classes for children who need academic help.',
          'Concept-Based Teaching: Activity-based learning to make subjects easy and enjoyable.',
          'Mentorship Sessions: Personal guidance for emotional support and confidence-building.',
          'Learning Material Support: Books, notebooks, stationery, and educational kits.',
          'Parent Awareness Meetings: Helping parents understand the importance of education.'
        ],
        impact: [
          '30+ children receiving daily learning support',
          '100+ learning hours delivered every month',
          'Improved school attendance and academic performance',
          'Confidence & leadership skills seen in students'
        ]
      }
    },
    {
      id: 2,
      title: 'Youth Empowerment',
      description: 'Equipping young adults with skills, discipline, and leadership for employment and social responsibility.',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        activities: [
          'Skill-Building Workshops: Digital literacy, basic computer training, communication skills, teamwork.',
          'Natural Farming & Sustainability Training: Hands-on learning through vermicompost and Jeevamrit units.',
          'Leadership Training: Sessions on goal-setting, public speaking, values, and community responsibility.',
          'Sports Culture Development: Daily sports like football, kabaddi, running to build discipline.',
          'Career Guidance: Helping youth understand opportunities, courses and career paths.'
        ],
        impact: [
          '50+ youth trained in digital skills',
          '15+ youth involved in natural farming unit',
          '20+ leadership sessions conducted'
        ]
      }
    },
    {
      id: 3,
      title: 'Health & Awareness',
      description: 'Building strong futures by improving awareness about hygiene, nutrition, and preventive health.',
      image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        activities: [
          'Health Check-up Camps for children and families',
          'Menstrual Hygiene Awareness Sessions',
          'Nutrition & Cleanliness Workshops',
          'Water & Sanitation Awareness',
          'Mental Well-being & Stress-Relief Activities for Youth'
        ],
        impact: [
          '100+ individuals reached through awareness drives',
          'Improved hygiene habits among children',
          'Increased health awareness in families'
        ]
      }
    },
    {
      id: 4,
      title: 'Community Development',
      description: 'Strengthening the social and environmental well-being of communities through collective action.',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        activities: [
          'Community Cleanliness Drives',
          'Tree Plantation & Environmental Activities',
          'Social Awareness Programs (education, rights, environment)',
          'Village Events & Cultural Activities',
          'Support for Local Schools & Community Spaces'
        ],
        impact: [
          '10+ community events organized',
          '75+ local residents involved',
          'Positive change in village cleanliness and participation'
        ]
      }
    },
    {
      id: 5,
      title: 'Career Counselling',
      description: 'Guiding students in making informed academic and career choices through clarity and mentorship.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        activities: [
          'Career Guidance Sessions in Schools & Colleges',
          'One-on-One Counselling for Students',
          'Workshops on Career Awareness & Goal Setting',
          'Sessions on Competitive Exams & Higher Education Pathways',
          'Mentorship Support for Skill Development & Career Planning'
        ],
        impact: [
          '1000+ students counselled',
          '15+ career guidance sessions conducted',
          'Improved clarity among students regarding career choices',
          'Increased awareness about higher education and opportunities'
        ]
      }
    },
    {
      id: 6,
      title: 'Future Initiatives',
      description: 'Expanding to Natural Farming Centers, Digital Learning Labs, and Rural Sports Academies.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: {
        activities: [
          'Building a full-scale Natural Farming Learning Center: With vermicompost, Jeevamrit, and organic workshops.',
          'Setting up a Digital Learning Lab: Equipped with computers, internet, and structured digital courses.',
          'Expanding After-School Centers: Opening new learning centers in Varanasi district.',
          'Launching a Rural Sports Academy: For structured training, tournaments and fitness programs.',
          'Scholarship & Support Programs: For high-performing students from low-income families.',
          'Women’s Skill Development Program: Training in stitching, digital basics and entrepreneurship.'
        ],
        impact: []
      }
    }
  ];

  return (
    <section id="programs" className="section section-bg-light focus-areas">
      <div className="container">
        <h4 className="subtitle text-gold text-center">What We Do</h4>
        <h2 className="section-title">Our Programs</h2>
        <p className="section-subtitle">Targeted initiatives designed to empower youth, children, and communities across multiple dimensions of life.</p>
        
        <div className="focus-grid">
          {areas.map(area => (
            <div key={area.id} className="focus-card-elegant">
              <img src={area.image} alt={area.title} className="focus-img" />
              <div className="focus-content glass-panel">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <button onClick={() => setSelectedProgram(area)} className="btn-link" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none'}}>
                  Explore Program <span className="arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProgram && (
        <div className="program-modal-overlay" onClick={() => setSelectedProgram(null)}>
          <div className="program-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProgram(null)}>×</button>
            <div className="modal-header">
              <img src={selectedProgram.image} alt={selectedProgram.title} />
              <h2>{selectedProgram.title}</h2>
            </div>
            <div className="modal-body">
              <p className="modal-desc">{selectedProgram.description}</p>
              
              {selectedProgram.details.target && (
                <div className="modal-section">
                  <h4>Target Group</h4>
                  <p>{selectedProgram.details.target}</p>
                </div>
              )}
              
              {selectedProgram.details.activities && selectedProgram.details.activities.length > 0 && (
                <div className="modal-section">
                  <h4>What We Do</h4>
                  <ul>
                    {selectedProgram.details.activities.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedProgram.details.impact && selectedProgram.details.impact.length > 0 && (
                <div className="modal-section">
                  <h4>Impact Numbers</h4>
                  <ul>
                    {selectedProgram.details.impact.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FocusAreas;
