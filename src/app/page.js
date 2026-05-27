'use client';

import React from 'react';
import Link from 'next/link';
import { useFirebase } from './lib/firebase';
import Image from 'next/image';

export default function Homepage() {
  const { matches, games, currentUser } = useFirebase();

  // Filter open or active matches for the ticker
  const activeTickerMatches = matches.slice(0, 5);

  return (
    <div style={styles.container}>
      {/* 1. HERO BANNER */}
      <section style={styles.heroSection}>
        <div className="container responsive-hero-grid" style={styles.heroGrid}>
          <div style={styles.heroTextContent} className="responsive-hero-text">
            <div style={styles.launchTag} className="neon-tag neon-tag-blue">
              ⚡ Season 4 Active
            </div>
            <h1 style={styles.heroTitle} className="responsive-hero-title">
              THE ARENA HAS <br />
              EVOLVED. <br />
              <span className="text-gradient-gold">BACK YOUR PLAY.</span>
            </h1>
            <p style={styles.heroDesc}>
              VERSA is the premium high-stakes esports wager arena. Participate in verified wagers, tournaments, and create private unions. Where gaming pride meets real payout.
            </p>
            <div style={styles.ctaRow}>
              <Link href="/matches" className="btn btn-primary" style={styles.ctaBtn}>
                🎮 Join Match Arena
              </Link>
              <Link href="/matches?create=true" className="btn btn-outline-neon" style={styles.ctaBtn}>
                ➕ Create Wager
              </Link>
            </div>
          </div>
          
          {/* Visual Showcase on the right of the Hero */}
          <div style={styles.heroShowcase} className="responsive-hero-showcase">
            <div className="glass-card" style={styles.showcaseCard}>
              <div style={styles.showcaseHeader}>
                <span className="pulse-icon"></span>
                <span style={styles.showcaseLabel} className="technical-label">VERSA Live Arena Payouts</span>
              </div>
              <h3 style={styles.showcaseTitle}>Winner Takes All</h3>
              <p style={styles.showcaseDesc}>Create matches, invite opponents, lock in wagers, and let the system split coins on winner declarations automatically.</p>
              
              <div style={styles.showcaseMetrics}>
                <div style={styles.metricItem}>
                  <span style={styles.metricVal}>1.25x</span>
                  <span style={styles.metricLabel} className="technical-label">Daily Bounties</span>
                </div>
                <div style={styles.metricItem}>
                  <span style={styles.metricVal}>0%</span>
                  <span style={styles.metricLabel} className="technical-label">Deposit Fees</span>
                </div>
                <div style={styles.metricItem}>
                  <span style={{ ...styles.metricVal, color: 'var(--accent-gold)' }}>99%</span>
                  <span style={styles.metricLabel} className="technical-label">Gamer Sat.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE MATCH TICKER */}
      <section style={styles.tickerSection} className="glass-card">
        <div className="container responsive-ticker-container" style={styles.tickerContainer}>
          <div style={styles.tickerLabelContainer} className="responsive-ticker-label">
            <span className="pulse-icon"></span>
            <h2 style={styles.tickerLabel}>LIVE WAGERS</h2>
          </div>
          <div style={styles.tickerTrack} className="ticker-track">
            {activeTickerMatches.map((m) => (
              <div key={m.id} style={styles.tickerCard} className="glass-card">
                <span style={styles.tickerGame}>{m.gameName}</span>
                <span style={styles.tickerTitle}>{m.title}</span>
                <span style={styles.tickerWager}>🪙 {m.wager} Coins</span>
                <span style={{ 
                  ...styles.tickerStatus, 
                  color: m.status === 'completed' ? 'var(--accent-gold)' : m.status === 'active' ? 'var(--neon-amber)' : 'var(--accent-gold)' 
                }}>
                  {m.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED GAMES CAROUSEL/GRID */}
      <section className="container" style={styles.gamesSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>FEATURED ARENAS</h2>
          <p style={styles.sectionSubtitle}>Manually curated battlefields. Select a title to filter wager lobbies.</p>
        </div>
        <div style={styles.gamesGrid}>
          {games.map((g) => (
            <Link key={g.id} href={`/matches?game=${g.id}`} style={styles.gameCard} className="glass-card">
              <div style={styles.gameImageWrapper}>
                <Image 
                  src={g.image} 
                  alt={g.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={styles.gameInfo}>
                <span style={styles.gameCategory} className="neon-tag neon-tag-blue">{g.category}</span>
                <h3 style={styles.gameName}>{g.name}</h3>
                <span style={styles.gameAction}>Enter Lobby ➡️</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. COIN REWARDS HIGHLIGHT */}
      <section style={styles.rewardsSection}>
        <div className="container responsive-rewards-container" style={styles.rewardsContainer}>
          <div style={styles.rewardsText}>
            <span className="neon-tag neon-tag-cyan">💎 Premium Rewards</span>
            <h2 style={styles.rewardsTitle}>EARN LOYALTY COINS</h2>
            <p style={styles.rewardsDesc}>
              Earning coins on VERSA extends beyond match victories. Complete daily quests, create unions with your crew to earn multipliers, and invite teammates to boost rewards.
            </p>
            <div style={styles.featuresList}>
              <div style={styles.featureItem}>
                <span style={styles.featIcon}>🛡️</span>
                <div>
                  <h4 style={styles.featTitle}>Daily Quests</h4>
                  <p style={styles.featDesc}>Log in daily to claim quest cards and boost your balance.</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featIcon}>🏆</span>
                <div>
                  <h4 style={styles.featTitle}>Union Multipliers</h4>
                  <p style={styles.featDesc}>Build teams, win guild matches, and score union payouts.</p>
                </div>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featIcon}>💳</span>
                <div>
                  <h4 style={styles.featTitle}>Stripe Cashouts</h4>
                  <p style={styles.featDesc}>Simulate bank withdrawals and redeem coins at stable rates.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rewards Mock Graphics */}
          <div style={styles.rewardsGraphics} className="glass-panel">
            <h3 style={styles.panelTitle} className="text-gradient-gold">VERSA COIN VALUE</h3>
            <p style={styles.panelSubtitle}>Redeem stable coins at stable rates.</p>
            
            <div style={styles.coinShowcase}>
              <div style={styles.goldCoin}>
                <span>🪙</span>
              </div>
              <div style={styles.coinValueBox}>
                <h4 style={styles.coinVal}>100 Coins = $1.00 USD</h4>
                <p style={styles.coinFee}>No conversion hidden markup fees.</p>
              </div>
            </div>

            <div style={styles.progressBox}>
              <div style={styles.progressHeader}>
                <span>Elite Tier Progress</span>
                <span style={{ color: 'var(--accent-gold)' }}>65%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
            </div>
            
            <Link href="/rewards" className="btn btn-primary" style={{ width: '100%' }}>
              Check My Quests
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="container" style={styles.testimonialsSection}>
        <div style={styles.sectionHeader}>
          <span className="neon-tag neon-tag-cyan">⭐ Community reviews</span>
          <h2 style={styles.sectionTitle}>TRUSTED BY CHAMPION GAMERS</h2>
        </div>
        
        <div style={styles.testimonialsGrid}>
          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;I made 5,000 coins on Warzone wagers last week! Payout was simulated instantly via Stripe bank deposit. Incredible premium gold look!&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>🎯</span>
              <div>
                <h4 style={styles.authorName}>SniperElite</h4>
                <span style={styles.authorTitle}>COD Pro Wagerer</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;Playing in custom Union guilds is the best feature. We extended our Vanguard Elite team roster to 10 players and won the Sunday tournament!&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>⚽</span>
              <div>
                <h4 style={styles.authorName}>TikiTakaMaster</h4>
                <span style={styles.authorTitle}>FC24 Union Leader</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;VACS scanned my background drivers, flagged my overlays, and passed me cleanly on clean restart. Secure and hacker-free wagers guaranteed!&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>👾</span>
              <div>
                <h4 style={styles.authorName}>WraithMain</h4>
                <span style={styles.authorTitle}>Apex Legend</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .responsive-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 3rem;
          align-items: center;
        }
        .ticker-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: none;
        }
        .ticker-track::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 960px) {
          .responsive-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .responsive-hero-showcase {
            display: none !important;
          }
          .responsive-ticker-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .responsive-rewards-container {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '5rem',
    background: '#050505',
    position: 'relative'
  },
  heroSection: {
    padding: '6rem 0 5rem 0',
    position: 'relative'
  },
  heroGrid: {},
  heroTextContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.5rem'
  },
  launchTag: {
    fontSize: '0.75rem'
  },
  heroTitle: {
    fontSize: '3.25rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    lineHeight: '1.05',
    textTransform: 'uppercase'
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#cbd5e0',
    lineHeight: '1.7',
    maxWidth: '520px'
  },
  ctaRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  ctaBtn: {
    padding: '0.9rem 2rem'
  },
  heroShowcase: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  showcaseCard: {
    maxWidth: '400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    border: '1px solid rgba(212, 175, 55, 0.25)'
  },
  showcaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  showcaseLabel: {
    fontSize: '0.7rem'
  },
  showcaseTitle: {
    fontSize: '1.65rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  },
  showcaseDesc: {
    fontSize: '0.9rem',
    color: '#cbd5e0',
    lineHeight: '1.5'
  },
  showcaseMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  metricVal: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#fff'
  },
  metricLabel: {
    fontSize: '0.65rem'
  },
  // Ticker Section
  tickerSection: {
    margin: '0 auto 4rem auto',
    maxWidth: '1240px',
    padding: '1.25rem 2rem',
    borderImage: 'none',
    borderRadius: '8px',
    background: 'rgba(14, 14, 14, 0.5)'
  },
  tickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2.5rem',
    padding: 0
  },
  tickerLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    paddingRight: '2rem',
    whiteSpace: 'nowrap'
  },
  tickerLabel: {
    fontSize: '0.85rem',
    fontWeight: '900',
    letterSpacing: '0.08em',
    color: '#fff'
  },
  tickerTrack: {},
  tickerCard: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '6px',
    padding: '0.6rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    whiteSpace: 'nowrap',
    boxShadow: 'none',
    transform: 'none'
  },
  tickerGame: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: 'var(--accent-gold)',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)'
  },
  tickerTitle: {
    fontSize: '0.85rem',
    color: '#fff'
  },
  tickerWager: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--accent-gold)'
  },
  tickerStatus: {
    fontSize: '0.7rem',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)'
  },
  // Featured Games Arenas
  gamesSection: {
    marginBottom: '6rem'
  },
  sectionHeader: {
    marginBottom: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#cbd5e0'
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem'
  },
  gameCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '340px',
    padding: 0
  },
  gameImageWrapper: {
    position: 'relative',
    height: '220px',
    width: '100%'
  },
  gameInfo: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    flexGrow: 1
  },
  gameCategory: {
    fontSize: '0.65rem',
    alignSelf: 'flex-start'
  },
  gameName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff'
  },
  gameAction: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    marginTop: '0.25rem'
  },
  // Rewards center
  rewardsSection: {
    padding: '6rem 0',
    background: 'rgba(14, 14, 14, 0.45)',
    borderTop: '1px solid rgba(212, 175, 55, 0.15)',
    borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
  },
  rewardsContainer: {},
  rewardsText: {},
  rewardsTitle: {},
  rewardsDesc: {},
  featuresList: {},
  featureItem: {},
  featIcon: {},
  featTitle: {},
  featDesc: {},
  rewardsGraphics: {
    borderRadius: '12px',
    borderImage: 'none'
  },
  panelTitle: {},
  panelSubtitle: {},
  coinShowcase: {},
  goldCoin: {},
  coinValueBox: {},
  coinVal: {},
  coinFee: {},
  progressBox: {},
  progressHeader: {},
  progressBar: {},
  progressFill: {
    width: '65%',
    height: '100%',
    background: 'var(--gold-gradient)',
    boxShadow: 'var(--gold-glow)',
    borderRadius: '3px'
  },
  // Testimonials
  testimonialsSection: {},
  testimonialsGrid: {},
  testiCard: {},
  quote: {},
  authorRow: {},
  authorAvatar: {},
  authorName: {},
  authorTitle: {
    fontSize: '0.75rem',
    color: 'var(--accent-gold)',
    fontWeight: '600'
  }
};
