'use client';

import React from 'react';
import { useFirebase } from '../lib/firebase';

export default function RewardsPage() {
  const { currentUser, quests, claimReward } = useFirebase();

  // Define badges and evaluate status dynamically based on current user stats
  const BADGES = [
    { 
      id: 'b1', 
      title: 'Arena Novice', 
      desc: 'Win your first wager match in VERSA.', 
      icon: '🛡️', 
      unlocked: currentUser ? currentUser.wins >= 1 : false 
    },
    { 
      id: 'b2', 
      title: 'Wager Veteran', 
      desc: 'Complete at least 5 wins in competitive wagers.', 
      icon: '⚔️', 
      unlocked: currentUser ? currentUser.wins >= 5 : false 
    },
    { 
      id: 'b3', 
      title: 'Streak King', 
      desc: 'Climb to a 3 win streak in the wager arena.', 
      icon: '🔥', 
      unlocked: currentUser ? currentUser.streak >= 3 : false 
    },
    { 
      id: 'b4', 
      title: 'Guild Pioneer', 
      desc: 'Establish or unite with an active Union crew.', 
      icon: '🏰', 
      unlocked: currentUser ? !!currentUser.union : false 
    },
    { 
      id: 'b5', 
      title: 'Stripe Merchant', 
      desc: 'Initiate your first simulated Stripe cashout withdrawal.', 
      icon: '💸', 
      unlocked: currentUser ? (currentUser.wins >= 1 && quests.find(q => q.id === 'q4')?.completed) : false 
    }
  ];

  // Calculate Reward Tier Progress
  const totalWins = currentUser ? currentUser.wins : 0;
  let currentTier = 'Bronze Challenger';
  let tierColor = '#cd7f32';
  let nextTier = 'Silver Ranks';
  let progressPct = 0;

  if (totalWins >= 15) {
    currentTier = 'Platinum Legend';
    tierColor = '#e5e4e2';
    nextTier = 'Supreme God';
    progressPct = 100;
  } else if (totalWins >= 8) {
    currentTier = 'Gold Elite';
    tierColor = '#ffd700';
    nextTier = 'Platinum Legend';
    progressPct = Math.min(100, Math.floor(((totalWins - 8) / 7) * 100));
  } else if (totalWins >= 3) {
    currentTier = 'Silver Competitor';
    tierColor = '#c0c0c0';
    nextTier = 'Gold Elite';
    progressPct = Math.min(100, Math.floor(((totalWins - 3) / 5) * 100));
  } else {
    progressPct = Math.min(100, Math.floor((totalWins / 3) * 100));
  }

  const handleClaimClick = (qId) => {
    if (!currentUser) {
      alert('Please sign in to claim rewards.');
      return;
    }
    claimReward(qId);
    alert('Coins successfully claimed and credited to your global wallet! Keep grinding.');
  };

  const dailyQuests = quests.filter(q => q.category === 'daily');
  const weeklyQuests = quests.filter(q => q.category === 'weekly');

  return (
    <div className="container" style={styles.rewardsContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-cyan">⭐ Gamer Progression</span>
        <h1 style={styles.title}>QUESTS & BADGES</h1>
      </div>

      <div style={styles.grid} className="rewards-grid">
        {/* LEFT COLUMN: ACTIVE QUESTS */}
        <div style={styles.leftCol} className="rewards-left">
          {/* Active Quests card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>⚔️ ACTIVE DAILY QUESTS</h3>
            <div style={styles.questList}>
              {dailyQuests.map((q) => (
                <div key={q.id} style={styles.questRow} className="glass-panel responsive-quest-row">
                  <div style={styles.questInfo}>
                    <h4 style={styles.questTitle}>{q.title}</h4>
                    <p style={styles.questDesc}>{q.desc}</p>
                    <span style={styles.rewardTag}>🎁 Reward: 🪙 {q.reward} Coins</span>
                  </div>
                  <div style={styles.questAction}>
                    {q.claimed ? (
                      <span style={{ ...styles.statusTag, color: 'var(--accent-cyan)' }}>CLAIMED</span>
                    ) : q.completed ? (
                      <button onClick={() => handleClaimClick(q.id)} className="btn btn-primary" style={styles.claimBtn}>
                        Claim 🪙
                      </button>
                    ) : (
                      <span style={{ ...styles.statusTag, color: '#718096' }}>IN PROGRESS</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ ...styles.cardTitle, marginTop: '2.5rem' }}>⚔️ ACTIVE WEEKLY CHALLENGES</h3>
            <div style={styles.questList}>
              {weeklyQuests.map((q) => (
                <div key={q.id} style={styles.questRow} className="glass-panel responsive-quest-row">
                  <div style={styles.questInfo}>
                    <h4 style={styles.questTitle}>{q.title}</h4>
                    <p style={styles.questDesc}>{q.desc}</p>
                    <span style={styles.rewardTag}>🎁 Reward: 🪙 {q.reward} Coins</span>
                  </div>
                  <div style={styles.questAction}>
                    {q.claimed ? (
                      <span style={{ ...styles.statusTag, color: 'var(--accent-cyan)' }}>CLAIMED</span>
                    ) : q.completed ? (
                      <button onClick={() => handleClaimClick(q.id)} className="btn btn-primary" style={styles.claimBtn}>
                        Claim 🪙
                      </button>
                    ) : (
                      <span style={{ ...styles.statusTag, color: '#718096' }}>IN PROGRESS</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROGRESSION AND TROPHY CABINET */}
        <div style={styles.rightCol} className="rewards-right">
          {/* Rank Progression Card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>REWARD TIER LEVEL</h3>
            
            <div style={styles.rankTierDisplay}>
              <div style={{ ...styles.tierCircle, borderColor: tierColor, boxShadow: `0 0 20px ${tierColor}` }}>
                <span>🏆</span>
              </div>
              <div>
                <h2 style={{ ...styles.tierName, color: tierColor }}>{currentTier}</h2>
                <span style={styles.tierWinCount}>Wins Settled: {totalWins} Matches</span>
              </div>
            </div>

            <div style={styles.progressBox}>
              <div style={styles.progressHeader}>
                <span>Progress to {nextTier}</span>
                <span style={{ color: tierColor }}>{progressPct}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progressPct}%`, background: tierColor }}></div>
              </div>
            </div>
            
            <div style={styles.loyaltySummary}>
              <h4 style={styles.loyaltyTitle}>VERSA Competitor Privileges:</h4>
              <ul style={styles.loyaltyList}>
                <li>🛡️ VIP custom room branding overlays</li>
                <li>🪙 Access to higher wager thresholds</li>
                <li>⚡ Priority admin customer dispute settlements</li>
              </ul>
            </div>
          </div>

          {/* Badge Showcase cabinet */}
          <div className="glass-panel" style={styles.badgeCabinetCard}>
            <h3 style={styles.cardTitle}>GAMER TROPHY CABINET</h3>
            <p style={styles.cabinetDesc}>Trophies unlock dynamically based on your platform profile accomplishments.</p>
            
            <div style={styles.badgeGrid}>
              {BADGES.map((b) => (
                <div 
                  key={b.id} 
                  style={{ 
                    ...styles.badgeCard, 
                    borderColor: b.unlocked ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                    background: b.unlocked ? 'rgba(0, 240, 255, 0.04)' : 'rgba(0, 0, 0, 0.2)',
                    opacity: b.unlocked ? 1 : 0.45
                  }}
                  className="badge-card-hover"
                >
                  <span style={styles.badgeIcon}>{b.icon}</span>
                  <h4 style={styles.badgeTitle}>{b.title}</h4>
                  <p style={styles.badgeDesc}>{b.desc}</p>
                  <span style={{ 
                    ...styles.badgeStatus, 
                    color: b.unlocked ? 'var(--accent-cyan)' : '#718096' 
                  }}>
                    {b.unlocked ? '🏆 UNLOCKED' : '🔒 LOCKED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .badge-card-hover {
          transition: var(--transition-smooth);
        }
        .badge-card-hover:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 960px) {
          .rewards-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .responsive-quest-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  rewardsContainer: {
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
    gridTemplateColumns: '1fr 1fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  card: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1.25rem'
  },
  questList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  questRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.04)'
  },
  questInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  questTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#fff'
  },
  questDesc: {
    fontSize: '0.85rem',
    color: '#a0aec0',
    lineHeight: '1.4'
  },
  rewardTag: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#ffd700'
  },
  questAction: {
    flexShrink: 0
  },
  claimBtn: {
    padding: '0.45rem 1.25rem',
    borderRadius: '20px',
    fontSize: '0.85rem'
  },
  statusTag: {
    fontSize: '0.75rem',
    fontWeight: '800',
    letterSpacing: '0.05em'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  rankTierDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  tierCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '2.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  tierName: {
    fontSize: '1.5rem',
    fontWeight: '900'
  },
  tierWinCount: {
    fontSize: '0.85rem',
    color: '#718096',
    fontWeight: '600'
  },
  progressBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '2rem'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#cbd5e0'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.15)'
  },
  loyaltySummary: {
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1.25rem'
  },
  loyaltyTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem'
  },
  loyaltyList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingLeft: '0.25rem'
  },
  badgeCabinetCard: {
    padding: '2rem 1.5rem'
  },
  cabinetDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '2rem'
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '1.25rem'
  },
  badgeCard: {
    border: '1.5px solid',
    borderRadius: '12px',
    padding: '1.25rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.5rem'
  },
  badgeIcon: {
    fontSize: '2rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.4rem',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  badgeTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.2'
  },
  badgeDesc: {
    fontSize: '0.7rem',
    color: '#718096',
    lineHeight: '1.4',
    flex: 1
  },
  badgeStatus: {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    marginTop: '0.25rem'
  }
};
