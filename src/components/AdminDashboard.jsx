import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit3, Settings, Users, LogOut, Activity, BarChart2, Briefcase, Megaphone, Check, X, Image, Coins, Menu } from 'lucide-react';
import './AdminDashboard.css';
import { supabase } from '../lib/supabaseClient';

const AdminDashboard = ({ 
  onLogout, campaigns, setCampaigns, impactStats, setImpactStats, 
  volunteers, setVolunteers, partnerships, setPartnerships, fundraisers, setFundraisers,
  galleryImages, setGalleryImages, donations, setDonations,
  siteSettings, setSiteSettings, programs, setPrograms, stories, setStories,
  galleryAlbums, setGalleryAlbums, teamMembers = [], setTeamMembers,
  blogs = [], setBlogs, aboutData, setAboutData
}) => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ title: '', goal: '' });
  const fileInputRef = useRef(null);
  const [newImage, setNewImage] = useState({ title: '', description: '', category: 'Events', date: '', preview: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Program Manager States
  const [newProgram, setNewProgram] = useState({ title: '', description: '', image: '', target: '', activities: '', impact: '', preview: '' });
  const [selectedProgFile, setSelectedProgFile] = useState(null);
  const [isProgUploading, setIsProgUploading] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState(null);
  const progFileInputRef = useRef(null);

  // Story Manager States
  const [newStory, setNewStory] = useState({ name: '', role: '', quote: '', image: '', preview: '' });
  const [selectedStoryFile, setSelectedStoryFile] = useState(null);
  const [isStoryUploading, setIsStoryUploading] = useState(false);
  const storyFileInputRef = useRef(null);

  // Team Manager States
  const [newMember, setNewMember] = useState({ name: '', role: '', bio: '', linkedin: '', twitter: '', email: '', image: '', preview: '' });
  const [selectedMemberFile, setSelectedMemberFile] = useState(null);
  const [isMemberUploading, setIsMemberUploading] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const memberFileInputRef = useRef(null);

  // Album Manager States
  const [newAlbum, setNewAlbum] = useState({ title: '', description: '', category: 'Events', cover_image: '', previewCover: '' });
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedPhotosFiles, setSelectedPhotosFiles] = useState([]);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [isAlbumUploading, setIsAlbumUploading] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const coverInputRef = useRef(null);
  const photosInputRef = useRef(null);
  
  // Blog Manager States
  const [newBlog, setNewBlog] = useState({ title: '', summary: '', content: '', category: 'Events', read_time: '3 min read', author: 'Admin', image: '', preview: '' });
  const [selectedBlogFile, setSelectedBlogFile] = useState(null);
  const [isBlogUploading, setIsBlogUploading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const blogFileInputRef = useRef(null);

  // About Section States & Handlers
  const [selectedAboutFile, setSelectedAboutFile] = useState(null);
  const [isAboutUploading, setIsAboutUploading] = useState(false);
  const aboutImgInputRef = useRef(null);

  const handleAboutFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedAboutFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAboutData(prev => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setIsAboutUploading(true);
    let imageUrl = aboutData.image;

    // If a new file is selected, upload it
    if (selectedAboutFile) {
      try {
        const fileExt = selectedAboutFile.name.split('.').pop();
        const fileName = `about-${Date.now()}.${fileExt}`;
        const filePath = `about/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('Gallery')
          .upload(filePath, selectedAboutFile);

        if (uploadError) {
          alert("Error uploading about image: " + uploadError.message);
          setIsAboutUploading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('Gallery')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("Storage upload failed: ", uploadErr);
      }
    }

    const updatedAbout = {
      title: aboutData.title,
      subtitle: aboutData.subtitle,
      lead_text: aboutData.lead_text,
      mission_title: aboutData.mission_title,
      mission_desc: aboutData.mission_desc,
      vision_title: aboutData.vision_title,
      vision_desc: aboutData.vision_desc,
      image: imageUrl,
      story_title: aboutData.story_title,
      story_badge: aboutData.story_badge,
      story_lead: aboutData.story_lead,
      story_content: aboutData.story_content,
      story_quote: aboutData.story_quote
    };

    // Update in Supabase
    try {
      const { error } = await supabase
        .from('about_content')
        .update(updatedAbout)
        .eq('id', 1);

      setIsAboutUploading(false);

      if (error) {
        // Fallback: update local state anyway
        setAboutData({ ...aboutData, image: imageUrl });
        alert("Note: Settings updated locally in session. However, to persist this change permanently, make sure you run the SQL migration to create the 'about_content' table in your Supabase project. Database Error: " + error.message);
      } else {
        setAboutData({ ...aboutData, image: imageUrl });
        setSelectedAboutFile(null);
        alert("About Section content saved successfully in Database!");
      }
    } catch (dbErr) {
      setIsAboutUploading(false);
      setAboutData({ ...aboutData, image: imageUrl });
      alert("Note: Settings updated locally in session. However, to persist this change permanently, make sure you run the SQL migration to create the 'about_content' table in your Supabase project.");
    }
  };
  
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

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
    triggerConfirm(
      'Delete Campaign?',
      'Are you sure you want to delete this campaign? This action cannot be undone.',
      async () => {
        const { error } = await supabase.from('campaigns').delete().eq('id', id);
        if (error) {
          alert("Error deleting campaign: " + error.message);
        } else {
          setCampaigns(campaigns.filter(c => c.id !== id));
        }
      }
    );
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
    triggerConfirm(
      'Remove Volunteer?',
      'Are you sure you want to remove this volunteer from the list?',
      async () => {
        const { error } = await supabase.from('volunteers').delete().eq('id', id);
        if (error) {
          alert("Error removing volunteer: " + error.message);
        } else {
          setVolunteers(volunteers.filter(v => v.id !== id));
        }
      }
    );
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
    triggerConfirm(
      'Delete Donation Record?',
      'Are you sure you want to delete this donation submission record? This action cannot be undone.',
      async () => {
        const { error } = await supabase.from('donations').delete().eq('id', donationId);
        if (error) {
          alert("Error deleting donation record: " + error.message);
        } else {
          setDonations(prev => prev.filter(d => d.id !== donationId));
        }
      }
    );
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
    triggerConfirm(
      'Remove Partnership Proposal?',
      'Are you sure you want to remove this partnership proposal?',
      async () => {
        const { error } = await supabase.from('partnerships').delete().eq('id', id);
        if (error) {
          alert("Error removing partnership: " + error.message);
        } else {
          setPartnerships(partnerships.filter(p => p.id !== id));
        }
      }
    );
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
    triggerConfirm(
      'Remove Fundraiser?',
      'Are you sure you want to remove this fundraiser campaign?',
      async () => {
        const { error } = await supabase.from('fundraisers').delete().eq('id', id);
        if (error) {
          alert("Error removing fundraiser: " + error.message);
        } else {
          setFundraisers(fundraisers.filter(f => f.id !== id));
        }
      }
    );
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

    triggerConfirm(
      'Delete Gallery Photo?',
      'Are you sure you want to remove this image from the gallery?',
      async () => {
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
    );
  };

  // ─── Blogs Handlers ───
  const handleBlogFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedBlogFile(file);
    setIsBlogUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewBlog(prev => ({ ...prev, preview: event.target.result }));
      setIsBlogUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.summary) {
      alert('Please fill in title, summary, and content');
      return;
    }

    setIsBlogUploading(true);
    let imageUrl = newBlog.image;

    if (selectedBlogFile) {
      const fileExt = selectedBlogFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(filePath, selectedBlogFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setIsBlogUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('Gallery')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blogData = {
      slug,
      title: newBlog.title,
      summary: newBlog.summary,
      content: newBlog.content,
      image: imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: newBlog.category || 'Events',
      read_time: newBlog.read_time || '3 min read',
      author: newBlog.author || 'Admin'
    };

    if (editingBlogId) {
      const { data, error } = await supabase
        .from('blogs')
        .update(blogData)
        .eq('id', editingBlogId)
        .select();

      setIsBlogUploading(false);

      if (error) {
        alert("Error updating blog: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setBlogs(blogs.map(b => b.id === editingBlogId ? data[0] : b));
        setNewBlog({ title: '', summary: '', content: '', category: 'Events', read_time: '3 min read', author: 'Admin', image: '', preview: '' });
        setSelectedBlogFile(null);
        setEditingBlogId(null);
        if (blogFileInputRef.current) blogFileInputRef.current.value = '';
        alert('Blog updated successfully!');
      }
    } else {
      const { data, error } = await supabase
        .from('blogs')
        .insert([blogData])
        .select();

      setIsBlogUploading(false);

      if (error) {
        alert("Error adding blog to database: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        setBlogs([...blogs, data[0]]);
        setNewBlog({ title: '', summary: '', content: '', category: 'Events', read_time: '3 min read', author: 'Admin', image: '', preview: '' });
        setSelectedBlogFile(null);
        if (blogFileInputRef.current) blogFileInputRef.current.value = '';
        alert('Blog added successfully!');
      }
    }
  };

  const handleStartEditBlog = (blog) => {
    setNewBlog({
      title: blog.title || '',
      summary: blog.summary || '',
      content: blog.content || '',
      category: blog.category || 'Events',
      read_time: blog.read_time || '3 min read',
      author: blog.author || 'Admin',
      image: blog.image || '',
      preview: blog.image || ''
    });
    setEditingBlogId(blog.id);

    const formSec = document.querySelector('.form-section');
    if (formSec) {
      formSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteBlog = async (id) => {
    const blogToDelete = blogs.find(b => b.id === id);
    if (!blogToDelete) return;

    triggerConfirm(
      'Delete Blog Post?',
      'Are you sure you want to delete this blog post?',
      async () => {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) {
          alert("Error deleting blog: " + error.message);
        } else {
          setBlogs(blogs.filter(b => b.id !== id));
          if (blogToDelete.image.includes('/storage/v1/object/public/Gallery/blogs/')) {
            const filePath = 'blogs/' + blogToDelete.image.split('/storage/v1/object/public/Gallery/blogs/')[1];
            await supabase.storage.from('Gallery').remove([filePath]);
          }
        }
      }
    );
  };

  // ─── Programs Handlers ───
  const handleProgFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedProgFile(file);
    setIsProgUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewProgram(prev => ({ ...prev, preview: event.target.result }));
      setIsProgUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.title) {
      alert('Please enter a title');
      return;
    }

    setIsProgUploading(true);
    let imageUrl = newProgram.image;

    if (selectedProgFile) {
      const fileExt = selectedProgFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `programs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(filePath, selectedProgFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setIsProgUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('Gallery')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const slug = newProgram.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const activitiesStr = typeof newProgram.activities === 'string' ? newProgram.activities : (newProgram.activities || []).join('\n');
    const impactStr = typeof newProgram.impact === 'string' ? newProgram.impact : (newProgram.impact || []).join('\n');

    const activitiesArr = activitiesStr.split('\n').map(a => a.trim()).filter(a => a);
    const impactArr = impactStr.split('\n').map(i => i.trim()).filter(i => i);

    const detailsObj = {
      target: newProgram.target || '',
      activities: activitiesArr,
      impact: impactArr
    };

    const programData = {
      slug,
      title: newProgram.title,
      description: newProgram.description || '',
      image: imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: detailsObj
    };

    if (editingProgramId) {
      const { data, error } = await supabase
        .from('programs')
        .update(programData)
        .eq('id', editingProgramId)
        .select();

      setIsProgUploading(false);

      if (error) {
        alert("Error updating program: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        const updatedProg = {
          ...data[0],
          details: typeof data[0].details === 'string' ? JSON.parse(data[0].details) : data[0].details
        };
        setPrograms(programs.map(p => p.id === editingProgramId ? updatedProg : p));
        setNewProgram({ title: '', description: '', image: '', target: '', activities: '', impact: '', preview: '' });
        setSelectedProgFile(null);
        setEditingProgramId(null);
        if (progFileInputRef.current) progFileInputRef.current.value = '';
        alert('Program updated successfully!');
      }
    } else {
      const { data, error } = await supabase
        .from('programs')
        .insert([programData])
        .select();

      setIsProgUploading(false);

      if (error) {
        alert("Error adding program to database: " + error.message);
        return;
      }

      if (data && data.length > 0) {
        const addedProg = {
          ...data[0],
          details: typeof data[0].details === 'string' ? JSON.parse(data[0].details) : data[0].details
        };
        setPrograms([...programs, addedProg]);
        setNewProgram({ title: '', description: '', image: '', target: '', activities: '', impact: '', preview: '' });
        setSelectedProgFile(null);
        if (progFileInputRef.current) progFileInputRef.current.value = '';
        alert('Program added successfully!');
      }
    }
  };

  const handleStartEditProgram = (prog) => {
    const activitiesStr = Array.isArray(prog.details?.activities) ? prog.details.activities.join('\n') : (prog.details?.activities || '');
    const impactStr = Array.isArray(prog.details?.impact) ? prog.details.impact.join('\n') : (prog.details?.impact || '');

    setNewProgram({
      title: prog.title || '',
      description: prog.description || '',
      image: prog.image || '',
      target: prog.details?.target || '',
      activities: activitiesStr,
      impact: impactStr,
      preview: prog.image || ''
    });
    setEditingProgramId(prog.id);
    
    // Scroll to the top of the form section for convenience
    const formSec = document.querySelector('.form-section');
    if (formSec) {
      formSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteProgram = async (id) => {
    const progToDelete = programs.find(p => p.id === id);
    if (!progToDelete) return;

    triggerConfirm(
      'Delete Program/Work?',
      'Are you sure you want to delete this program? This will remove it from the homepage and detail routes.',
      async () => {
        const { error } = await supabase.from('programs').delete().eq('id', id);
        if (error) {
          alert("Error deleting program: " + error.message);
        } else {
          setPrograms(programs.filter(p => p.id !== id));
          if (progToDelete.image.includes('/storage/v1/object/public/Gallery/programs/')) {
            const filePath = 'programs/' + progToDelete.image.split('/storage/v1/object/public/Gallery/programs/')[1];
            await supabase.storage.from('Gallery').remove([filePath]);
          }
        }
      }
    );
  };

  // Story approval
  const handleApproveStory = async (id) => {
    const { error } = await supabase
      .from('stories')
      .update({ approved: true })
      .eq('id', id);

    if (error) {
      alert("Error approving story: " + error.message);
    } else {
      setStories(stories.map(s => s.id === id ? { ...s, approved: true } : s));
      alert("Story approved successfully!");
    }
  };

  // Album handlers
  const handleCoverFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedCoverFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewAlbum(prev => ({ ...prev, previewCover: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotosFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("You can select a maximum of 4 photos for an album.");
      e.target.value = '';
      setSelectedPhotosFiles([]);
      setPreviewPhotos([]);
      return;
    }
    if (files.length < 3) {
      alert("Please select at least 3 photos for an album (3 to 4 photos are required).");
      e.target.value = '';
      setSelectedPhotosFiles([]);
      setPreviewPhotos([]);
      return;
    }
    setSelectedPhotosFiles(files);
    
    // Create previews
    const filePreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        filePreviews.push(event.target.result);
        if (filePreviews.length === files.length) {
          setPreviewPhotos(filePreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbum.title || (!editingAlbumId && !selectedCoverFile)) {
      alert('Please fill out title and upload a cover photo.');
      return;
    }

    if (!editingAlbumId && (!selectedPhotosFiles || selectedPhotosFiles.length < 3 || selectedPhotosFiles.length > 4)) {
      alert('Please select between 3 and 4 photos for the event.');
      return;
    }

    setIsAlbumUploading(true);
    let coverUrl = newAlbum.cover_image || '';
    let photoUrls = [];

    try {
      // 1. Upload Cover Image if selected
      if (selectedCoverFile) {
        const coverExt = selectedCoverFile.name.split('.').pop();
        const coverName = `${Date.now()}-cover.${coverExt}`;
        const coverPath = `albums/${coverName}`;
        
        const { error: coverUploadErr } = await supabase.storage
          .from('Gallery')
          .upload(coverPath, selectedCoverFile);

        if (coverUploadErr) throw new Error('Cover photo upload failed: ' + coverUploadErr.message);

        const { data: coverUrlData } = supabase.storage
          .from('Gallery')
          .getPublicUrl(coverPath);
        coverUrl = coverUrlData.publicUrl;
      }

      // 2. Upload Event Photos if selected
      if (selectedPhotosFiles && selectedPhotosFiles.length > 0) {
        for (let i = 0; i < selectedPhotosFiles.length; i++) {
          const file = selectedPhotosFiles[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-photo-${i}.${fileExt}`;
          const filePath = `albums/photos/${fileName}`;

          const { error: photoUploadErr } = await supabase.storage
            .from('Gallery')
            .upload(filePath, file);

          if (photoUploadErr) throw new Error(`Photo ${i + 1} upload failed: ` + photoUploadErr.message);

          const { data: photoUrlData } = supabase.storage
            .from('Gallery')
            .getPublicUrl(filePath);
          photoUrls.push(photoUrlData.publicUrl);
        }
      } else {
        photoUrls = newAlbum.images || [];
      }

      const albumData = {
        title: newAlbum.title,
        description: newAlbum.description || '',
        category: newAlbum.category,
        cover_image: coverUrl,
        images: photoUrls
      };

      if (editingAlbumId) {
        // Update Mode
        const { data, error } = await supabase
          .from('gallery_albums')
          .update(albumData)
          .eq('id', editingAlbumId)
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          const updatedAlbObj = {
            ...data[0],
            images: typeof data[0].images === 'string' ? JSON.parse(data[0].images) : data[0].images
          };
          setGalleryAlbums(galleryAlbums.map(alb => alb.id === editingAlbumId ? updatedAlbObj : alb));
          // Reset form
          setNewAlbum({ title: '', description: '', category: 'Events', cover_image: '', previewCover: '' });
          setSelectedCoverFile(null);
          setSelectedPhotosFiles([]);
          setPreviewPhotos([]);
          setEditingAlbumId(null);
          if (coverInputRef.current) coverInputRef.current.value = '';
          if (photosInputRef.current) photosInputRef.current.value = '';
          alert('Album updated successfully!');
        }
      } else {
        // Insert Mode
        const { data, error } = await supabase
          .from('gallery_albums')
          .insert([albumData])
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          const newAlbObj = {
            ...data[0],
            images: typeof data[0].images === 'string' ? JSON.parse(data[0].images) : data[0].images
          };
          setGalleryAlbums([newAlbObj, ...galleryAlbums]);
          // Reset form
          setNewAlbum({ title: '', description: '', category: 'Events', cover_image: '', previewCover: '' });
          setSelectedCoverFile(null);
          setSelectedPhotosFiles([]);
          setPreviewPhotos([]);
          if (coverInputRef.current) coverInputRef.current.value = '';
          if (photosInputRef.current) photosInputRef.current.value = '';
          alert('Album created successfully!');
        }
      }

    } catch (err) {
      alert('Error saving album: ' + err.message);
    } finally {
      setIsAlbumUploading(false);
    }
  };

  const handleStartEditAlbum = (album) => {
    setNewAlbum({
      title: album.title || '',
      description: album.description || '',
      category: album.category || 'Events',
      cover_image: album.cover_image || '',
      previewCover: album.cover_image || '',
      images: album.images || []
    });
    setPreviewPhotos(album.images || []);
    setEditingAlbumId(album.id);

    const formSec = document.querySelector('.form-section');
    if (formSec) {
      formSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteAlbum = async (id) => {
    const albumToDelete = galleryAlbums.find(alb => alb.id === id);
    if (!albumToDelete) return;

    triggerConfirm(
      'Delete Album?',
      'Are you sure you want to delete this album? All uploaded photos in this album will be removed from the gallery catalog.',
      async () => {
        const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
        if (error) {
          alert('Error deleting album: ' + error.message);
        } else {
          setGalleryAlbums(galleryAlbums.filter(alb => alb.id !== id));
          
          // Delete cover image
          if (albumToDelete.cover_image.includes('/storage/v1/object/public/Gallery/albums/')) {
            const coverPath = 'albums/' + albumToDelete.cover_image.split('/storage/v1/object/public/Gallery/albums/')[1];
            await supabase.storage.from('Gallery').remove([coverPath]);
          }

          // Delete multiple photos
          if (albumToDelete.images && albumToDelete.images.length > 0) {
            const pathsToRemove = albumToDelete.images
              .filter(url => url.includes('/storage/v1/object/public/Gallery/albums/photos/'))
              .map(url => 'albums/photos/' + url.split('/storage/v1/object/public/Gallery/albums/photos/')[1]);
            
            if (pathsToRemove.length > 0) {
              await supabase.storage.from('Gallery').remove(pathsToRemove);
            }
          }
        }
      }
    );
  };

  // ─── Stories Handlers ───
  const handleStoryFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedStoryFile(file);
    setIsStoryUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewStory(prev => ({ ...prev, preview: event.target.result }));
      setIsStoryUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!newStory.name || !newStory.quote) {
      alert('Please fill out name and quote');
      return;
    }

    setIsStoryUploading(true);
    let imageUrl = newStory.image;

    if (selectedStoryFile) {
      const fileExt = selectedStoryFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(filePath, selectedStoryFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setIsStoryUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('Gallery')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('stories')
      .insert([{
        name: newStory.name,
        role: newStory.role || 'Beneficiary',
        quote: newStory.quote,
        image: imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
      }])
      .select();

    setIsStoryUploading(false);

    if (error) {
      alert("Error adding story: " + error.message);
      return;
    }

    if (data && data.length > 0) {
      setStories([data[0], ...stories]);
      setNewStory({ name: '', role: '', quote: '', image: '', preview: '' });
      setSelectedStoryFile(null);
      if (storyFileInputRef.current) storyFileInputRef.current.value = '';
      alert('Success story added successfully!');
    }
  };

  const handleDeleteStory = async (id) => {
    const storyToDelete = stories.find(s => s.id === id);
    if (!storyToDelete) return;

    triggerConfirm(
      'Delete Success Story?',
      'Are you sure you want to delete this success story?',
      async () => {
        const { error } = await supabase.from('stories').delete().eq('id', id);
        if (error) {
          alert("Error deleting story: " + error.message);
        } else {
          setStories(stories.filter(s => s.id !== id));
          if (storyToDelete.image.includes('/storage/v1/object/public/Gallery/stories/')) {
            const filePath = 'stories/' + storyToDelete.image.split('/storage/v1/object/public/Gallery/stories/')[1];
            await supabase.storage.from('Gallery').remove([filePath]);
          }
        }
      }
    );
  };

  // ─── Team Handlers ───
  const handleMemberFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSelectedMemberFile(file);
    setIsMemberUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewMember(prev => ({ ...prev, preview: event.target.result }));
      setIsMemberUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) {
      alert('Please fill out name and role');
      return;
    }

    setIsMemberUploading(true);
    let imageUrl = newMember.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; // fallback placeholder

    if (selectedMemberFile) {
      const fileExt = selectedMemberFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Gallery')
        .upload(filePath, selectedMemberFile);

      if (uploadError) {
        alert("Error uploading image: " + uploadError.message);
        setIsMemberUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('Gallery')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    const memberData = {
      name: newMember.name,
      role: newMember.role,
      bio: newMember.bio,
      linkedin: newMember.linkedin,
      twitter: newMember.twitter,
      email: newMember.email,
      image: imageUrl
    };

    if (editingMemberId) {
      // Update Mode
      const { data, error } = await supabase
        .from('team_members')
        .update(memberData)
        .eq('id', editingMemberId)
        .select();

      if (error) {
        alert("Error updating team member: " + error.message);
      } else {
        if (data && data[0]) {
          setTeamMembers(prev => prev.map(m => m.id === editingMemberId ? data[0] : m));
        } else {
          setTeamMembers(prev => prev.map(m => m.id === editingMemberId ? { id: editingMemberId, ...memberData } : m));
        }
        setNewMember({ name: '', role: '', bio: '', linkedin: '', twitter: '', email: '', image: '', preview: '' });
        setSelectedMemberFile(null);
        setEditingMemberId(null);
        if (memberFileInputRef.current) memberFileInputRef.current.value = '';
        alert("Team member updated successfully!");
      }
    } else {
      // Create Mode
      const { data, error } = await supabase
        .from('team_members')
        .insert([memberData])
        .select();

      if (error) {
        alert("Error adding team member: " + error.message);
      } else {
        if (data && data[0]) {
          setTeamMembers(prev => [...prev, data[0]]);
        } else {
          setTeamMembers(prev => [...prev, { id: Date.now(), ...memberData }]);
        }
        setNewMember({ name: '', role: '', bio: '', linkedin: '', twitter: '', email: '', image: '', preview: '' });
        setSelectedMemberFile(null);
        if (memberFileInputRef.current) memberFileInputRef.current.value = '';
        alert("Team member added successfully!");
      }
    }
    setIsMemberUploading(false);
  };

  const handleStartEditMember = (member) => {
    setNewMember({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      email: member.email || '',
      image: member.image || '',
      preview: member.image || ''
    });
    setEditingMemberId(member.id);
  };

  const handleDeleteMember = async (id) => {
    const memberToDelete = teamMembers.find(m => m.id === id);
    if (!memberToDelete) return;

    triggerConfirm(
      'Delete Team Member?',
      'Are you sure you want to delete this team member?',
      async () => {
        const { error } = await supabase.from('team_members').delete().eq('id', id);
        if (error) {
          alert("Error deleting team member: " + error.message);
        } else {
          setTeamMembers(teamMembers.filter(m => m.id !== id));
          if (editingMemberId === id) {
            setNewMember({ name: '', role: '', bio: '', linkedin: '', twitter: '', email: '', image: '', preview: '' });
            setSelectedMemberFile(null);
            setEditingMemberId(null);
            if (memberFileInputRef.current) memberFileInputRef.current.value = '';
          }
          if (memberToDelete.image.includes('/storage/v1/object/public/Gallery/team/')) {
            const filePath = 'team/' + memberToDelete.image.split('/storage/v1/object/public/Gallery/team/')[1];
            await supabase.storage.from('Gallery').remove([filePath]);
          }
        }
      }
    );
  };

  const renderContent = () => {
    if (activeTab === 'blogs') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1.7fr 0.7fr' }}>
          {/* Add/Edit Blog Form */}
          <section className="admin-card form-section">
            <h3>{editingBlogId ? 'Edit Blog Post' : 'Add Weekly Blog Post'}</h3>
            <form onSubmit={handleAddBlog}>
              {/* Image Upload Area */}
              <div 
                className="upload-zone"
                onClick={() => blogFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: newBlog.preview ? '0' : '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: newBlog.preview ? 'transparent' : '#f8fafc',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <input
                  ref={blogFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBlogFileSelect}
                  style={{ display: 'none' }}
                />
                {newBlog.preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img 
                      src={newBlog.preview} 
                      alt="Preview" 
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewBlog(prev => ({ ...prev, preview: '' }));
                        setSelectedBlogFile(null);
                        if (blogFileInputRef.current) blogFileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(239,68,68,0.9)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📷</div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                      {isBlogUploading ? 'Uploading...' : 'Upload Cover Image for Blog'}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>PNG, JPG or WebP</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Blog Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Empowering Local Schools" 
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Short Summary * (will be shown in blog list cards)</label>
                <input 
                  type="text" 
                  placeholder="e.g. A brief overview of our digital learning project in Varanasi..." 
                  value={newBlog.summary}
                  onChange={(e) => setNewBlog({...newBlog, summary: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Full Content * (Supports paragraphs, lists, and headers)</label>
                <textarea 
                  placeholder="Write your article details here. Use ### for subheaders and * for lists." 
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '200px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'inherit' }}
                >
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community">Community</option>
                  <option value="Events">Events</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Read Time</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4 min read" 
                  value={newBlog.read_time}
                  onChange={(e) => setNewBlog({...newBlog, read_time: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input 
                  type="text" 
                  placeholder="e.g. Admin / We Are Youth Team" 
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary form-submit" disabled={isBlogUploading}>
                  {editingBlogId ? <Check size={18} /> : <Plus size={18} />} {editingBlogId ? 'Update Blog' : 'Publish Blog'}
                </button>
                {editingBlogId && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setEditingBlogId(null);
                      setNewBlog({ title: '', summary: '', content: '', category: 'Events', read_time: '3 min read', author: 'Admin', image: '', preview: '' });
                      setSelectedBlogFile(null);
                      if (blogFileInputRef.current) blogFileInputRef.current.value = '';
                    }}
                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Blogs List */}
          <section className="admin-card list-section">
            <h3>Active Blog Posts ({blogs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '700px', overflowY: 'auto' }}>
              {blogs.map(blog => (
                <div key={blog.id} style={{
                  display: 'flex', gap: '10px', padding: '8px 12px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  background: '#f8fafc', alignItems: 'center'
                }}>
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    style={{ width: '50px', height: '38px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{blog.title}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--accent-gold)' }}>{blog.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button 
                      onClick={() => handleStartEditBlog(blog)} 
                      className="icon-btn edit"
                      title="Edit Blog"
                      style={{ border: '1px solid #cbd5e1', width: '28px', height: '28px', padding: '4px', borderRadius: '6px', background: 'white', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteBlog(blog.id)} 
                      className="icon-btn delete"
                      title="Remove Blog"
                      style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No blog posts.
                </p>
              )}
            </div>
          </section>
        </div>
      );
    }

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
            <h3>Internship Applications</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Review and manage student and volunteer internship applications.
            </p>
            <div className="volunteers-table-container" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-dark)' }}>
                    <th style={{ padding: '12px' }}>Applicant Name</th>
                    <th style={{ padding: '12px' }}>Internship Area</th>
                    <th style={{ padding: '12px' }}>Duration</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fundraisers.map(fund => (
                    <tr key={fund.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{fund.name}</td>
                      <td style={{ padding: '12px', color: 'var(--text-gray)' }}>{fund.type}</td>
                      <td style={{ padding: '12px' }}>{fund.amount} Month{parseInt(fund.amount) > 1 ? 's' : ''}</td>
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
    
    if (activeTab === 'about') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1fr' }}>
          <section className="admin-card">
            <h3>Manage About Section & Full Story</h3>
            <p style={{color: 'var(--text-gray)', marginBottom: '20px', fontSize: '14px'}}>
              Customize the titles, paragraphs, core values (mission & vision), and photos shown in both the homepage "About" section and the dedicated "Read Our Full Story" detailed page.
            </p>
            <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Photo upload zone */}
              <div className="form-section-group" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 16px', color: 'var(--primary-dark)', fontSize: '16px' }}>About Section Photo</h4>
                <div 
                  className="upload-zone"
                  onClick={() => aboutImgInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: aboutData?.image ? '0' : '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: aboutData?.image ? 'transparent' : '#fff',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '450px'
                  }}
                >
                  <input
                    ref={aboutImgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAboutFileSelect}
                    style={{ display: 'none' }}
                  />
                  {aboutData?.image ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img 
                        src={aboutData.image} 
                        alt="About Cover Preview" 
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} 
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s' }} className="upload-overlay">
                        <span>Click to Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📷</div>
                      <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                        {isAboutUploading ? 'Uploading...' : 'Upload About Image (1 deep meaningful image)'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Homepage About Card */}
              <div className="form-section-group" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: '0 0 4px', color: 'var(--primary-dark)', fontSize: '16px' }}>Homepage Card Content</h4>
                <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-gray)' }}>Configure the copy visible on the homepage.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Subtitle / Small Tag</label>
                    <input 
                      type="text" 
                      value={aboutData?.subtitle || ''} 
                      onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Main Title (use commas for line breaks)</label>
                    <input 
                      type="text" 
                      value={aboutData?.title || ''} 
                      onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Lead Paragraph</label>
                  <textarea 
                    value={aboutData?.lead_text || ''} 
                    onChange={(e) => setAboutData({ ...aboutData, lead_text: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                {/* Mission & Vision */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  {/* Mission */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h5 style={{ margin: 0, fontWeight: '600' }}>Our Mission</h5>
                    <div className="form-group">
                      <label>Mission Title</label>
                      <input 
                        type="text" 
                        value={aboutData?.mission_title || ''} 
                        onChange={(e) => setAboutData({ ...aboutData, mission_title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Mission Description</label>
                      <textarea 
                        value={aboutData?.mission_desc || ''} 
                        onChange={(e) => setAboutData({ ...aboutData, mission_desc: e.target.value })}
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  {/* Vision */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h5 style={{ margin: 0, fontWeight: '600' }}>Our Vision</h5>
                    <div className="form-group">
                      <label>Vision Title</label>
                      <input 
                        type="text" 
                        value={aboutData?.vision_title || ''} 
                        onChange={(e) => setAboutData({ ...aboutData, vision_title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Vision Description</label>
                      <textarea 
                        value={aboutData?.vision_desc || ''} 
                        onChange={(e) => setAboutData({ ...aboutData, vision_desc: e.target.value })}
                        rows="3"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Story Detailed Page Content */}
              <div className="form-section-group" style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h4 style={{ margin: '0 0 4px', color: 'var(--primary-dark)', fontSize: '16px' }}>Detailed Page ("Read More") Content</h4>
                <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-gray)' }}>Configure the full story details that load on the separate page.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Story Badge / Origins Category</label>
                    <input 
                      type="text" 
                      value={aboutData?.story_badge || ''} 
                      onChange={(e) => setAboutData({ ...aboutData, story_badge: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Story Title</label>
                    <input 
                      type="text" 
                      value={aboutData?.story_title || ''} 
                      onChange={(e) => setAboutData({ ...aboutData, story_title: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Story Intro / Hook (Lead text at top)</label>
                  <textarea 
                    value={aboutData?.story_lead || ''} 
                    onChange={(e) => setAboutData({ ...aboutData, story_lead: e.target.value })}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Highlight Quote / Narrative Quote</label>
                  <textarea 
                    value={aboutData?.story_quote || ''} 
                    onChange={(e) => setAboutData({ ...aboutData, story_quote: e.target.value })}
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Story Paragraphs (Press enter twice to start a new paragraph)</label>
                  <textarea 
                    value={aboutData?.story_content || ''} 
                    onChange={(e) => setAboutData({ ...aboutData, story_content: e.target.value })}
                    style={{ minHeight: '220px', resize: 'vertical' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="submit" className="btn btn-primary" disabled={isAboutUploading}>
                  {isAboutUploading ? 'Uploading Image & Saving...' : 'Save About Section Changes'}
                </button>
              </div>
            </form>
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
      const albumsList = galleryAlbums || [];
      return (
        <div className="admin-content">
          {/* Create Event Album Form */}
          <section className="admin-card form-section">
            <h3>{editingAlbumId ? 'Edit Event Album' : 'Create Event Album'}</h3>
            <form onSubmit={handleAddAlbum}>
              
              {/* Cover Image Upload Area */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Album Cover Photo {editingAlbumId ? '' : '*'}</label>
                <div 
                  className="upload-zone"
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    border: '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: newAlbum.previewCover ? '0' : '30px 15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: newAlbum.previewCover ? 'transparent' : '#f8fafc',
                    overflow: 'hidden',
                    position: 'relative',
                    minHeight: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileSelect}
                    style={{ display: 'none' }}
                  />
                  {newAlbum.previewCover ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <img 
                        src={newAlbum.previewCover} 
                        alt="Cover Preview" 
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }} 
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewAlbum(prev => ({ ...prev, previewCover: '' }));
                          setSelectedCoverFile(null);
                          if (coverInputRef.current) coverInputRef.current.value = '';
                        }}
                        style={{
                          position: 'absolute', top: '8px', right: '8px',
                          background: 'rgba(239,68,68,0.9)', color: 'white',
                          border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >✕</button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '28px', marginBottom: '4px', opacity: 0.4 }}>🖼️</div>
                      <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                        {isAlbumUploading ? 'Uploading...' : 'Upload Cover Photo for this Album'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Album / Event Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Digital Class Kickoff 2025" 
                  value={newAlbum.title}
                  onChange={(e) => setNewAlbum({...newAlbum, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Album Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Distributing smart tablets and counselling 40 rural students" 
                  value={newAlbum.description}
                  onChange={(e) => setNewAlbum({...newAlbum, description: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newAlbum.category}
                  onChange={(e) => setNewAlbum({...newAlbum, category: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontFamily: 'inherit' }}
                >
                  <option value="Events">Events</option>
                  <option value="Education">Education</option>
                  <option value="Environment">Environment</option>
                  <option value="Empowerment">Empowerment</option>
                  <option value="Community">Community</option>
                  <option value="Health">Health</option>
                </select>
              </div>

              {/* Event Photos Upload Area */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Event Photos (Select 3 to 4 pics) {editingAlbumId ? '' : '*'}</label>
                <input
                  ref={photosInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosFilesSelect}
                  style={{ display: 'block', marginBottom: '10px' }}
                  required={!editingAlbumId}
                />
                
                {/* Previews Grid */}
                {previewPhotos.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '12px' }}>
                    {previewPhotos.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="Event Preview" 
                        style={{ width: '100%', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                      />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary form-submit" disabled={isAlbumUploading}>
                  {editingAlbumId ? <Check size={18} /> : <Plus size={18} />} {isAlbumUploading ? (editingAlbumId ? 'Updating Album...' : 'Creating Album...') : (editingAlbumId ? 'Update Album' : 'Create Album')}
                </button>
                {editingAlbumId && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setNewAlbum({ title: '', description: '', category: 'Events', cover_image: '', previewCover: '' });
                      setSelectedCoverFile(null);
                      setSelectedPhotosFiles([]);
                      setPreviewPhotos([]);
                      setEditingAlbumId(null);
                      if (coverInputRef.current) coverInputRef.current.value = '';
                      if (photosInputRef.current) photosInputRef.current.value = '';
                    }}
                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Active Albums List */}
          <section className="admin-card list-section">
            <h3>Active Event Albums ({albumsList.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '700px', overflowY: 'auto' }}>
              {albumsList.map(album => (
                <div key={album.id} style={{
                  display: 'flex', gap: '14px', padding: '12px',
                  border: '1px solid #e2e8f0', borderRadius: '10px',
                  background: '#f8fafc', alignItems: 'center'
                }}>
                  <img 
                    src={album.cover_image} 
                    alt={album.title} 
                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 2px', fontSize: '15px', color: 'var(--text-dark)' }}>{album.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px' }}>{album.category}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>📂 {album.images?.length || 0} Photos inside</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      onClick={() => handleStartEditAlbum(album)} 
                      className="icon-btn edit"
                      title="Edit Album"
                      style={{ border: '1px solid #cbd5e1', padding: '6px', borderRadius: '6px', background: 'white', color: '#475569', cursor: 'pointer' }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteAlbum(album.id)} 
                      className="icon-btn delete"
                      title="Remove Album"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {albumsList.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No event albums created yet.
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

    if (activeTab === 'programs') {
      return (
        <div className="admin-content" style={{ gridTemplateColumns: '1.7fr 0.7fr' }}>
          {/* Add Program Form */}
          <section className="admin-card form-section">
            <h3>{editingProgramId ? 'Edit Program / Work' : 'Add New Program / Work'}</h3>
            <form onSubmit={handleAddProgram}>
              {/* Image Upload Area */}
              <div 
                className="upload-zone"
                onClick={() => progFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: newProgram.preview ? '0' : '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: newProgram.preview ? 'transparent' : '#f8fafc',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <input
                  ref={progFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProgFileSelect}
                  style={{ display: 'none' }}
                />
                {newProgram.preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img 
                      src={newProgram.preview} 
                      alt="Preview" 
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewProgram(prev => ({ ...prev, preview: '' }));
                        setSelectedProgFile(null);
                        if (progFileInputRef.current) progFileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(239,68,68,0.9)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📷</div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                      {isProgUploading ? 'Uploading...' : 'Upload Cover Pic of the Event/Work'}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>PNG, JPG or WebP</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Program Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Clean & Green Initiative" 
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({...newProgram, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Brief Description *</label>
                <textarea 
                  placeholder="Summarize the core focus of this program/work..." 
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Audience / Group</label>
                <input 
                  type="text" 
                  placeholder="e.g. Village youth aged 16-25, Rural schools..." 
                  value={newProgram.target}
                  onChange={(e) => setNewProgram({...newProgram, target: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Key Activities (One per line)</label>
                <textarea 
                  placeholder="e.g. Digital Literacy Classes&#10;Football tournaments&#10;Organic vermicompost workshops" 
                  value={newProgram.activities}
                  onChange={(e) => setNewProgram({...newProgram, activities: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div className="form-group">
                <label>Impact Points / Success Metrics (One per line)</label>
                <textarea 
                  placeholder="e.g. 50+ children supported daily&#10;10+ village cleanups completed" 
                  value={newProgram.impact}
                  onChange={(e) => setNewProgram({...newProgram, impact: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary form-submit" disabled={isProgUploading}>
                  {editingProgramId ? <Check size={18} /> : <Plus size={18} />} {editingProgramId ? 'Update Program / Work' : 'Add Program / Work'}
                </button>
                {editingProgramId && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setEditingProgramId(null);
                      setNewProgram({ title: '', description: '', image: '', target: '', activities: '', impact: '', preview: '' });
                      setSelectedProgFile(null);
                      if (progFileInputRef.current) progFileInputRef.current.value = '';
                    }}
                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer' }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Programs List */}
          <section className="admin-card list-section">
            <h3>Active ({programs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '700px', overflowY: 'auto' }}>
              {programs.map(prog => (
                <div key={prog.id} style={{
                  display: 'flex', gap: '10px', padding: '8px 12px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  background: '#f8fafc', alignItems: 'center'
                }}>
                  <img 
                    src={prog.image} 
                    alt={prog.title} 
                    style={{ width: '50px', height: '38px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prog.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button 
                      onClick={() => handleStartEditProgram(prog)} 
                      className="icon-btn edit"
                      title="Edit Program"
                      style={{ border: '1px solid #cbd5e1', width: '28px', height: '28px', padding: '4px', borderRadius: '6px', background: 'white', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProgram(prog.id)} 
                      className="icon-btn delete"
                      title="Remove Program"
                      style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {programs.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                  No programs.
                </p>
              )}
            </div>
          </section>
        </div>
      );
    }

    if (activeTab === 'stories') {
      const pendingStories = stories.filter(s => s.approved === false);
      const approvedStories = stories.filter(s => s.approved === true || s.approved === undefined || s.approved === null);

      return (
        <div className="admin-content">
          {/* Add Story Form */}
          <section className="admin-card form-section">
            <h3>Add Success Story (Admin)</h3>
            <form onSubmit={handleAddStory}>
              {/* Image Upload Area */}
              <div 
                className="upload-zone"
                onClick={() => storyFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: newStory.preview ? '0' : '30px 15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: newStory.preview ? 'transparent' : '#f8fafc',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <input
                  ref={storyFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStoryFileSelect}
                  style={{ display: 'none' }}
                />
                {newStory.preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img 
                      src={newStory.preview} 
                      alt="Preview" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewStory(prev => ({ ...prev, preview: '' }));
                        setSelectedStoryFile(null);
                        if (storyFileInputRef.current) storyFileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute', top: '0', right: '35%',
                        background: 'rgba(239,68,68,0.9)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '22px', height: '22px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '28px', marginBottom: '4px', opacity: 0.4 }}>👤</div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                      {isStoryUploading ? 'Uploading...' : 'Upload Beneficiary Profile Pic'}
                    </p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Beneficiary Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Aarti Jaiswal" 
                  value={newStory.name}
                  onChange={(e) => setNewStory({...newStory, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role / Subtitle *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Student Beneficiary, Micro-entrepreneur" 
                  value={newStory.role}
                  onChange={(e) => setNewStory({...newStory, role: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Beneficiary Quote *</label>
                <textarea 
                  placeholder="Quote about how the NGO changed their life..." 
                  value={newStory.quote}
                  onChange={(e) => setNewStory({...newStory, quote: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary form-submit" disabled={isStoryUploading}>
                <Plus size={18} /> Add Success Story
              </button>
            </form>
          </section>

          {/* Stories Moderation and List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Pending Approvals */}
            <section className="admin-card">
              <h3 style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Pending Story Submissions ({pendingStories.length})
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)', marginBottom: '16px' }}>
                Review stories submitted by website visitors. Approve them to display them on the homepage testimonial slider.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {pendingStories.map(stor => (
                  <div key={stor.id} style={{
                    display: 'flex', gap: '14px', padding: '16px',
                    border: '1px solid #fef08a', borderRadius: '12px',
                    background: '#fffde6', alignItems: 'center'
                  }}>
                    <img 
                      src={stor.image} 
                      alt={stor.name} 
                      style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px', fontSize: '15px', color: 'var(--text-dark)' }}>{stor.name}</h4>
                      <span style={{ fontSize: '11.5px', color: 'var(--accent-gold)', display: 'block', marginBottom: '4px', fontWeight: '500' }}>{stor.role}</span>
                      <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-gray)', fontStyle: 'italic', lineHeight: '1.4' }}>
                        {stor.quote}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button 
                        onClick={() => handleApproveStory(stor.id)} 
                        className="icon-btn edit" 
                        title="Approve Story" 
                        style={{ display: 'inline-flex', color: '#166534', backgroundColor: '#dcfce7' }}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteStory(stor.id)} 
                        className="icon-btn delete"
                        title="Reject/Delete Story"
                        style={{ display: 'inline-flex' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingStories.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '13px' }}>
                    No pending public submissions at the moment.
                  </p>
                )}
              </div>
            </section>

            {/* Approved List */}
            <section className="admin-card">
              <h3>Approved Success Stories ({approvedStories.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '400px', overflowY: 'auto' }}>
                {approvedStories.map(stor => (
                  <div key={stor.id} style={{
                    display: 'flex', gap: '14px', padding: '12px',
                    border: '1px solid #e2e8f0', borderRadius: '10px',
                    background: '#f8fafc', alignItems: 'center'
                  }}>
                    <img 
                      src={stor.image} 
                      alt={stor.name} 
                      style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: 'var(--text-dark)' }}>{stor.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'block' }}>{stor.role}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteStory(stor.id)} 
                      className="icon-btn delete"
                      title="Remove Story"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {approvedStories.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', fontSize: '13px' }}>
                    No stories approved yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      );
    }

    if (activeTab === 'team') {
      const list = teamMembers || [];
      return (
        <div className="admin-content">
          {/* Add Team Member Form */}
          <section className="admin-card form-section">
            <h3>{editingMemberId ? 'Edit Team Member' : 'Add Team Member'}</h3>
            <form onSubmit={handleAddMember}>
              {/* Image Upload Area */}
              <div 
                className="upload-zone"
                onClick={() => memberFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: newMember.preview ? '0' : '30px 15px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: newMember.preview ? 'transparent' : '#f8fafc',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  minHeight: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <input
                  ref={memberFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMemberFileSelect}
                  style={{ display: 'none' }}
                />
                {newMember.preview ? (
                  <div style={{ position: 'relative', width: '100%' }}>
                    <img 
                      src={newMember.preview} 
                      alt="Preview" 
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px' }} 
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewMember(prev => ({ ...prev, preview: '', image: '' }));
                        setSelectedMemberFile(null);
                        if (memberFileInputRef.current) memberFileInputRef.current.value = '';
                      }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(239,68,68,0.9)', color: 'white',
                        border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '28px', marginBottom: '4px', opacity: 0.4 }}>📷</div>
                    <p style={{ color: 'var(--text-gray)', fontSize: '13px', margin: 0 }}>
                      {isMemberUploading ? 'Uploading...' : 'Upload Profile Photo'}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>PNG, JPG or WebP</p>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={newMember.name} 
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="e.g. Priyanshu Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role / Designation *</label>
                <input 
                  type="text" 
                  value={newMember.role} 
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="e.g. Founder & President"
                  required
                />
              </div>

              <div className="form-group">
                <label>Short Bio</label>
                <textarea 
                  value={newMember.bio} 
                  onChange={(e) => setNewMember({...newMember, bio: e.target.value})}
                  placeholder="Summarize their focus or contribution..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn Link</label>
                <input 
                  type="text" 
                  value={newMember.linkedin} 
                  onChange={(e) => setNewMember({...newMember, linkedin: e.target.value})}
                  placeholder="e.g. https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label>Twitter Link</label>
                <input 
                  type="text" 
                  value={newMember.twitter} 
                  onChange={(e) => setNewMember({...newMember, twitter: e.target.value})}
                  placeholder="e.g. https://twitter.com/username"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={newMember.email} 
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="e.g. info@domain.com"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary form-submit" disabled={isMemberUploading}>
                  {editingMemberId ? <Check size={18} /> : <Plus size={18} />} {editingMemberId ? 'Update Member' : 'Add Team Member'}
                </button>
                {editingMemberId && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setNewMember({ name: '', role: '', bio: '', linkedin: '', twitter: '', email: '', image: '', preview: '' });
                      setSelectedMemberFile(null);
                      setEditingMemberId(null);
                      if (memberFileInputRef.current) memberFileInputRef.current.value = '';
                    }}
                    style={{ background: '#64748b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* Team Members List */}
          <section className="admin-card list-section">
            <h3>Current Team Members ({list.length})</h3>
            <div className="item-list-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {list.map(member => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <img 
                      src={member.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                      alt={member.name} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--primary-light)' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: 'var(--text-dark)' }}>{member.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--accent-gold)', display: 'block', fontWeight: '600' }}>{member.role}</span>
                      <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: 'var(--text-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.bio}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => handleStartEditMember(member)} 
                        className="icon-btn edit"
                        title="Edit Member"
                        style={{ border: '1px solid #cbd5e1', padding: '6px', borderRadius: '6px', background: 'white', color: '#475569', cursor: 'pointer' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteMember(member.id)} 
                        className="icon-btn delete"
                        title="Remove Member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', fontSize: '13px' }}>
                    No team members added yet. Falling back to default list on site.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      );
    }
  };

  return (
    <div className="admin-layout">
      <style>{`
        @media (min-width: 1251px) {
          .admin-content {
            display: grid !important;
            grid-template-columns: 1.4fr 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 1250px) {
          .admin-content {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
      {/* Mobile Top Header */}
      <div className="mobile-admin-header">
        <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h2>Admin Panel</h2>
        <div style={{ width: 24 }}></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <h2>Admin Panel</h2>
            <p>We Are Youth Foundation</p>
          </div>
          <button className="mobile-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="admin-nav">
          <a href="#" className={activeTab === 'campaigns' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('campaigns'); setIsSidebarOpen(false); }}>
            <Activity size={20} /> Campaigns & Goals
          </a>
          <a href="#" className={activeTab === 'donations' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('donations'); setIsSidebarOpen(false); }}>
            <Coins size={20} /> Donation Approvals
          </a>
          <a href="#" className={activeTab === 'programs' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('programs'); setIsSidebarOpen(false); }}>
            <Briefcase size={20} /> Programs & Works
          </a>
          <a href="#" className={activeTab === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('about'); setIsSidebarOpen(false); }}>
            <Users size={20} /> About Manager
          </a>
          <a href="#" className={activeTab === 'stories' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('stories'); setIsSidebarOpen(false); }}>
            <Users size={20} /> Success Stories
          </a>
          <a href="#" className={activeTab === 'impact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('impact'); setIsSidebarOpen(false); }}>
            <BarChart2 size={20} /> Global Impact Stats
          </a>
          <a href="#" className={activeTab === 'volunteers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('volunteers'); setIsSidebarOpen(false); }}>
            <Users size={20} /> Voluntary Portal
          </a>
          <a href="#" className={activeTab === 'partnerships' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('partnerships'); setIsSidebarOpen(false); }}>
            <Briefcase size={20} /> Corporate Partners
          </a>
          <a href="#" className={activeTab === 'fundraisers' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('fundraisers'); setIsSidebarOpen(false); }}>
            <Megaphone size={20} /> Internships
          </a>
          <a href="#" className={activeTab === 'blogs' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('blogs'); setIsSidebarOpen(false); }}>
            <Megaphone size={20} /> Blogs Manager
          </a>
          <a href="#" className={activeTab === 'gallery' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('gallery'); setIsSidebarOpen(false); }}>
            <Image size={20} /> Gallery Manager
          </a>
          <a href="#" className={activeTab === 'team' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('team'); setIsSidebarOpen(false); }}>
            <Users size={20} /> Team Manager
          </a>
          <a href="#" className={activeTab === 'settings' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab('settings'); setIsSidebarOpen(false); }}>
            <Settings size={20} /> Settings
          </a>
        </nav>
        <div className="admin-logout">
          <button onClick={() => { setIsSidebarOpen(false); onLogout(); }} className="btn-logout"><LogOut size={20} /> Exit to Site</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'campaigns' && 'Manage Campaigns & Goals'}
            {activeTab === 'donations' && 'Donation Verifications'}
            {activeTab === 'programs' && 'Programs & Works Manager'}
            {activeTab === 'stories' && 'Success Stories Manager'}
            {activeTab === 'impact' && 'Global Impact Statistics'}
            {activeTab === 'volunteers' && 'Voluntary Portal'}
            {activeTab === 'partnerships' && 'Corporate Partnerships'}
            {activeTab === 'fundraisers' && 'Internship Applications'}
            {activeTab === 'gallery' && 'Gallery Manager'}
            {activeTab === 'blogs' && 'Blogs & Articles Manager'}
            {activeTab === 'about' && 'About Section Manager'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          <p>
            {activeTab === 'campaigns' && 'Add new fundraising tasks that will automatically appear on the homepage widget.'}
            {activeTab === 'donations' && 'Review UPI QR Code transactions submitted by donors. Match the UPI Ref Number with your bank statement to approve.'}
            {activeTab === 'programs' && 'Add, update, or remove dynamic NGO programs, events, cover photos, and core activities.'}
            {activeTab === 'stories' && 'Add success stories of beneficiaries with photos and quotes to show on the site.'}
            {activeTab === 'impact' && 'Update the numbers representing your NGO\'s total reach and impact.'}
            {activeTab === 'volunteers' && 'Review and manage your network of volunteers and applications.'}
            {activeTab === 'partnerships' && 'Review CSR and corporate partnership proposals.'}
            {activeTab === 'fundraisers' && 'Review and manage student and volunteer internship applications.'}
            {activeTab === 'gallery' && 'Upload event photos and manage the website gallery.'}
            {activeTab === 'blogs' && 'Create, edit, or delete articles and blog posts for your weekly column.'}
            {activeTab === 'about' && 'Configure the narrative text, core mission/vision values, and main photo for the homepage and full story page.'}
            {activeTab === 'settings' && 'Configure system preferences.'}
          </p>
        </header>

        {renderContent()}
        
      </main>

      {/* Sleek Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="custom-confirm-overlay">
          <div className="custom-confirm-card">
            <div className="custom-confirm-icon">⚠️</div>
            <h3>{confirmDialog.title}</h3>
            <p>{confirmDialog.message}</p>
            <div className="custom-confirm-actions">
              <button 
                type="button" 
                className="custom-confirm-btn cancel" 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="custom-confirm-btn confirm" 
                onClick={confirmDialog.onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
