'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

export default function ProfilePage() {
  const { currentUser, updateProfile, quests } = useFirebase();

  // Edit Profile States
  const [username, setUsername] = useState(currentUser?.username || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '🎮');
  const [bio, setBio] = useState('Competitive esports competitor. Backing my play with wager power! 🚀⚔️');
  const [psn, setPsn] = useState(currentUser?.psn || '');
  const [steam, setSteam] = useState(currentUser?.steam || '');
  const [xbox, setXbox] = useState(currentUser?.xbox || '');
  const [github, setGithub] = useState(currentUser?.github || '');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) return;
    if (!username) {
      setErrorMsg('Gamer Tag is mandatory.');
      return;
    }

    try {
      updateProfile(username, avatar, psn, steam, xbox, github);
      setSuccessMsg('Gamer key updated successfully across all VERSA systems.');
      setIsEditing(false);
    } catch (err) {
      setErrorMsg('Failed to update profile.');
    }
  };

  const handleLinkPlatformSim = (platform) => {
    if (!currentUser) return;
    const placeholderTag = `${currentUser.username}_${platform === 'psn' ? 'PS' : platform === 'xbox' ? 'XB' : platform === 'steam' ? 'ST' : 'GH'}`;
    
    if (platform === 'psn') setPsn(placeholderTag);
    else if (platform === 'xbox') setXbox(placeholderTag);
    else if (platform === 'steam') setSteam(placeholderTag);
    else if (platform === 'github') setGithub(placeholderTag);

    // Call update profile directly to link
    updateProfile(
      username, 
      avatar, 
      platform === 'psn' ? placeholderTag : psn, 
      platform === 'steam' ? placeholderTag : steam, 
      platform === 'xbox' ? placeholderTag : xbox,
      platform === 'github' ? placeholderTag : github
    );
    alert(`Success! Linked ${platform.toUpperCase()} network key: @${placeholderTag}`);
  };

  // Calculate Win Loss Ratio
  const wins = currentUser ? currentUser.wins : 0;
  const losses = currentUser ? currentUser.losses : 0;
  const totalGames = wins + losses;
  const wlRatio = totalGames > 0 ? (wins / Math.max(1, losses)).toFixed(2) : '0.00';
  const winRate = totalGames > 0 ? Math.floor((wins / totalGames) * 100) : 0;

  // Unlocked badges list
  const badgesCount = (wins >= 1 ? 1 : 0) + (wins >= 5 ? 1 : 0) + ((currentUser?.streak >= 3) ? 1 : 0) + (currentUser?.union ? 1 : 0) + (quests.find(q => q.id === 'q4')?.completed ? 1 : 0);

  return (
    <div className="container" style={styles.profileContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-blue">👤 Gamer ID</span>
        <h1 style={styles.title}>PLAYER PROFILE CONSOLE</h1>
      </div>

      {!currentUser ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <span>🔒</span>
          <h3>Gamer Console Locked</h3>
          <p style={{ color: '#718096', margin: '0.5rem 0 1.5rem 0' }}>Please sign in to view your statistics, edit gamer bio, or link consoles.</p>
          <Link href="/auth" className="btn btn-primary">Sign In / Register</Link>
        </div>
      ) : (
        <div style={styles.grid} className="profile-grid">
          {/* LEFT PANEL: PROFILE CARD & LINK MODULES */}
          <div style={styles.leftCol} className="profile-left">
            {/* Main Gamer Card */}
            <div className="glass-card" style={styles.gamerCard}>
              <div style={styles.gamerHeader}>
                <span style={styles.largeAvatar}>{currentUser.avatar || '🎮'}</span>
                <div>
                  <h2 style={styles.gamerName}>@{currentUser.username}</h2>
                  <span style={{ 
                    ...styles.unionBadge, 
                    color: currentUser.union ? 'var(--accent-cyan)' : '#718096' 
                  }}>
                    🛡️ {currentUser.union || 'NO UNION AFFILIATION'}
                  </span>
                </div>
              </div>

              <p style={styles.gamerBio}>{bio}</p>

              <div style={styles.gamerMetaRow}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>VERSA TIER</span>
                  <span style={styles.metaVal} className="text-gradient-blue">Bronze Competitor</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>BADGES SECURED</span>
                  <span style={styles.metaVal}>{badgesCount} Unlocked</span>
                </div>
              </div>

              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={styles.editBtn}>
                  ✍️ Edit Gamer Profile
                </button>
              ) : (
                <div style={styles.editDrawer} className="glass-panel">
                  <h3 style={styles.cardSubtitle}>EDIT GAMER INFO</h3>
                  {errorMsg && <div className="neon-tag-magenta" style={styles.formStatus}>{errorMsg}</div>}
                  
                  <form onSubmit={handleUpdateSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Gamer Tag</label>
                      <input 
                        type="text" 
                        className="neon-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Select Gamer Avatar</label>
                      <select 
                        value={avatar} 
                        onChange={(e) => setAvatar(e.target.value)}
                        style={styles.select}
                      >
                        <option value="🎮">🎮 Gamer Controller</option>
                        <option value="🎯">🎯 Sniper Target</option>
                        <option value="⚽">⚽ Football Soccer</option>
                        <option value="🤖">🤖 Pathfinder Bot</option>
                        <option value="👾">👾 Alien Ghost</option>
                        <option value="👑">👑 Gold Crown</option>
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Custom Bio</label>
                      <textarea 
                        className="neon-input" 
                        style={{ height: '70px', resize: 'none', padding: '0.5rem' }}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>

                    <div style={styles.drawerActions}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}>
                        Save Key
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)} 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.65rem', fontSize: '0.85rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Game Connections Card */}
            <div className="glass-card" style={styles.card}>
              <h3 style={styles.cardTitle}>GAMING PLATFORM CONNECTIONS</h3>
              <p style={styles.cardDesc}>Link your competitive handles. Connect to automate wager match setups.</p>
              
              <div style={styles.connectionList}>
                {/* PSN */}
                <div style={styles.connectionRow} className="glass-panel">
                  <div>
                    <h4 style={styles.platformName}>PlayStation Network (PSN)</h4>
                    <span style={styles.platformStatus}>
                      {currentUser.psn ? `Linked: @${currentUser.psn}` : 'Disconnected'}
                    </span>
                  </div>
                  {currentUser.psn ? (
                    <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.75rem' }}>LINKED</span>
                  ) : (
                    <button onClick={() => handleLinkPlatformSim('psn')} className="btn btn-outline-neon" style={styles.linkBtn}>
                      Connect PSN
                    </button>
                  )}
                </div>

                {/* Xbox */}
                <div style={styles.connectionRow} className="glass-panel">
                  <div>
                    <h4 style={styles.platformName}>Xbox Live network</h4>
                    <span style={styles.platformStatus}>
                      {currentUser.xbox ? `Linked: @${currentUser.xbox}` : 'Disconnected'}
                    </span>
                  </div>
                  {currentUser.xbox ? (
                    <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.75rem' }}>LINKED</span>
                  ) : (
                    <button onClick={() => handleLinkPlatformSim('xbox')} className="btn btn-outline-neon" style={styles.linkBtn}>
                      Connect Xbox
                    </button>
                  )}
                </div>

                {/* Steam */}
                <div style={styles.connectionRow} className="glass-panel">
                  <div>
                    <h4 style={styles.platformName}>Steam gaming library</h4>
                    <span style={styles.platformStatus}>
                      {currentUser.steam ? `Linked: @${currentUser.steam}` : 'Disconnected'}
                    </span>
                  </div>
                  {currentUser.steam ? (
                    <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.75rem' }}>LINKED</span>
                  ) : (
                    <button onClick={() => handleLinkPlatformSim('steam')} className="btn btn-outline-neon" style={styles.linkBtn}>
                      Connect Steam
                    </button>
                  )}
                </div>

                {/* GitHub */}
                <div style={styles.connectionRow} className="glass-panel">
                  <div>
                    <h4 style={styles.platformName}>GitHub Developer Profile</h4>
                    <span style={styles.platformStatus}>
                      {currentUser.github ? `Linked: @${currentUser.github}` : 'Disconnected'}
                    </span>
                  </div>
                  {currentUser.github ? (
                    <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.75rem' }}>LINKED</span>
                  ) : (
                    <button onClick={() => handleLinkPlatformSim('github')} className="btn btn-outline-neon" style={styles.linkBtn}>
                      Connect GitHub
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: STATS CONSOLE & QUICK WALLET */}
          <div style={styles.rightCol} className="profile-right">
            {/* Quick Wallet Shortcut */}
            <div className="glass-card" style={styles.walletCard}>
              <h3 style={styles.cardTitle}>WALLET QUICK DECK</h3>
              <div style={styles.walletRow}>
                <div style={styles.walletLeft}>
                  <span style={styles.walletCoin}>🪙</span>
                  <div>
                    <h4 style={styles.walletLabel}>COIN BALANCE</h4>
                    <span style={styles.walletVal}>{currentUser.coins.toLocaleString()} Coins</span>
                  </div>
                </div>
                <Link href="/wallet" className="btn btn-primary" style={styles.walletBtn}>
                  Go to Wallet
                </Link>
              </div>
            </div>

            {/* Performance Stats Panel */}
            <div className="glass-panel" style={styles.statsPanelCard}>
              <h3 style={styles.cardTitle}>COMPETITOR STATISTICS</h3>
              <p style={styles.statsDesc}>Live wager analytics parsed across all featured game wagers.</p>
              
              <div style={styles.statsGrid}>
                {/* Wins */}
                <div style={styles.statBox} className="glass-card">
                  <span style={styles.statIcon}>🏆</span>
                  <h4 style={styles.statLabel}>WINS RECORDED</h4>
                  <span style={{ ...styles.statVal, color: 'var(--accent-cyan)' }}>{wins} Wins</span>
                </div>

                {/* Losses */}
                <div style={styles.statBox} className="glass-card">
                  <span style={styles.statIcon}>💀</span>
                  <h4 style={styles.statLabel}>LOSSES RECORDED</h4>
                  <span style={{ ...styles.statVal, color: 'var(--accent-magenta)' }}>{losses} Losses</span>
                </div>

                {/* W/L Ratio */}
                <div style={styles.statBox} className="glass-card">
                  <span style={styles.statIcon}>📈</span>
                  <h4 style={styles.statLabel}>W/L STRETCH</h4>
                  <span style={styles.statVal}>{wlRatio} Ratio</span>
                </div>

                {/* Win Streak */}
                <div style={styles.statBox} className="glass-card">
                  <span style={styles.statIcon}>🔥</span>
                  <h4 style={styles.statLabel}>ACTIVE STREAK</h4>
                  <span style={{ ...styles.statVal, color: '#ffd700' }}>{currentUser.streak} Wins</span>
                </div>
              </div>

              {/* Ranks analysis bar */}
              <div style={styles.analysisRow}>
                <div style={styles.analysisHeader}>
                  <span>Competitor win rate efficiency</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>{winRate}%</span>
                </div>
                <div style={styles.analysisBar}>
                  <div style={{ ...styles.analysisFill, width: `${winRate}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 960px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  profileContainer: {
    padding: '3rem 1.5rem 5rem 1.5rem'
  },
  header: {
    marginBottom: '3.5rem'
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginTop: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '0.9fr 1.1fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  gamerCard: {
    background: 'rgba(10, 13, 20, 0.45)',
    padding: '2.5rem 2rem'
  },
  gamerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem'
  },
  largeAvatar: {
    fontSize: '3rem',
    background: 'rgba(255, 255, 255, 0.05)',
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(255, 255, 255, 0.08)'
  },
  gamerName: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: '#fff'
  },
  unionBadge: {
    fontSize: '0.8rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  gamerBio: {
    fontSize: '0.95rem',
    color: '#cbd5e0',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  gamerMetaRow: {
    display: 'flex',
    gap: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1.25rem',
    marginBottom: '1.5rem'
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  metaLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#718096',
    letterSpacing: '0.05em'
  },
  metaVal: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#fff'
  },
  editBtn: {
    width: '100%',
    borderRadius: '25px',
    padding: '0.65rem'
  },
  editDrawer: {
    padding: '1.25rem',
    marginTop: '1.5rem'
  },
  cardSubtitle: {
    fontSize: '0.95rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  },
  formStatus: {
    padding: '0.5rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    marginBottom: '1rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#a0aec0'
  },
  select: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '0.65rem',
    color: 'var(--foreground)',
    fontSize: '0.9rem',
    outline: 'none',
    cursor: 'pointer'
  },
  drawerActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem'
  },
  card: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem'
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '1.5rem'
  },
  connectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  connectionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem'
  },
  platformName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '0.2rem'
  },
  platformStatus: {
    fontSize: '0.8rem',
    color: '#718096'
  },
  linkBtn: {
    padding: '0.45rem 1rem',
    fontSize: '0.8rem',
    borderRadius: '16px'
  },
  // Right Column stats and wallet
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  walletCard: {
    background: 'rgba(10, 13, 20, 0.45)'
  },
  walletRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.75rem'
  },
  walletLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  walletCoin: {
    fontSize: '2rem'
  },
  walletLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#718096'
  },
  walletVal: {
    fontSize: '1.25rem',
    fontWeight: '900',
    color: '#ffd700',
    display: 'block'
  },
  walletBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: '20px',
    fontSize: '0.85rem'
  },
  statsPanelCard: {
    padding: '2.5rem 2rem'
  },
  statsDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
    marginBottom: '2.5rem'
  },
  statBox: {
    padding: '1.25rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.4rem',
    background: 'rgba(0, 0, 0, 0.2)',
    boxShadow: 'none',
    transform: 'none'
  },
  statIcon: {
    fontSize: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.25rem',
    borderRadius: '8px'
  },
  statLabel: {
    fontSize: '0.7rem',
    fontWeight: '800',
    color: '#718096',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statVal: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff'
  },
  analysisRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  analysisHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#cbd5e0'
  },
  analysisBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  analysisFill: {
    height: '100%',
    background: 'var(--neon-gradient)',
    borderRadius: '3px',
    boxShadow: 'var(--cyan-glow)'
  }
};
