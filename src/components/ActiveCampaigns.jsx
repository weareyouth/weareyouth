import React from 'react';
import './ActiveCampaigns.css';

const ActiveCampaigns = ({ campaigns, onDonateClick }) => {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <section id="campaigns" className="section active-campaigns">
      <div className="container">
        <h4 className="subtitle text-gold text-center" style={{textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', fontSize: '14px', fontWeight: '600'}}>Urgent Needs</h4>
        <h2 className="section-title" style={{textAlign: 'center'}}>Active Campaigns</h2>
        <p className="section-subtitle" style={{textAlign: 'center', margin: '0 auto 50px auto'}}>Your contribution makes an immediate difference. Choose a cause and help us reach our goals.</p>
        
        <div className="campaigns-grid">
          {campaigns.map(campaign => {
            const percentage = Math.min(100, Math.max(0, (campaign.donated / campaign.goal) * 100));
            return (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-card-header">
                  <h3>{campaign.title}</h3>
                </div>
                <div className="campaign-card-body">
                  <h2 className="card-percentage">{Math.floor(percentage)}%</h2>
                  <div className="card-progress-container">
                    <div className="card-progress-track">
                      <div className="card-progress-fill" style={{ width: `${percentage}%` }}>
                        <div className="card-progress-thumb"></div>
                      </div>
                    </div>
                  </div>
                  <div className="card-donation-stats">
                    <p><strong>₹{campaign.donated.toLocaleString('en-IN')}</strong> Raised</p>
                    <p><strong>₹{campaign.goal.toLocaleString('en-IN')}</strong> Goal</p>
                  </div>
                  <button className="btn btn-primary w-100" style={{marginTop: '24px', width: '100%'}} onClick={() => onDonateClick(campaign.id)}>Donate to this Cause</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActiveCampaigns;
