import React, { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './lib/supabaseClient';
import { sendVolunteerNotification } from './lib/emailService';

// Components
import Header from './components/Header';
import Hero from './components/Hero';
import ActiveCampaigns from './components/ActiveCampaigns';
import About from './components/About';
import FocusAreas from './components/FocusAreas';
import Impact from './components/Impact';
import Stories from './components/Stories';
import Gallery from './components/Gallery';
import GetInvolved from './components/GetInvolved';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import DonationModal from './components/DonationModal';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [session, setSession] = useState(null);

  // Global State for Campaigns
  const [campaigns, setCampaigns] = useState([]);

  // Global State for Volunteers
  const [volunteers, setVolunteers] = useState([]);

  // Global State for Partnerships
  const [partnerships, setPartnerships] = useState([]);

  // Global State for Fundraisers
  const [fundraisers, setFundraisers] = useState([]);

  // Global State for Impact
  const [impactStats, setImpactStats] = useState({
    studentsCounselled: '0',
    youthTrained: '0',
    individualsReached: '0',
    communityEvents: '0'
  });

  // Global State for Gallery Images
  const [galleryImages, setGalleryImages] = useState([]);

  // Global State for Donations (UPI QR Submission)
  const [donations, setDonations] = useState([]);

  // Global State for Site Settings (Place, Numbers, Email)
  const [siteSettings, setSiteSettings] = useState({
    place: 'Corporate Office, New Delhi, India',
    numbers: '+91 80903 34855',
    email: 'contact@weareyouthfoundation.com'
  });

  // Load all data from Supabase on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch campaigns
        const { data: campaignsData } = await supabase.from('campaigns').select('*').order('id', { ascending: true });
        if (campaignsData) setCampaigns(campaignsData);

        // Fetch volunteers
        const { data: volunteersData } = await supabase.from('volunteers').select('*').order('id', { ascending: true });
        if (volunteersData) setVolunteers(volunteersData);

        // Fetch partnerships
        const { data: partnershipsData } = await supabase.from('partnerships').select('*').order('id', { ascending: true });
        if (partnershipsData) setPartnerships(partnershipsData);

        // Fetch fundraisers
        const { data: fundraisersData } = await supabase.from('fundraisers').select('*').order('id', { ascending: true });
        if (fundraisersData) setFundraisers(fundraisersData);

        // Fetch impact_stats
        const { data: impactData } = await supabase.from('impact_stats').select('*').eq('id', 1).single();
        if (impactData) {
          setImpactStats({
            studentsCounselled: impactData.students_counselled,
            youthTrained: impactData.youth_trained,
            individualsReached: impactData.individuals_reached,
            communityEvents: impactData.community_events
          });
        }

        // Fetch gallery images
        const { data: galleryData } = await supabase.from('gallery_images').select('*').order('id', { descending: true });
        if (galleryData) setGalleryImages(galleryData);

        // Fetch donations
        const { data: donationsData } = await supabase.from('donations').select('*').order('id', { descending: true });
        if (donationsData) setDonations(donationsData);

        // Fetch site settings
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (settingsData) {
          setSiteSettings({
            place: settingsData.place,
            numbers: settingsData.numbers,
            email: settingsData.email
          });
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      }
    };

    loadAllData();
  }, []);

  // Listen to auth state changes to persist/clear the active login session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const handleOpenDonateModal = (campaignId = null) => {
    setSelectedCampaignId(campaignId);
    setIsDonateModalOpen(true);
  };

  const handleProcessDonation = async (campaignId, amount) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;
    const newDonated = campaign.donated + amount;
    const { error } = await supabase
      .from('campaigns')
      .update({ donated: newDonated })
      .eq('id', campaignId);
    
    if (!error) {
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId ? { ...c, donated: newDonated } : c
      ));
    }
  };

  const handleAddVolunteer = async (newVol) => {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{
        name: newVol.name,
        email: newVol.email,
        phone: newVol.phone,
        role: newVol.role,
        message: newVol.message,
        status: 'Pending'
      }])
      .select();

    if (error) {
      alert("Error submitting volunteer details: " + error.message);
    } else if (data && data.length > 0) {
      setVolunteers(prev => [...prev, data[0]]);
      
      // Automatically send background email notification to the NGO leader
      sendVolunteerNotification(newVol).catch(err => {
        console.error("Background email notification failed:", err);
      });
    }
  };

  const handleAddPartner = async (newPart) => {
    const { data, error } = await supabase
      .from('partnerships')
      .insert([{
        company: newPart.company,
        contact: newPart.contact,
        type: newPart.type,
        status: 'Pending'
      }])
      .select();

    if (error) {
      alert("Error submitting partnership request: " + error.message);
    } else if (data && data.length > 0) {
      setPartnerships(prev => [...prev, data[0]]);
    }
  };

  const handleAddFundraiser = async (newFund) => {
    const { data, error } = await supabase
      .from('fundraisers')
      .insert([{
        name: newFund.name,
        type: newFund.type,
        amount: parseInt(newFund.amount) || 0,
        status: 'Pending'
      }])
      .select();

    if (error) {
      alert("Error starting fundraiser: " + error.message);
    } else if (data && data.length > 0) {
      setFundraisers(prev => [...prev, data[0]]);
    }
  };

  const handleAddDonationSubmission = async (newDonation) => {
    const { data, error } = await supabase
      .from('donations')
      .insert([{
        donor_name: newDonation.donorName,
        email: newDonation.email,
        phone: newDonation.phone,
        amount: newDonation.amount,
        campaign_title: newDonation.campaignTitle,
        transaction_id: newDonation.transactionId,
        status: 'Pending'
      }])
      .select();

    if (error) {
      alert("Error submitting donation: " + error.message);
    } else if (data && data.length > 0) {
      setDonations(prev => [data[0], ...prev]);
    }
  };

  if (isAdminView) {
    if (!session) {
      return (
        <AdminLogin 
          onLoginSuccess={(newSession) => setSession(newSession)}
          onBack={() => setIsAdminView(false)}
        />
      );
    }

    return (
      <AdminDashboard 
        onLogout={async () => {
          await supabase.auth.signOut();
          setIsAdminView(false);
        }} 
        campaigns={campaigns} 
        setCampaigns={setCampaigns}
        impactStats={impactStats}
        setImpactStats={setImpactStats}
        volunteers={volunteers}
        setVolunteers={setVolunteers}
        partnerships={partnerships}
        setPartnerships={setPartnerships}
        fundraisers={fundraisers}
        setFundraisers={setFundraisers}
        galleryImages={galleryImages}
        setGalleryImages={setGalleryImages}
        donations={donations}
        setDonations={setDonations}
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
      />
    );
  }

  return (
    <div className="app">
      <Header onAdminClick={() => setIsAdminView(true)} onDonateClick={() => handleOpenDonateModal()} />
      <Hero onDonateClick={() => handleOpenDonateModal()} />
      <ActiveCampaigns campaigns={campaigns} onDonateClick={handleOpenDonateModal} />
      <About />
      <FocusAreas />
      <Impact impactStats={impactStats} />
      <Stories />
      <Gallery images={galleryImages} />
      <GetInvolved 
        onAddVolunteer={handleAddVolunteer} 
        onAddPartner={handleAddPartner}
        onAddFundraiser={handleAddFundraiser}
      />
      <Footer siteSettings={siteSettings} />
      <WhatsAppButton siteSettings={siteSettings} />
      <DonationModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)}
        campaigns={campaigns}
        initialCampaignId={selectedCampaignId}
        onProcessDonation={handleProcessDonation}
        onAddDonationSubmission={handleAddDonationSubmission}
      />
    </div>
  );
}

export default App;
