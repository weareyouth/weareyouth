import React from 'react';
import './StoryModal.css';

const StoryModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="story-modal-overlay" onClick={onClose}>
      <div className="story-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="story-header">
          <span className="story-badge">Our Origins</span>
          <h2>From a Single Spark to a Movement</h2>
        </div>
        <div className="story-body">
          <p className="story-lead">
            It all started with a simple, unwavering belief: that no brilliant young mind should ever be left behind because of their circumstances.
          </p>
          <p>
            Ten years ago, a small group of passionate college students noticed a heartbreaking reality in our local communities—children sitting outside classrooms they couldn't afford to enter, and talented youth taking up daily wage jobs just to survive. We didn't have massive funding or infrastructure, but we had an abundance of hope.
          </p>
          <div className="story-highlight">
            "Our very first classroom was under the shade of a sprawling Banyan tree, with just three children and a borrowed chalkboard. We taught them mathematics, but more importantly, we taught them how to dream."
          </div>
          <p>
            As word spread, those three children became thirty, and soon three hundred. We quickly realized that true empowerment doesn't stop at textbooks. We expanded our mission to ensure holistic growth—distributing nutritious food to keep them healthy, and setting up modern skills-training centers to equip them for the real world. 
          </p>
          <p>
            Today, the <strong>We Are Youth Foundation</strong> has had the profound privilege of touching over 100,000 lives. While our scale has grown exponentially, our core philosophy remains exactly the same as it was under that Banyan tree.
          </p>
          <p>
            When you look into the eyes of the youth we serve, you don't just see gratitude; you see the fierce, undeniable spark of tomorrow's leaders. This isn't just our story—it is theirs. And hand in hand with supporters like you, the most beautiful chapters are still waiting to be written.
          </p>
        </div>
        <div className="story-footer">
          <button className="btn btn-primary" onClick={onClose}>Close Story</button>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;
