import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Settings, Users, LogOut, Activity, BarChart2, Briefcase, Megaphone, Check, X, Image, Coins } from 'lucide-react';
import './AdminDashboard.css';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = ({ 
  onLogout, campaigns, setCampaigns, impactStats, setImpactStats, 
  volunteers, setVolunteers, partnerships, setPartnerships, fundraisers, setFundraisers,
  galleryImages, setGalleryImages, donations, setDonations,
  siteSettings, setSiteSettings
}) => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [newCampaign, setNewCampaign] = useState({ title: '', goal: '' });
  const fileInputRef = useRef(null);
  const [newImage, setNewImage] = useState({ title: '', description: '', category: 'Events', date: '', preview: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('site_settings')
      .update({
        place: siteSettings.place,
        numbers: siteSettings.numbers,
        email: siteSettings.email
      })
      .eq('id', 1);

    if (error) {
      alert("Error saving settings: " + error.message);
    } else {
      alert("Settings saved successfully!");
    }
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    if (!newCampaign.title || !newCampaign.goal) return;
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        title: newCampaign.title,
        goal: parseInt(newCampaign.goal),
        donated: 0
      }])
      .select();

    if (error) {
      alert("Error adding campaign: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      setCampaigns([...campaigns, data[0]]);
      setNewCampaign({ title: '', goal: '' });
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) {
        alert("Error deleting campaign: " + error.message);
      } else {
        setCampaigns(campaigns.filter(c => c.id !== id));
      }
    }
  };

  const handleSaveImpact = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('impact_stats')
      .update({
        students_counselled: impactStats.studentsCounselled,
        youth_trained: impactStats.youthTrained,
        individuals_reached: impactStats.individualsReached,
        community_events: impactStats.communityEvents
      })
      .eq('id', 1);

    if (error) {
      alert("Error saving impact statistics: " + error.message);
    } else {
      alert("Impact statistics saved successfully!");
    }
  };

  const handleApproveVolunteer = async (id) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ status: 'Active' })
      .eq('id', id);

    if (error) {
      alert("Error approving volunteer: " + error.message);
    } else {
      setVolunteers(volunteers.map(v => v.id === id ? { ...v, status: 'Active' } : v));
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (window.confirm('Are you sure you want to remove this volunteer?')) {
      const { error } = await supabase.from('volunteers').delete().eq('id', id);
      if (error) {
        alert("Error removing volunteer: " + error.message);
      } else {
        setVolunteers(volunteers.filter(v => v.id !== id));
      }
    }
  };

  const handleApproveDonation = async (donationId) => {
    const donation = donations.find(d => d.id === donationId);
    if (!donation) return;

    // Update donation status in DB
    const { error: donationError } = await supabase
      .from('donations')
      .update({ status: 'Approved' })
      .eq('id', donationId);

    if (donationError) {
      alert("Error approving donation: " + donationError.message);
      return;
    }

    // Find the campaign to update its donated amount
    const campaign = campaigns.find(c => c.title === donation.campaignTitle);
    if (campaign) {
      const newDonated = campaign.donated + donation.amount;
      const { error: campaignError } = await supabase
        .from('campaigns')
        .update({ donated: newDonated })
        .eq('id', campaign.id);
        
      if (campaignError) {
        console.error("Error updating campaign progress in DB: ", campaignError.message);
      } else {
        setCampaigns(prev => prev.map(c => 
          c.id === campaign.id ? { ...c, donated: newDonated } : c
        ));
      }
    }

    // Update donation status locally
    setDonations(prev => prev.map(d => 
      d.id === donationId ? { ...d, status: 'Approved' } : d
    ));

    alert(`Donation of ₹${donation.amount.toLocaleString('en-IN')} approved successfully! Campaign progress has been updated.`);
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm('Are you sure you want to delete this donation submission record?')) {
      const { error } = await supabase.from('donations').delete().eq('id', donationId);
      if (error) {
        alert("Error deleting donation record: " + error.message);
      } else {
        setDonations(prev => prev.filter(d => d.id !== donationId));
      }
    }
  };

  const handleApprovePartner = async (id) => {
    const { error } = await supabase
      .from('partnerships')
      .update({ status: 'Active' })
      .eq('id', id);

    if (error) {
      alert("Error approving partnership: " + error.message);
    } else {
      setPartnerships(partnerships.map(p => p.id === id ? { ...p, status: 'Active' } : p));
    }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('Are you sure you want to remove this partnership proposal?')) {
      const { error } = await supabase.from('partnerships').delete().eq('id', id);
      if (error) {
        alert("Error removing partnership: " + error.message);
      } else {
        setPartnerships(partnerships.filter(p => p.id !== id));
      }
    }
  };

  const handleApproveFundraiser = async (id) => {
    const { error } = await supabase
      .from('fundraisers')
      .update({ status: 'Approved' })
      .eq('id', id);

    if (error) {
      alert("Error approving fundraiser: " + error.message);
    } else {
      setFundraisers(fundraisers.map(f => f.id === id ? { ...f, status: 'Approved' } : f));
    }
  };

  const handleDeleteFundraiser = async (id) => {
    if (window.confirm('Are you sure you want to remove this fundraiser campaign?')) {
      const { error } = await supabase.from('fundraisers').delete().eq('id', id);
      if (error) {
        alert("Error removing fundraiser: " + error.message);
      } else {
        setFundraisers(fundraisers.filter(f => f.id !== id));
      }
    }
  };

  // ─── Gallery Handlers ───
  const handleImageFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewImage(prev => ({ ...prev, preview: event.target.result }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file');
      return;
    }
    if (!newImage.title) {
      alert('Please enter a title');
      return;
    }

    setIsUploading(true);
    
    // Generate a unique file path in the gallery bucket
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `photos/${fileName}`;

    // Upload image to Supabase Storage bucket 'Gallery'
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Gallery')
      .upload(filePath, selectedFile);

    if (uploadError) {
      alert("Error uploading image to cloud storage: " + uploadError.message);
      setIsUploading(false);
      return;
    }

    // Retrieve public URL
    const { data: urlData } = supabase.storage
      .from('Gallery')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Save image URL and metadata to database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{
        src: publicUrl,
        title: newImage.title,
        description: newImage.description || '',
        category: newImage.category,
        date: newImage.date || new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      }])
      .select();

    setIsUploading(false);

    if (error) {
      alert("Error saving image record to database: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      setGalleryImages([data[0], ...galleryImages]);
      setNewImage({ title: '', description: '', category: 'Events', date: '', preview: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('Image uploaded and added to gallery successfully!');
    }
  };

  const handleDeleteImage = async (id) => {
    const imageToDelete = galleryImages.find(img => img.id === id);
    if (!imageToDelete) return;

    if (window.confirm('Remove this image from the gallery?')) {
      // 1. Delete database entry
      const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', id);
      if (dbError) {
        alert("Error deleting image from database: " + dbError.message);
        return;
      }

      // 2. Delete cloud storage file if it exists there
      if (imageToDelete.src.includes('/storage/v1/object/public/Gallery/')) {
        const filePath = imageToDelete.src.split('/storage/v1/object/public/Gallery/')[1];
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('Gallery')
            .remove([filePath]);
          if (storageError) {
            console.error("Error removing file from cloud storage:", storageError.message);
          }
        }
      }

      setGalleryImages(galleryImages.filter(img => img.id !== id));
    }
  };

  const renderContent = () => {
    if (activeTab === 'campaigns') {
      return (
        <div className="admin-content">
          <section className="admin-card form-section">
            <h3>Add New Campaign</h3>
            <form onSubmit={handleAddCampaign} className="add-campaign-form">
              <div className="form-group">
                <label>Campaign Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Clean Water Initiative" 
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({...newCampaign, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Goal Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={newCampaign.goal}
                  onChange={(e) => setNewCampaign({...newCampaign, goal: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary form-submit"><Plus size={18} /> Add Campaign</button>
            </form>
          </section>

          <section className="admin-card list-section">
            <h3>Active Campaigns</h3>
            <div className="campaign-list">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="campaign-item">
                  <div className="campaign-info">
                    <h4>{campaign.title}</h4>
                    <p>₹{campaign.donated.toLocaleString('en-IN')} / ₹{campaign.goal.toLocaleString('en-IN')} Raised</p>
                    <div className="mini-progress">
                      <div 
                        className="mini-progress-fill" 
                        style={{ width: `${Math.min(100, (campaign.donated / campaign.goal) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="campaign-actions">
                    <button onClick={() => handleDeleteCampaign(campaign.id)} 
                      className="icon-btn delete"><Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'impact') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Edit Global Impact Statistics</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Update the numbers that show how much we help. These numbers appear in the Trust & Transparency section.
            </p>
            <form onSubmit={handleSaveImpact} style={{ maxWidth: '500px' }}>
              <div className="form-group">
                <label>Students Counselled</label>
                <input 
                  type="text" 
                  value={impactStats.studentsCounselled}
                  onChange={(e) => setImpactStats({...impactStats, studentsCounselled: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Youth Trained</label>
                <input 
                  type="text" 
                  value={impactStats.youthTrained}
                  onChange={(e) => setImpactStats({...impactStats, youthTrained: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Individuals Reached</label>
                <input 
                  type="text" 
                  value={impactStats.individualsReached}
                  onChange={(e) => setImpactStats({...impactStats, individualsReached: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Community Events</label>
                <input 
                  type="text" 
                  value={impactStats.communityEvents}
                  onChange={(e) => setImpactStats({...impactStats, communityEvents: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </section>
        </div>
      );
    }

    if (activeTab === 'volunteers') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Voluntary Portal ({volunteers.length} applicants)</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Manage volunteer applications and current active volunteers. All details including contact info are shown below.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {volunteers.map(vol => (
                <div key={vol.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: vol.status === 'Pending' ? '#fffbeb' : '#f8fafc',
                  borderLeft: vol.status === 'Pending' ? '4px solid #f59e0b' : '4px solid #10b981',
                  transition: 'all 0.2s'
                }}>
                  {/* Top Row — Name, Status, Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '17px', color: 'var(--text-dark)' }}>{vol.name}</h4>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                        backgroundColor: vol.status === 'Active' ? '#dcfce7' : '#fef08a',
                        color: vol.status === 'Active' ? '#166534' : '#854d0e'
                      }}>
                        {vol.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {vol.status === 'Pending' && (
                        <button onClick={() => handleApproveVolunteer(vol.id)} className="icon-btn edit" title="Approve" style={{ display: 'inline-flex', color: '#166534', backgroundColor: '#dcfce7' }}><Check size={16} /></button>
                      )}
                      <button onClick={() => handleDeleteVolunteer(vol.id)} className="icon-btn delete" title="Delete" style={{ display: 'inline-flex' }}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>📧</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</div>
                        <a href={`mailto:${vol.email || ''}`} style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '13px' }}>{vol.email || 'Not provided'}</a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>📱</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</div>
                        <a href={`tel:${vol.phone || ''}`} style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '13px' }}>{vol.phone || 'Not provided'}</a>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>🎯</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</div>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '13px' }}>{vol.role}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>📅</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Applied</div>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '13px' }}>{vol.appliedAt || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {vol.message && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(0,174,239,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--primary-light)' }}>
                      <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Motivation</div>
                      <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '13px', lineHeight: '1.5', fontStyle: 'italic' }}>"{vol.message}"</p>
                    </div>
                  )}
                </div>
              ))}

              {volunteers.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No volunteer applications yet.
                </p>
              )}
            </div>
          </section>
        </div>
      );
    }
    if (activeTab === 'partnerships') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Corporate Partnerships</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Manage partnership applications from corporate entities.
            </p>
            <div className="volunteers-table-container" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                    <th style={{ padding: '12px' }}>Company Name</th>
                    <th style={{ padding: '12px' }}>Contact Person</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerships.map(partner => (
                    <tr key={partner.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{partner.company}</td>
                      <td style={{ padding: '12px' }}>{partner.contact}</td>
                      <td style={{ padding: '12px', color: 'var(--text-gray)' }}>{partner.type}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                          backgroundColor: partner.status === 'Active' ? '#dcfce7' : '#fef08a',
                          color: partner.status === 'Active' ? '#166534' : '#854d0e'
                        }}>{partner.status}</span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                        {partner.status === 'Pending' && (
                          <button onClick={() => handleApprovePartner(partner.id)} className="icon-btn edit" title="Approve" style={{ display: 'inline-flex', color: '#166534', backgroundColor: '#dcfce7' }}><Check size={16} /></button>
                        )}
                        <button onClick={() => handleDeletePartner(partner.id)} className="icon-btn delete" title="Delete" style={{ display: 'inline-flex' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'fundraisers') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Community Fundraisers</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Manage fundraising campaigns initiated by the community.
            </p>
            <div className="volunteers-table-container" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                    <th style={{ padding: '12px' }}>Campaign Name</th>
                    <th style={{ padding: '12px' }}>Type</th>
                    <th style={{ padding: '12px' }}>Target Amount</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fundraisers.map(fund => (
                    <tr key={fund.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{fund.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-gray)' }}>{fund.type}</td>
                      <td style={{ padding: '12px' }}>₹{fund.amount}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                          backgroundColor: fund.status === 'Approved' ? '#dcfce7' : '#fef08a',
                          color: fund.status === 'Approved' ? '#166534' : '#854d0e'
                        }}>{fund.status}</span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                        {fund.status === 'Pending' && (
                          <button onClick={() => handleApproveFundraiser(fund.id)} className="icon-btn edit" title="Approve" style={{ display: 'inline-flex', color: '#166534', backgroundColor: '#dcfce7' }}><Check size={16} /></button>
                        )}
                        <button onClick={() => handleDeleteFundraiser(fund.id)} className="icon-btn delete" title="Delete" style={{ display: 'inline-flex' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      );
    }
    
    if (activeTab === 'settings') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Platform Settings</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Manage your NGO portal preferences, notification emails, and branding.
            </p>
            <form onSubmit={handleSaveSettings} style={{ maxWidth: '600px' }}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Email</label>
                <input 
                  type="email" 
                  value={siteSettings?.email || ''} 
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  required
                />
                <small style={{ color: 'var(--text-gray)', display: 'block', marginTop: '6px' }}>This email is shown in the footer and contact sections of the website.</small>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Contact Number</label>
                <input 
                  type="text" 
                  value={siteSettings?.numbers || ''} 
                  onChange={(e) => setSiteSettings({ ...siteSettings, numbers: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  required
                />
                <small style={{ color: 'var(--text-gray)', display: 'block', marginTop: '6px' }}>Enter the primary NGO phone number. This is also used to generate the floating WhatsApp chat link.</small>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Office Address / Location</label>
                <input 
                  type="text" 
                  value={siteSettings?.place || ''} 
                  onChange={(e) => setSiteSettings({ ...siteSettings, place: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px' }} 
                  required
                />
                <small style={{ color: 'var(--text-gray)', display: 'block', marginTop: '6px' }}>The physical location of the NGO office.</small>
              </div>
              <button type="submit" className="btn btn-primary">Save Settings</button>
            </form>
          </section>
        </div>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <div className="admin-content">
          {/* Upload Form */}
          <section className="admin-card form-section">
            <h3>Upload New Photo</h3>
            <form onSubmit={handleAddImage}>
              {/* Image Upload Area */}
              <div 
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: newImage.preview ? '0' : '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: newImage.preview ? 'transparent' : '#f8fafc',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => { if (!newImage.preview) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { if (!newImage.preview) e.currentTarget.style.borderColor = '#cbd5e1'; }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileSelect}
                  style={{ display: 'none' }}
                />
                {newImage.preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img 
                      src={newImage.preview} 
                      alt="Preview" 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover', 
                        borderRadius: '10px' 
                      }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewImage(prev => ({ ...prev, preview: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(239,68,68,0.9)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.4 }}>📷</div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', margin: 0 }}>
                      {isUploading ? 'Processing...' : 'Click to select an image'}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '6px' }}>
                      JPG, PNG, WebP • Max 5MB
                    </p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Photo Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Annual Day Celebration 2025" 
                  value={newImage.title}
                  onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  placeholder="Brief description of the event or activity" 
                  value={newImage.description}
                  onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newImage.category}
                    onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'Poppins, sans-serif' }}
                  >
                    <option value="Education">Education</option>
                    <option value="Empowerment">Empowerment</option>
                    <option value="Environment">Environment</option>
                    <option value="Community">Community</option>
                    <option value="Events">Events</option>
                    <option value="Health">Health</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date / Month</label>
                  <input 
                    type="text" 
                    placeholder="e.g. June 2025" 
                    value={newImage.date}
                    onChange={(e) => setNewImage({...newImage, date: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary form-submit" disabled={!newImage.preview}>
                <Plus size={18} /> Add to Gallery
              </button>
            </form>
          </section>

          {/* Gallery List */}
          <section className="admin-card list-section">
            <h3>Gallery Photos ({galleryImages.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto' }}>
              {galleryImages.map(img => (
                <div key={img.id} style={{
                  display: 'flex', gap: '14px', padding: '12px',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  background: '#f8fafc', alignItems: 'center',
                  transition: 'all 0.2s'
                }}>
                  <img 
                    src={img.src} 
                    alt={img.title} 
                    style={{ 
                      width: '80px', height: '60px', objectFit: 'cover', 
                      borderRadius: '8px', flexShrink: 0 
                    }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-dark)' }}>{img.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
                        backgroundColor: 'rgba(0, 174, 239, 0.1)', color: 'var(--primary-dark)',
                        fontWeight: '500'
                      }}>
                        {img.category}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{img.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteImage(img.id)} 
                    className="icon-btn delete"
                    title="Remove from gallery"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {galleryImages.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No photos in gallery yet. Upload your first image!
                </p>
              )}
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'donations') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>UPI QR Donation Verification ({donations.length} transactions)</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Review and verify direct UPI QR Code payments. Match the 12-digit UPI Reference Number against your bank statement before approving.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {donations.map(don => (
                <div key={don.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px',
                  background: don.status === 'Pending' ? '#fffbeb' : '#f8fafc',
                  borderLeft: don.status === 'Pending' ? '4px solid #f59e0b' : '4px solid #10b981',
                  transition: 'all 0.2s'
                }}>
                  {/* Top Row — Donor & Status & Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '17px', color: 'var(--text-dark)' }}>{don.donorName}</h4>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500',
                        backgroundColor: don.status === 'Approved' ? '#dcfce7' : '#fef08a',
                        color: don.status === 'Approved' ? '#166534' : '#854d0e'
                      }}>
                        {don.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {don.status === 'Pending' && (
                        <button onClick={() => handleApproveDonation(don.id)} className="icon-btn edit" title="Approve Payment" style={{ display: 'inline-flex', color: '#166534', backgroundColor: '#dcfce7' }}><Check size={16} /></button>
                      )}
                      <button onClick={() => handleDeleteDonation(don.id)} className="icon-btn delete" title="Delete Record" style={{ display: 'inline-flex' }}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>💰</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Donation Amount</div>
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '15px' }}>₹{don.amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>🔑</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>UPI Ref / Txn ID</div>
                        <span style={{ color: 'var(--primary-dark)', fontWeight: 'bold', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '0.5px', background: 'rgba(0,174,239,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                          {don.transactionId}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>🎯</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Campaign</div>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '13px' }}>{don.campaignTitle}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#94a3b8', minWidth: '24px', fontSize: '16px' }}>📅</span>
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Submission Date</div>
                        <span style={{ color: 'var(--text-dark)', fontWeight: '500', fontSize: '13px' }}>{don.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Donor Contact Info */}
                  <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '12.5px', color: 'var(--text-gray)' }}>
                    <div><strong>Email:</strong> <a href={`mailto:${don.email}`} style={{ color: 'var(--primary)' }}>{don.email}</a></div>
                    <div><strong>Phone:</strong> <a href={`tel:${don.phone}`} style={{ color: 'var(--text-dark)' }}>{don.phone}</a></div>
                  </div>
                </div>
              ))}

              {donations.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No donation transactions submitted for verification yet.
                </p>
              )}
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Admin Panel</h2>
          <p>We Are Youth Foundation</p>
        </div>
        <nav className="admin-nav">
          <a href="#" className={activeTab === 'campaigns' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('campaigns'); }}>
            <Activity size={20} /> Campaigns & Goals
          </a>
          <a href="#" className={activeTab === 'donations' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('donations'); }}>
            <Coins size={20} /> Donation Approvals
          </a>
          <a href="#" className={activeTab === 'impact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('impact'); }}>
            <BarChart2 size={20} /> Global Impact Stats
          </a>
          <a href="#" className={activeTab === 'volunteers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('volunteers'); }}>
            <Users size={20} /> Voluntary Portal
          </a>
          <a href="#" className={activeTab === 'partnerships' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('partnerships'); }}>
            <Briefcase size={20} /> Corporate Partners
          </a>
          <a href="#" className={activeTab === 'fundraisers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('fundraisers'); }}>
            <Megaphone size={20} /> Fundraisers
          </a>
          <a href="#" className={activeTab === 'gallery' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('gallery'); }}>
            <Image size={20} /> Gallery Manager
          </a>
          <a href="#" className={activeTab === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}>
            <Settings size={20} /> Settings
          </a>
        </nav>
        <div className="admin-logout">
          <button onClick={onLogout} className="btn-logout"><LogOut size={20} /> Exit to Site</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'campaigns' && 'Manage Campaigns & Goals'}
            {activeTab === 'donations' && 'Donation Verifications'}
            {activeTab === 'impact' && 'Global Impact Statistics'}
            {activeTab === 'volunteers' && 'Voluntary Portal'}
            {activeTab === 'partnerships' && 'Corporate Partnerships'}
            {activeTab === 'fundraisers' && 'Community Fundraisers'}
            {activeTab === 'gallery' && 'Gallery Manager'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <p>
            {activeTab === 'campaigns' && 'Add new fundraising tasks that will automatically appear on the homepage widget.'}
            {activeTab === 'donations' && 'Review UPI QR Code transactions submitted by donors. Match the UPI Ref Number with your bank statement to approve.'}
            {activeTab === 'impact' && 'Update the numbers representing your NGO\'s total reach and impact.'}
            {activeTab === 'volunteers' && 'Review and manage your network of volunteers and applications.'}
            {activeTab === 'partnerships' && 'Review CSR and corporate partnership proposals.'}
            {activeTab === 'fundraisers' && 'Manage community-driven fundraising campaigns.'}
            {activeTab === 'gallery' && 'Upload event photos and manage the website gallery.'}
            {activeTab === 'settings' && 'Configure system preferences.'}
          </p>
        </header>

        {renderContent()}
        
      </main>
    </div>
  );
};

export default AdminDashboard;
