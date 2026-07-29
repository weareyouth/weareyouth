import React, { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './lib/supabaseClient';
import { sendVolunteerNotification } from './lib/emailService';

// Yeh saare UI components hain — ek ek karke import karenge taaki App mein use kar sakein
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
import Team from './components/Team';

// Program detail pages ke liye routing — jab user kisi program par click kare toh uski page khule
import { programs } from './data/programs';
import ProgramDetailPage from './components/ProgramDetailPage';
import AllProgramsPage from './components/AllProgramsPage';
import AllGalleryAlbumsPage from './components/AllGalleryAlbumsPage';
import AllTeamPage from './components/AllTeamPage';

// Blog pages ke liye routing — ek blog click hoga toh uski detail page dikhegi
import { defaultBlogs } from './data/blogs';
import BlogSection from './components/BlogSection';
import AllBlogsPage from './components/AllBlogsPage';
import BlogDetailPage from './components/BlogDetailPage';
import AboutDetailPage from './components/AboutDetailPage';

function App() {
  const [isAdminView, setIsAdminView] = useState(
    window.location.pathname === '/admin' || 
    window.location.pathname === '/admin/' || 
    window.location.hash === '#admin' ||
    window.location.hash === '#/admin'
  );
  const [session, setSession] = useState(null);
  
  // URL ka hash track kar rahe hain — isi se pata chalega user kaunse page par hai
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      
      if (hash.startsWith('#program/') || hash === '#all-programs' || hash === '#gallery-albums' || hash === '#all-team' || hash === '#team' || !hash || hash === '#') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      
      if (hash && hash !== '#' && !hash.startsWith('#program/') && hash !== '#all-programs' && hash !== '#gallery-albums' && hash !== '#all-team' && hash !== '#team') {
        // Jab user wapas homepage section par jaaye — thoda wait karo layout settle hone do
        setTimeout(() => {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    
    // Page load hote hi check karo ki URL mein koi hash pehle se toh nahi hai
    if (window.location.hash) {
      handleHashChange();
    }
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Campaigns ka global state — yahan saari active campaigns ki list store hogi
  const [campaigns, setCampaigns] = useState([]);

  // Volunteers ka state — jo log join karna chahte hain unka data yahan aayega
  const [volunteers, setVolunteers] = useState([]);

  // Corporate partnerships ka state — companies ke proposals yahan store honge
  const [partnerships, setPartnerships] = useState([]);

  // Internship / fundraiser applicants ka state — unka data yahan rakha jaayega
  const [fundraisers, setFundraisers] = useState([]);

  // Impact numbers ka state — students counselled, youth trained, etc. yahan se aate hain
  const [impactStats, setImpactStats] = useState({
    studentsCounselled: '0',
    youthTrained: '0',
    individualsReached: '0',
    communityEvents: '0'
  });

  // Gallery ki images ka state — Supabase se fetch hogi aur yahan store hogi
  const [galleryImages, setGalleryImages] = useState([]);

  // Donations ka state — jo bhi donation form submit kare, woh record yahan aata hai
  const [donations, setDonations] = useState([]);

  // Gallery albums ka state — har album ka naam, cover, aur photos ki list yahan hogi
  const [galleryAlbums, setGalleryAlbums] = useState([]);

  // Site settings ka state — address, phone, email admin panel se change ho sakti hain
  const [siteSettings, setSiteSettings] = useState({
    place: 'Corporate Office, New Delhi, India',
    numbers: '+91 80903 34855',
    email: 'contact@weareyouthfoundation.com'
  });

  // About section ka state — poora About Us content yahan store hota hai
  const [aboutData, setAboutData] = useState({
    title: 'Empowering the Youth, Securing the Future',
    subtitle: 'About Us',
    lead_text: 'We Are Youth Foundation is committed to creating a world where every young person is empowered to reach their full potential.',
    mission_title: 'Our Mission',
    mission_desc: 'To provide quality education, skills training, and mentorship to underprivileged youth across the nation.',
    vision_title: 'Our Vision',
    vision_desc: 'A society where every young mind is nurtured, educated, and equipped to become a leader of tomorrow.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    story_title: 'From a Single Spark to a Movement',
    story_badge: 'Our Origins',
    story_lead: 'It all started with a simple, unwavering belief: that no brilliant young mind should ever be left behind because of their circumstances.',
    story_content: 'Ten years ago, a small group of passionate college students noticed a heartbreaking reality in our local communities—children sitting outside classrooms they couldn\'t afford to enter, and talented youth taking up daily wage jobs just to survive. We didn\'t have massive funding or infrastructure, but we had an abundance of hope.\n\nAs word spread, those three children became thirty, and soon three hundred. We quickly realized that true empowerment doesn\'t stop at textbooks. We expanded our mission to ensure holistic growth—distributing nutritious food to keep them healthy, and setting up modern skills-training centers to equip them for the real world.\n\nToday, the We Are Youth Foundation has had the profound privilege of touching over 100,000 lives. While our scale has grown exponentially, our core philosophy remains exactly the same as it was under that Banyan tree.\n\nWhen you look into the eyes of the youth we serve, you don\'t just see gratitude; you see the fierce, undeniable spark of tomorrow\'s leaders. This isn\'t just our story—it is theirs. And hand in hand with supporters like you, the most beautiful chapters are still waiting to be written.',
    story_quote: 'Our very first classroom was under the shade of a sprawling Banyan tree, with just three children and a borrowed chalkboard. We taught them mathematics, but more importantly, we taught them how to dream.'
  });

  // Programs ka state — pehle default programs load hote hain, phir Supabase se update honge
  const [dbPrograms, setDbPrograms] = useState(programs);

  // Team members ka state — Supabase se fetch hoga aur yahan store hoga
  const [teamMembers, setTeamMembers] = useState([]);

  // Blogs ka state — pehle default blogs dikhenge, phir Supabase se update honge
  const [dbBlogs, setDbBlogs] = useState(defaultBlogs);

  // Success stories ka state — approved stories yahan se website par display hongi
  const [dbStories, setDbStories] = useState([
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
  ]);

  // Jaise hi app load ho, Supabase se saara data ek baar mein fetch kar lo
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Campaigns fetch kar rahe hain — ascending order mein (purani pehle)
        const { data: campaignsData } = await supabase.from('campaigns').select('*').order('id', { ascending: true });
        if (campaignsData) setCampaigns(campaignsData);

        // Volunteers ki list fetch kar rahe hain database se
        const { data: volunteersData } = await supabase.from('volunteers').select('*').order('id', { ascending: true });
        if (volunteersData) setVolunteers(volunteersData);

        // Corporate partnerships ka data fetch ho raha hai
        const { data: partnershipsData } = await supabase.from('partnerships').select('*').order('id', { ascending: true });
        if (partnershipsData) setPartnerships(partnershipsData);

        // Internship / fundraiser applications fetch kar rahe hain
        const { data: fundraisersData } = await supabase.from('fundraisers').select('*').order('id', { ascending: true });
        if (fundraisersData) setFundraisers(fundraisersData);

        // Impact stats fetch kar rahe hain — row ID 1 ka single record lena hai
        const { data: impactData } = await supabase.from('impact_stats').select('*').eq('id', 1).single();
        if (impactData) {
          setImpactStats({
            studentsCounselled: impactData.students_counselled,
            youthTrained: impactData.youth_trained,
            individualsReached: impactData.individuals_reached,
            communityEvents: impactData.community_events
          });
        }

        // Gallery ki images fetch kar rahe hain — descending order mein (nayi pehle)
        const { data: galleryData } = await supabase.from('gallery_images').select('*').order('id', { descending: true });
        if (galleryData) setGalleryImages(galleryData);

        // Donation submissions fetch kar rahe hain — nayi donations pehle dikhni chahiye
        const { data: donationsData } = await supabase.from('donations').select('*').order('id', { descending: true });
        if (donationsData) setDonations(donationsData);

        // Site settings fetch kar rahe hain — address, phone, email admin ne set ki hogi
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (settingsData) {
          setSiteSettings({
            place: settingsData.place,
            numbers: settingsData.numbers,
            email: settingsData.email
          });
        }

        // About section ka content fetch kar rahe hain — agar table exist nahi karti toh default data use hoga
        try {
          const { data: aboutContentData, error: aboutErr } = await supabase.from('about_content').select('*').eq('id', 1).single();
          if (aboutContentData && !aboutErr) {
            setAboutData(aboutContentData);
          }
        } catch (aboutFetchErr) {
          console.log("Could not load about_content from Supabase, using default local data: ", aboutFetchErr);
        }

        // Custom programs fetch kar rahe hain — admin ne jo programs add kiye hain woh aayenge
        const { data: dbProgs, error: progsErr } = await supabase.from('programs').select('*').order('id', { ascending: true });
        if (dbProgs && !progsErr) {
          const parsedProgs = dbProgs.map(p => ({
            ...p,
            details: typeof p.details === 'string' ? JSON.parse(p.details) : p.details
          }));
          setDbPrograms(parsedProgs);
        }

        // Stories fetch kar rahe hain — approved aur unapproved dono, admin sab manage karega
        const { data: dbStors, error: storsErr } = await supabase.from('stories').select('*').order('id', { descending: true });
        if (dbStors && !storsErr) {
          setDbStories(dbStors);
        }

        // Gallery albums fetch kar rahe hain — JSONB images field ko parse karna padega
        const { data: albumsData, error: albumsErr } = await supabase.from('gallery_albums').select('*').order('id', { descending: true });
        if (albumsData && !albumsErr) {
          const parsedAlbums = albumsData.map(a => ({
            ...a,
            images: typeof a.images === 'string' ? JSON.parse(a.images) : a.images
          }));
          setGalleryAlbums(parsedAlbums);
        }

        // Team members fetch kar rahe hain — admin panel se add/update kiye jaate hain
        const { data: teamData, error: teamErr } = await supabase.from('team_members').select('*').order('id', { ascending: true });
        if (teamData && !teamErr) {
          setTeamMembers(teamData);
        }

        // Blogs fetch kar rahe hain — nayi blogs pehle dikhni chahiye
        const { data: dbBlogsData, error: blogsErr } = await supabase.from('blogs').select('*').order('id', { descending: true });
        if (dbBlogsData && !blogsErr) {
          setDbBlogs(dbBlogsData);
        }
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
      }
    };

    loadAllData();
  }, []);

  // Auth ka state sun rahe hain — login/logout hone par session update hoga automatically
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Admin route check karna — agar URL /admin hai toh admin panel dikhao
  useEffect(() => {
    const checkAdminRoute = () => {
      const isPathAdmin = window.location.pathname === '/admin' || window.location.pathname === '/admin/';
      const isHashAdmin = window.location.hash === '#admin' || window.location.hash === '#/admin';
      if (isPathAdmin || isHashAdmin) {
        setIsAdminView(true);
      }
    };

    // Page load hote hi admin route check karo
    checkAdminRoute();

    // Hash change hone par bhi admin check karo — jaise #admin type kiya toh
    window.addEventListener('hashchange', checkAdminRoute);
    
    // Browser ka back button press hone par bhi check karo
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
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
      throw error;
    } else if (data && data.length > 0) {
      setVolunteers(prev => [...prev, data[0]]);
      
      try {
        await sendVolunteerNotification(newVol);
      } catch (err) {
        console.error("Background email notification failed:", err);
        // Email fail ho toh bhi throw mat karo — database mein record save ho chuka hai, that's enough!
      }
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
      throw error;
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
      throw error;
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
          onBack={() => {
            setIsAdminView(false);
            window.history.pushState({}, '', '/');
            window.location.hash = '#';
          }}
        />
      );
    }

    return (
      <AdminDashboard 
        onLogout={async () => {
          await supabase.auth.signOut();
          setIsAdminView(false);
          window.history.pushState({}, '', '/');
          window.location.hash = '#';
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
        programs={dbPrograms}
        setPrograms={setDbPrograms}
        stories={dbStories}
        setStories={setDbStories}
        galleryAlbums={galleryAlbums}
        setGalleryAlbums={setGalleryAlbums}
        teamMembers={teamMembers}
        setTeamMembers={setTeamMembers}
        blogs={dbBlogs}
        setBlogs={setDbBlogs}
        aboutData={aboutData}
        setAboutData={setAboutData}
      />
    );
  }

  const getActiveProgram = () => {
    if (currentHash.startsWith('#program/')) {
      const slug = currentHash.replace('#program/', '');
      return dbPrograms.find(p => p.slug === slug);
    }
    return null;
  };

  const getActiveBlog = () => {
    if (currentHash.startsWith('#blog/')) {
      const slug = currentHash.replace('#blog/', '');
      return dbBlogs.find(b => b.slug === slug);
    }
    return null;
  };

  const activeProgram = getActiveProgram();
  const activeBlog = getActiveBlog();
  const isSubPage = !!activeProgram || !!activeBlog || currentHash === '#about-story' || currentHash === '#all-programs' || currentHash === '#gallery-albums' || currentHash === '#all-team' || currentHash === '#team' || currentHash === '#all-blogs';

  return (
    <div className="app">
      <Header onAdminClick={() => setIsAdminView(true)} onDonateClick={() => handleOpenDonateModal()} isSubPage={isSubPage} />
      {activeProgram ? (
        <ProgramDetailPage 
          program={activeProgram} 
          onDonateClick={handleOpenDonateModal} 
          onJoinClick={() => {
            window.location.hash = '#get-involved';
          }}
        />
      ) : activeBlog ? (
        <BlogDetailPage blog={activeBlog} />
      ) : currentHash === '#about-story' ? (
        <AboutDetailPage aboutData={aboutData} />
      ) : currentHash === '#all-programs' ? (
        <AllProgramsPage programs={dbPrograms} />
      ) : currentHash === '#all-blogs' ? (
        <AllBlogsPage blogs={dbBlogs} />
      ) : currentHash === '#gallery-albums' ? (
        <AllGalleryAlbumsPage albums={galleryAlbums} />
      ) : (currentHash === '#all-team' || currentHash === '#team') ? (
        <AllTeamPage teamMembers={teamMembers} />
      ) : (
        <>
          <Hero onDonateClick={() => handleOpenDonateModal()} />
          <ActiveCampaigns campaigns={campaigns} onDonateClick={handleOpenDonateModal} />
          <About aboutData={aboutData} />
          <FocusAreas programs={dbPrograms} />
          <Gallery albums={galleryAlbums} />
          <Stories stories={dbStories} />
          <BlogSection blogs={dbBlogs} />
          <Impact impactStats={impactStats} />
          <GetInvolved 
            onAddVolunteer={handleAddVolunteer} 
            onAddPartner={handleAddPartner}
            onAddFundraiser={handleAddFundraiser}
          />
          <Team teamMembers={teamMembers} />
        </>
      )}
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
