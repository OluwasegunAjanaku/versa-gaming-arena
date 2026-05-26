'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '../lib/firebase';
import Image from 'next/image';

export default function AuthPage() {
  const { currentUser, signIn, signUp, loginWithOAuth } = useFirebase();
  const router = useRouter();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validations
    if (!email || !password) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }
    if (isSignUp && !username) {
      setErrorMsg('Please specify a unique Gamer Tag.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
      router.push('/');
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = async (provider) => {
    setLoading(true);
    try {
      await loginWithOAuth(provider);
      router.push('/');
    } catch (err) {
      setErrorMsg(`Failed to connect with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.authContainer} className="split-screen-container">
      {/* Left side: Cyberpunk Gaming Banner */}
      <div style={styles.bannerSide} className="banner-side">
        <div style={styles.imageWrapper}>
          <Image 
            src="/versa_login_banner.png" 
            alt="Futuristic Esports Arena" 
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div style={styles.bannerOverlay}>
          <div style={styles.overlayTextContainer} className="glass-card">
            <h1 style={styles.brandTitle}>
              VER<span style={{ color: 'var(--accent-cyan)' }}>SA</span>
            </h1>
            <p style={styles.slogan}>Where Gamers Compete & Earn</p>
            <div style={styles.accentBar}></div>
            <p style={styles.brandPitch}>
              Enter the next generation of competitive gaming. Secure wagers, claim team bounties, and climb the Leaderboards. Back your gameplay with real coin power.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Form Details */}
      <div style={styles.formSide} className="form-side">
        <div style={styles.formCard} className="glass-panel">
          <h2 style={styles.formTitle}>
            {isSignUp ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p style={styles.formSubtitle}>
            {isSignUp ? 'Register your global gamer key' : 'Enter your credentials to enter the arena'}
          </p>

          {errorMsg && (
            <div style={styles.errorBox} className="neon-tag-magenta">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {isSignUp && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Gamer Tag (Username)</label>
                <input 
                  type="text" 
                  className="neon-input"
                  placeholder="e.g. ProGamer99"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                className="neon-input"
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                className="neon-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {isSignUp && (
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <input 
                  type="password" 
                  className="neon-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {!isSignUp && (
              <div style={styles.forgotPass}>
                <a href="#reset" onClick={() => alert('Password reset simulation triggered. Check your mock console.')} style={styles.forgotLink}>Forgot password?</a>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : isSignUp ? 'Create Gamer Key' : 'Enter Arena'}
            </button>
          </form>

          {/* Form Switch toggle */}
          <div style={styles.toggleContainer}>
            <span style={styles.toggleText}>
              {isSignUp ? 'Already registered?' : 'First time at VERSA?'}
            </span>
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
              style={styles.toggleBtn}
            >
              {isSignUp ? 'Sign In' : 'Register gamer tag'}
            </button>
          </div>

          {/* Social login divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>LINK WITH CONSOLE</span>
            <span style={styles.dividerLine}></span>
          </div>

          {/* Social Grid */}
          <div style={styles.oauthGrid}>
            <button onClick={() => handleOAuthClick('PSN')} style={{ ...styles.oauthBtn, borderColor: '#003087', color: '#003087' }} className="btn-secondary" title="Sign In with PlayStation Network">
              🔷 PSN
            </button>
            <button onClick={() => handleOAuthClick('Xbox')} style={{ ...styles.oauthBtn, borderColor: '#107c10', color: '#107c10' }} className="btn-secondary" title="Sign In with Xbox Live">
              🟩 Xbox
            </button>
            <button onClick={() => handleOAuthClick('Steam')} style={{ ...styles.oauthBtn, borderColor: '#1b2838', color: '#66c0f4' }} className="btn-secondary" title="Sign In with Steam">
              🌀 Steam
            </button>
          </div>
          <div style={{ ...styles.oauthGrid, marginTop: '0.75rem' }}>
            <button onClick={() => handleOAuthClick('Google')} style={{ ...styles.oauthBtn, flex: 1 }} className="btn-secondary" title="Sign In with Google">
              🌐 Google
            </button>
            <button onClick={() => handleOAuthClick('Apple')} style={{ ...styles.oauthBtn, flex: 1 }} className="btn-secondary" title="Sign In with Apple">
              🍎 Apple
            </button>
            <button onClick={() => handleOAuthClick('GitHub')} style={{ ...styles.oauthBtn, flex: 1, borderColor: '#24292e', color: '#e6edf3' }} className="btn-secondary" title="Sign In with GitHub">
              🐙 GitHub
            </button>
          </div>

          {/* Privacy Terms */}
          <p style={styles.legalPitch}>
            By continuing, you agree to our <a href="#terms" style={styles.legalLink}>Terms of Service</a> and <a href="#privacy" style={styles.legalLink}>Privacy Policy</a>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .split-screen-container {
          display: flex;
          min-height: calc(100vh - 70px);
          width: 100%;
        }
        .banner-side {
          flex: 1.1;
          position: relative;
        }
        .form-side {
          flex: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          background: #090c10;
        }
        @media (max-width: 960px) {
          .banner-side {
            display: none !important;
          }
          .form-side {
            flex: 1 !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  authContainer: {},
  bannerSide: {
    height: '100%'
  },
  imageWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to right, rgba(13, 17, 23, 0.4) 0%, rgba(13, 17, 23, 0.85) 100%)',
    display: 'flex',
    alignItems: 'center',
    padding: '3rem'
  },
  overlayTextContainer: {
    maxWidth: '480px',
    background: 'rgba(13, 17, 23, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '2.5rem'
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.15em',
    marginBottom: '0.5rem'
  },
  slogan: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--accent-blue)',
    textShadow: 'var(--blue-glow)',
    marginBottom: '1rem'
  },
  accentBar: {
    width: '60px',
    height: '4px',
    background: 'var(--neon-gradient)',
    marginBottom: '1.5rem',
    borderRadius: '2px'
  },
  brandPitch: {
    fontSize: '1rem',
    color: '#a0aec0',
    lineHeight: '1.6'
  },
  formSide: {},
  formCard: {
    maxWidth: '460px',
    width: '100%',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column'
  },
  formTitle: {
    fontSize: '1.65rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '0.4rem'
  },
  formSubtitle: {
    fontSize: '0.9rem',
    color: '#718096',
    marginBottom: '1.5rem'
  },
  errorBox: {
    fontSize: '0.85rem',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1.5rem',
    lineHeight: '1.4'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#a0aec0'
  },
  forgotPass: {
    alignSelf: 'flex-end',
    fontSize: '0.8rem'
  },
  forgotLink: {
    color: 'var(--accent-blue)'
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1.25rem',
    fontSize: '0.85rem'
  },
  toggleText: {
    color: '#718096'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-cyan)',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.75rem 0',
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#4a5568',
    letterSpacing: '0.1em'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)'
  },
  dividerText: {
    padding: '0 0.75rem'
  },
  oauthGrid: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'space-between'
  },
  oauthBtn: {
    flex: 1,
    padding: '0.65rem 0.25rem',
    fontSize: '0.85rem',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.02)',
    fontWeight: '700'
  },
  legalPitch: {
    fontSize: '0.75rem',
    color: '#4a5568',
    textAlign: 'center',
    marginTop: '1.75rem',
    lineHeight: '1.4'
  },
  legalLink: {
    color: '#718096',
    textDecoration: 'underline'
  }
};
