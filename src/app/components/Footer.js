'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer} className="glass-footer">
      <div className="container glass-footer-grid">
        {/* Slogan and Brand Column */}
        <div style={styles.infoCol}>
          <Link href="/" style={styles.logoLink}>
            <span style={styles.logoText}>
              VER<span style={{ color: 'var(--accent-cyan)', textShadow: 'var(--cyan-glow)' }}>SA</span>
            </span>
          </Link>
          <p style={styles.slogan}>Where Gamers Compete & Earn</p>
          <p style={styles.desc}>
            The ultimate decentralized arena for esports wagers, tournaments, and guilds. Elevate your play, back your skills, and earn rewards instantly.
          </p>
        </div>

        {/* Quick Links Column */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>Sitemap</h4>
          <ul style={styles.linksList}>
            <li><Link href="/matches" style={styles.link}>Wager Arena</Link></li>
            <li><Link href="/teams" style={styles.link}>Unions & Guilds</Link></li>
            <li><Link href="/rewards" style={styles.link}>Quest Center</Link></li>
            <li><Link href="/live" style={styles.link}>Watch Party</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>Support</h4>
          <ul style={styles.linksList}>
            <li><Link href="/auth" style={styles.link}>Auth Deck</Link></li>
            <li><a href="#privacy" style={styles.link}>Privacy Policy</a></li>
            <li><a href="#terms" style={styles.link}>Terms of Service</a></li>
            <li><a href="#support" style={styles.link}>Contact Us</a></li>
          </ul>
        </div>

        {/* Social Links Column */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>Community</h4>
          <div style={styles.socialIcons}>
            <a href="#discord" style={styles.socialBtn} aria-label="Discord">👾 Discord</a>
            <a href="#twitter" style={styles.socialBtn} aria-label="Twitter">🐦 Twitter</a>
            <a href="#twitch" style={styles.socialBtn} aria-label="Twitch">🎮 Twitch</a>
            <a href="#youtube" style={styles.socialBtn} aria-label="YouTube">📺 YouTube</a>
          </div>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomContainer}>
          <p style={styles.copyright}>
            © {currentYear} VERSA Esports Technologies Inc. Inspired by PlayStation. All mock features are fully simulated for testing.
          </p>
          <div style={styles.badgeRow}>
            <span style={{ ...styles.badge, color: 'var(--accent-blue)', borderColor: 'var(--accent-blue)' }}>WAGER TEST</span>
            <span style={{ ...styles.badge, color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}>SSL SECURE</span>
            <span style={{ ...styles.badge, color: 'var(--accent-magenta)', borderColor: 'var(--accent-magenta)' }}>STRIPE SIM</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .glass-footer {
          background: rgba(8, 10, 14, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 3rem;
          margin-top: auto;
        }
        .glass-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2.5rem;
          padding-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .glass-footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}

const styles = {
  footer: {
    width: '100%'
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  logoLink: {
    display: 'inline-block'
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.1em'
  },
  slogan: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    textShadow: 'var(--cyan-glow)'
  },
  desc: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    lineHeight: '1.6',
    maxWidth: '380px'
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  colTitle: {
    fontSize: '1rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#fff'
  },
  linksList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  link: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    transition: 'var(--transition-snappy)'
  },
  socialIcons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  socialBtn: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-snappy)'
  },
  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1.5rem 0',
    background: '#07090c'
  },
  bottomContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  copyright: {
    fontSize: '0.8rem',
    color: '#718096',
    lineHeight: '1.5'
  },
  badgeRow: {
    display: 'flex',
    gap: '0.5rem'
  },
  badge: {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    padding: '0.15rem 0.5rem',
    borderRadius: '3px',
    border: '1px solid'
  }
};
