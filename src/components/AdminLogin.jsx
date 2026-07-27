import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Shield, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        onLoginSuccess(data.session);
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card glass-panel">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Home
        </button>
        
        <div className="login-header">
          <div className="lock-icon-container">
            <Shield size={32} className="shield-icon" />
          </div>
          <h2>NGO Admin Portal</h2>
          <p>Sign in to manage campaigns, volunteers, and website content.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {errorMsg && <div className="error-banner">{errorMsg}</div>}
          
          <div className="form-group-login">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="admin@ngo.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group-login">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="spinner" /> Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
