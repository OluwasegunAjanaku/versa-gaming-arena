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
              ⚡ V1 MVP Live Arena
            </div>
            <h1 style={styles.heroTitle} className="responsive-hero-title">
              THE DECISION HAS <br />
              BEEN MADE. <br />
              <span className="text-gradient-blue">BACK YOUR PLAY.</span>
            </h1>
            <p style={styles.heroDesc}>
              VERSA is the premium esports wager arena. Create direct wagers, challenge the community, earn coins on wins, and cash out instantly. Where gaming pride meets real payout.
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
                <span style={styles.showcaseLabel}>VERSA Live Arena Payouts</span>
              </div>
              <h3 style={styles.showcaseTitle}>Winner Takes All</h3>
              <p style={styles.showcaseDesc}>Create matches, invite opponents, lock in wagers, and let the system split coins on winner declarations automatically.</p>
              
              <div style={styles.showcaseMetrics}>
                <div style={styles.metricItem}>
                  <span style={styles.metricVal}>1.5x</span>
                  <span style={styles.metricLabel}>Daily Bounties</span>
                </div>
                <div style={styles.metricItem}>
                  <span style={styles.metricVal}>0%</span>
                  <span style={styles.metricLabel}>Deposit Fees</span>
                </div>
                <div style={styles.metricItem}>
                  <span style={{ ...styles.metricVal, color: 'var(--accent-cyan)' }}>99%</span>
                  <span style={styles.metricLabel}>Gamer Sat.</span>
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
                  color: m.status === 'completed' ? 'var(--accent-cyan)' : m.status === 'active' ? 'var(--accent-magenta)' : 'var(--accent-blue)' 
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
            <span className="neon-tag neon-tag-magenta">💎 Premium Rewards</span>
            <h2 style={styles.rewardsTitle}>EARN LOYALTY COINS</h2>
            <p style={styles.rewardsDesc}>
              Earning coins on VERSA extends beyond match victories. Complete daily quests, create guilds with your crew to earn Union Reward bonuses, and invite friends to earn direct commissions on their wagers.
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
            <h3 style={styles.panelTitle}>VERSA COIN VALUE</h3>
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
                <span style={{ color: 'var(--accent-cyan)' }}>65%</span>
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
          <h2 style={styles.sectionTitle}>TRUSTED BY CHANGER GAMERS</h2>
        </div>
        
        <div style={styles.testimonialsGrid}>
          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;I made 5,000 coins on Warzone wagers last week! Payout was simulated instantly via Stripe bank deposit. Incredible premium look!&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>🎯</span>
              <div>
                <h4 style={styles.authorName}>SniperElite</h4>
                <span style={styles.authorTitle}>COD Competitor</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;Our esports club formed a Union here. The Union Reward score motivates everyone to keep winning. Best platform for wagering out there.&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>👾</span>
              <div>
                <h4 style={styles.authorName}>WraithMain</h4>
                <span style={styles.authorTitle}>Apex Syndicate Leader</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={styles.testiCard}>
            <p style={styles.quote}>&ldquo;Smooth glass aesthetics, responsive layouts on iPhone, and clean form validation. Swapping mock data for real Firebase auth takes seconds.&rdquo;</p>
            <div style={styles.authorRow}>
              <span style={styles.authorAvatar}>⚽</span>
              <div>
                <h4 style={styles.authorName}>TikiTakaMaster</h4>
                <span style={styles.authorTitle}>FC24 Wager Host</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .ticker-track {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: none; /* Firefox */
        }
        .ticker-track::-webkit-scrollbar {
          display: none; /* Chrome */
        }
        @media (max-width: 960px) {
          .responsive-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            text-align: center !important;
          }
          .responsive-hero-text {
            align-items: center !important;
          }
          .responsive-hero-showcase {
            max-width: 480px !important;
            margin: 0 auto !important;
            width: 100% !important;
          }
          .responsive-rewards-container {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 768px) {
          .responsive-hero-title {
            font-size: 2.5rem !important;
          }
          .responsive-ticker-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .responsive-ticker-label {
            border-right: none !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    paddingBottom: '4rem'
  },
  heroSection: {
    padding: '5rem 0 4rem 0',
    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(10, 132, 255, 0.12) 0%, rgba(13, 17, 23, 0) 50%)'
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'center'
  },
  heroTextContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.25rem'
  },
  launchTag: {
    fontSize: '0.8rem',
    fontWeight: '800'
  },
  heroTitle: {
    fontSize: '3.75rem',
    fontWeight: '900',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    color: '#fff'
  },
  heroDesc: {
    fontSize: '1.15rem',
    color: '#a0aec0',
    lineHeight: '1.6',
    maxWidth: '560px'
  },
  ctaRow: {
    display: 'flex',
    gap: '1.25rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  ctaBtn: {
    padding: '0.9rem 2.25rem',
    borderRadius: '30px'
  },
  heroShowcase: {
  },
  showcaseCard: {
    padding: '2.5rem',
    background: 'rgba(10, 13, 20, 0.5)'
  },
  showcaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem'
  },
  showcaseLabel: {
    fontSize: '0.8rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--accent-blue)'
  },
  showcaseTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '0.75rem'
  },
  showcaseDesc: {
    fontSize: '0.95rem',
    color: '#a0aec0',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  showcaseMetrics: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1.5rem'
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  metricVal: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#fff'
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#718096',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  tickerSection: {
    margin: '0 2rem 3rem 2rem',
    borderRadius: '16px',
    padding: '1rem 2rem',
    background: 'rgba(13, 17, 23, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  tickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  tickerLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    paddingRight: '1.5rem',
    flexShrink: 0
  },
  tickerLabel: {
    fontSize: '0.85rem',
    fontWeight: '900',
    letterSpacing: '0.1em',
    color: 'var(--accent-magenta)',
    textShadow: 'var(--pink-glow)'
  },
  tickerTrack: {
    flex: 1,
    display: 'flex',
    gap: '1.5rem'
  },
  tickerCard: {
    padding: '0.75rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexShrink: 0,
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.25)',
    boxShadow: 'none',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    transform: 'none'
  },
  tickerGame: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--accent-blue)',
    textTransform: 'uppercase'
  },
  tickerTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff'
  },
  tickerWager: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffd700'
  },
  tickerStatus: {
    fontSize: '0.7rem',
    fontWeight: '800',
    letterSpacing: '0.05em'
  },
  gamesSection: {
    padding: '3rem 1.5rem'
  },
  sectionHeader: {
    marginBottom: '2.5rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    letterSpacing: '0.05em',
    color: '#fff'
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#a0aec0'
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem'
  },
  gameCard: {
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '360px'
  },
  gameImageWrapper: {
    position: 'relative',
    height: '220px',
    width: '100%',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  gameInfo: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flex: 1,
    justifyContent: 'space-between'
  },
  gameCategory: {
    alignSelf: 'flex-start'
  },
  gameName: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.3'
  },
  gameAction: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)'
  },
  rewardsSection: {
    padding: '5rem 0',
    background: 'rgba(10, 13, 20, 0.3)',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
  },
  rewardsContainer: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '4rem',
    alignItems: 'center'
  },
  rewardsText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    alignItems: 'flex-start'
  },
  rewardsTitle: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.02em',
    lineHeight: '1.1'
  },
  rewardsDesc: {
    fontSize: '1.05rem',
    color: '#a0aec0',
    lineHeight: '1.7'
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginTop: '1rem',
    width: '100%'
  },
  featureItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  featIcon: {
    fontSize: '1.75rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.5rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  featTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  featDesc: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    lineHeight: '1.5'
  },
  rewardsGraphics: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    background: 'rgba(8, 10, 15, 0.7)'
  },
  panelTitle: {
    fontSize: '1.25rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em'
  },
  panelSubtitle: {
    fontSize: '0.85rem',
    color: '#718096',
    marginTop: '-0.75rem'
  },
  coinShowcase: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 215, 0, 0.15)'
  },
  goldCoin: {
    fontSize: '2.25rem',
    animation: 'spin 3s linear infinite'
  },
  coinValueBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  coinVal: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#ffd700'
  },
  coinFee: {
    fontSize: '0.8rem',
    color: '#718096'
  },
  progressBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#a0aec0'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    width: '65%',
    height: '100%',
    background: 'var(--neon-gradient)',
    boxShadow: 'var(--cyan-glow)',
    borderRadius: '3px'
  },
  testimonialsSection: {
    padding: '5rem 1.5rem 2rem 1.5rem'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '1rem'
  },
  testiCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1.5rem'
  },
  quote: {
    fontSize: '0.95rem',
    color: '#cbd5e0',
    fontStyle: 'italic',
    lineHeight: '1.6'
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  authorAvatar: {
    fontSize: '1.5rem',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '0.4rem',
    borderRadius: '50%'
  },
  authorName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff'
  },
  authorTitle: {
    fontSize: '0.75rem',
    color: 'var(--accent-blue)',
    fontWeight: '600'
  }
};
