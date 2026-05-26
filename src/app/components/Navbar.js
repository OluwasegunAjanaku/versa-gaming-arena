'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFirebase } from '../lib/firebase';

export default function Navbar() {
  const { currentUser, signOut } = useFirebase();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/matches', label: 'Arena' },
    { href: '/teams', label: 'Unions' },
    { href: '/rewards', label: 'Quests' },
    { href: '/feed', label: 'Feed' },
    { href: '/live', label: 'Streams' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="glass-nav" style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <Link href="/" style={styles.logoLink}>
          <span style={styles.logoText}>
            VER<span style={{ color: 'var(--accent-cyan)', textShadow: 'var(--cyan-glow)' }}>SA</span>
          </span>
        </Link>

        {/* Mobile Hamburger toggle */}
        <button 
          style={styles.hamburger} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <div style={{ ...styles.bar, transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
          <div style={{ ...styles.bar, opacity: mobileMenuOpen ? 0 : 1 }}></div>
          <div style={{ ...styles.bar, transform: mobileMenuOpen ? 'rotate(-45deg) translate(6deg, -6deg)' : 'none' }}></div>
        </button>

        {/* Desktop Navigation Link items */}
        <div style={{ ...styles.linksContainer, display: mobileMenuOpen ? 'flex' : 'none' }} className="nav-links-box">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              style={{ 
                ...styles.link, 
                color: isActive(link.href) ? 'var(--accent-cyan)' : 'var(--foreground)',
                borderBottom: isActive(link.href) ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                textShadow: isActive(link.href) ? 'var(--cyan-glow)' : 'none'
              }}
            >
              {link.label}
            </Link>
          ))}

          {currentUser && (
            <>
              <Link 
                href="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  ...styles.link, 
                  color: isActive('/profile') ? 'var(--accent-cyan)' : 'var(--foreground)',
                  borderBottom: isActive('/profile') ? '2px solid var(--accent-cyan)' : '2px solid transparent'
                }}
              >
                Profile
              </Link>
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  ...styles.link, 
                  color: isActive('/admin') ? 'var(--accent-magenta)' : 'var(--foreground)',
                  borderBottom: isActive('/admin') ? '2px solid var(--accent-magenta)' : '2px solid transparent',
                  textShadow: isActive('/admin') ? 'var(--pink-glow)' : 'none'
                }}
              >
                Admin
              </Link>
            </>
          )}
        </div>

        {/* Right side Auth Status */}
        <div style={styles.authContainer}>
          {currentUser ? (
            <div style={styles.userBox}>
              <Link href="/wallet" style={styles.coinBadge}>
                <span style={styles.coinIcon}>🪙</span>
                <span style={styles.coinText}>{currentUser.coins.toLocaleString()}</span>
              </Link>
              <Link href="/profile" style={styles.profileBadge}>
                <span style={styles.avatar}>{currentUser.avatar || '🎮'}</span>
                <span style={styles.username}>{currentUser.username}</span>
              </Link>
              <button onClick={signOut} className="btn btn-secondary" style={styles.signOutBtn}>
                Exit
              </button>
            </div>
          ) : (
            <Link href="/auth" className="btn btn-primary" style={styles.signInBtn}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      <style jsx global>{`
        .glass-nav {
          background: rgba(13, 17, 23, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: var(--transition-smooth);
        }
        
        @media (max-width: 960px) {
          .nav-links-box {
            position: absolute !important;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 12, 16, 0.95) !important;
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            flex-direction: column !important;
            padding: 1.5rem !important;
            gap: 1.5rem !important;
            align-items: center !important;
          }
        }
      `}</style>
    </nav>
  );
}

const styles = {
  nav: {
    height: '70px',
    display: 'flex',
    alignItems: 'center'
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center'
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.1em',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
  },
  linksContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  link: {
    fontSize: '0.95rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    padding: '0.25rem 0',
    textTransform: 'uppercase',
    borderBottom: '2px solid transparent'
  },
  authContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  coinBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255, 215, 0, 0.1)',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '20px',
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#ffd700',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.1)',
    transition: 'var(--transition-snappy)'
  },
  coinIcon: {
    fontSize: '1rem'
  },
  coinText: {
    fontVariantNumeric: 'tabular-nums'
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    padding: '0.4rem 0.8rem',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  avatar: {
    fontSize: '1rem'
  },
  username: {
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  signOutBtn: {
    padding: '0.4rem 1rem',
    fontSize: '0.8rem',
    borderRadius: '20px'
  },
  signInBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    borderRadius: '25px'
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  },
  bar: {
    width: '100%',
    height: '2px',
    backgroundColor: '#fff',
    transition: '0.3s'
  }
};
