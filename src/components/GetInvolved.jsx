import React, { useState } from 'react';
import './GetInvolved.css';

const GetInvolved = ({ onAddVolunteer, onAddPartner, onAddFundraiser }) => {
  const [modalType, setModalType] = useState(null); // 'volunteer', 'partner', 'fundraise'
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', role: '', message: '', company: '', type: '', amount: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalType === 'volunteer') {
      if (!formData.name || !formData.email || !formData.phone || !formData.role) return;
      onAddVolunteer({
        id: Date.now(), 
        name: formData.name, 
        email: formData.email, 
        phone: formData.phone, 
        role: formData.role, 
        message: formData.message || '',
        status: 'Pending',
        appliedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    } 
    else if (modalType === 'partner') {
      if (!formData.company || !formData.name || !formData.email || !formData.type) return;
      onAddPartner({
        id: Date.now(), 
        company: formData.company, 
        contact: formData.name, 
        email: formData.email,
        phone: formData.phone,
        type: formData.type, 
        status: 'Pending'
      });
    }
    else if (modalType === 'fundraise') {
      if (!formData.name || !formData.email || !formData.type || !formData.amount) return;
      onAddFundraiser({
        id: Date.now(), 
        name: formData.name, 
        email: formData.email,
        phone: formData.phone,
        type: formData.type, 
        amount: formData.amount, 
        status: 'Pending'
      });
    }

    alert('Thank you! Your application has been submitted and an email notification has been sent to the foundation leader.');
    setModalType(null);
    setFormData({ name: '', email: '', phone: '', role: '', message: '', company: '', type: '', amount: '' });
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({ name: '', email: '', phone: '', role: '', message: '', company: '', type: '', amount: '' });
  };

  return (
    <>
      <section className="section get-involved-elegant" id="get-involved">
        <div className="container">
          <div className="involve-header text-center">
            <h4 className="subtitle text-gold">Join The Movement</h4>
            <h2 className="section-title text-white">Get Involved Today</h2>
            <p className="section-subtitle text-white-50">Be the change you want to see. We have multiple avenues for you to contribute your time, skills, and resources.</p>
          </div>
          
          <div className="involve-grid-elegant">
            <div className="involve-card-elegant glass-panel-dark">
              <div className="involve-icon-elegant">🤝</div>
              <h3>Corporate Partnerships</h3>
              <p>Align your brand with our vision. Let's create impactful CSR programs together.</p>
              <button className="btn btn-glass" onClick={() => setModalType('partner')}>Partner With Us</button>
            </div>
            
            <div className="involve-card-elegant highlight-card">
              <div className="involve-icon-elegant">🙌</div>
              <h3 style={{color: 'var(--bg-white)'}}>Volunteer With Us</h3>
              <p style={{color: 'rgba(255,255,255,0.9)'}}>Join our passionate network of volunteers and make a direct impact on the ground.</p>
              <button className="btn btn-white" onClick={() => setModalType('volunteer')}>Apply Now</button>
            </div>
            
            <div className="involve-card-elegant glass-panel-dark">
              <div className="involve-icon-elegant">📢</div>
              <h3>Fundraise</h3>
              <p>Dedicate your special days or run campaigns to raise funds for our educational initiatives.</p>
              <button className="btn btn-glass" onClick={() => setModalType('fundraise')}>Start Campaign</button>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Modal */}
      {modalType && (
        <div className="volunteer-modal-overlay" onClick={closeModal}>
          <div className="volunteer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>&times;</button>
            
            {modalType === 'volunteer' && (
              <>
                <h2>Join Our Team</h2>
                <p>Fill out this form and we'll get back to you soon.</p>
                <form onSubmit={handleSubmit} className="volunteer-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required placeholder="Rahul Sharma" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required placeholder="rahul@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" required placeholder="+91 80903 34855" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Role of Interest *</label>
                    <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                      <option value="">Select a role</option>
                      <option value="Field Worker">Field Worker</option>
                      <option value="Event Coordinator">Event Coordinator</option>
                      <option value="Fundraiser">Fundraiser</option>
                      <option value="Teacher/Mentor">Teacher / Mentor</option>
                      <option value="Tech Support">Tech Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Why do you want to join? (Optional)</label>
                    <textarea rows="3" placeholder="Tell us a little about yourself..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary submit-btn">Submit Application</button>
                </form>
              </>
            )}

            {modalType === 'partner' && (
              <>
                <h2>Corporate Partnership</h2>
                <p>Let's create impactful CSR programs together.</p>
                <form onSubmit={handleSubmit} className="volunteer-form">
                  <div className="form-group">
                    <label>Company Name *</label>
                    <input type="text" required placeholder="TechCorp India" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Contact Person *</label>
                    <input type="text" required placeholder="Anita Desai" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required placeholder="anita@techcorp.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="+91 80903 34855" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Partnership Type *</label>
                    <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="">Select type</option>
                      <option value="CSR Initiative">CSR Initiative</option>
                      <option value="Event Sponsorship">Event Sponsorship</option>
                      <option value="Employee Volunteering">Employee Volunteering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Additional Message (Optional)</label>
                    <textarea rows="3" placeholder="How would you like to partner with us?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary submit-btn">Submit Proposal</button>
                </form>
              </>
            )}

            {modalType === 'fundraise' && (
              <>
                <h2>Start a Campaign</h2>
                <p>Dedicate your special days to raise funds for education.</p>
                <form onSubmit={handleSubmit} className="volunteer-form">
                  <div className="form-group">
                    <label>Your Full Name *</label>
                    <input type="text" required placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" required placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Campaign Type *</label>
                    <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="">Select type</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Memorial">Memorial</option>
                      <option value="Challenge/Marathon">Challenge / Marathon</option>
                      <option value="Wedding/Anniversary">Wedding / Anniversary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Amount (₹) *</label>
                    <input type="number" required placeholder="50000" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Campaign Description (Optional)</label>
                    <textarea rows="3" placeholder="Tell us about your campaign..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary submit-btn">Start Campaign</button>
                </form>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default GetInvolved;
