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
    { href: '/tournaments', label: 'Tournaments' },
    { href: '/teams', label: 'Unions' },
    { href: '/rewards', label: 'Quests' },
    { href: '/feed', label: 'Feed' },
    { href: '/live', label: 'Streams' },
    { href: '/membership', label: 'VERSA Pass' }
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="glass-nav" style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        {/* Brand Logo */}
        <Link href="/" style={styles.logoLink}>
          <span style={styles.logoText}>
            VER<span style={{ color: 'var(--accent-gold)', textShadow: 'var(--gold-glow)' }}>SA</span>
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
                color: isActive(link.href) ? 'var(--accent-gold)' : 'var(--foreground)',
                borderBottom: isActive(link.href) ? '2px solid var(--accent-gold)' : '2px solid transparent',
                textShadow: isActive(link.href) ? 'var(--gold-glow)' : 'none'
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
                  color: isActive('/profile') ? 'var(--accent-gold)' : 'var(--foreground)',
                  borderBottom: isActive('/profile') ? '2px solid var(--accent-gold)' : '2px solid transparent'
                }}
              >
                Profile
              </Link>
              <Link 
                href="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  ...styles.link, 
                  color: isActive('/admin') ? 'var(--neon-amber)' : 'var(--foreground)',
                  borderBottom: isActive('/admin') ? '2px solid var(--neon-amber)' : '2px solid transparent',
                  textShadow: isActive('/admin') ? 'var(--amber-glow)' : 'none'
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
                {currentUser.isMember && (
                  <span style={styles.badgePro} title="Elite Pro Member">PRO</span>
                )}
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
          background: rgba(14, 14, 14, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: var(--transition-smooth);
        }
        
        @media (max-width: 1080px) {
          .nav-links-box {
            position: absolute !important;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98) !important;
            backdrop-filter: blur(25px);
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
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
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    fontSize: '0.85rem',
    fontWeight: '700',
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
    gap: '0.75rem'
  },
  coinBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '4px',
    padding: '0.4rem 0.65rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    boxShadow: 'var(--gold-glow)',
    transition: 'var(--transition-snappy)'
  },
  coinIcon: {
    fontSize: '0.9rem'
  },
  coinText: {
    fontVariantNumeric: 'tabular-nums',
    fontFamily: 'var(--font-mono)'
  },
  profileBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    padding: '0.4rem 0.65rem',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  avatar: {
    fontSize: '0.9rem'
  },
  username: {
    maxWidth: '90px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  badgePro: {
    fontSize: '0.6rem',
    fontWeight: 'bold',
    color: '#050505',
    background: 'var(--gold-gradient)',
    padding: '0.1rem 0.3rem',
    borderRadius: '2px'
  },
  signOutBtn: {
    padding: '0.4rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '4px'
  },
  signInBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    borderRadius: '4px'
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
