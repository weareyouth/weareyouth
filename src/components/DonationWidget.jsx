import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './DonationWidget.css';

const DonationWidget = ({ campaigns = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (campaigns.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [campaigns.length]);

  if (!campaigns || campaigns.length === 0) return null;

  const activeCampaign = campaigns[currentIndex] || campaigns[0];
  const percentage = Math.min(100, Math.max(0, (activeCampaign.donated / activeCampaign.goal) * 100));

  return (
    <div className="donation-widget">
      <div className="campaign-header">
        <h4 className="campaign-title">{activeCampaign.title}</h4>
      </div>
      
      <h3 className="donation-percentage">{Math.floor(percentage)}%</h3>
      
      <div className="progress-container">
        <div className="progress-track">
          <motion.div 
            className="progress-fill" 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="progress-thumb"></div>
          </motion.div>
        </div>
      </div>
      
      <div className="donation-stats">
        <p className="donation-current">{activeCampaign.donated.toLocaleString('en-IN')} Donated of</p>
        <p className="donation-goal">{activeCampaign.goal.toLocaleString('en-IN')} Goal</p>
      </div>

      {campaigns.length > 1 && (
        <div className="campaign-dots">
          {campaigns.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationWidget;
