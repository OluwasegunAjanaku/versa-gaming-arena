'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

export default function TournamentsPage() {
  const { currentUser } = useFirebase();

  const [registeredList, setRegisteredList] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  const mockTournaments = [
    {
      id: 't_warzone',
      title: 'WARZONE FRIDAY PRO CUP',
      game: 'Call of Duty: Warzone',
      prize: '🪙 10,000 Coins',
      date: 'May 29, 2026',
      time: '08:00 PM EST',
      playersCount: 32,
      registered: 28,
      region: 'North America',
      rules: 'Duo Queues. Top 3 squad placement points + kill scores determine victory brackets.'
    },
    {
      id: 't_fc24',
      title: 'FC 24 CHAMPIONS MASTER OPEN',
      game: 'EA SPORTS FC 24',
      prize: '🪙 5,000 Coins',
      date: 'June 02, 2026',
      time: '07:30 PM GMT',
      playersCount: 8,
      registered: 6,
      region: 'Europe East',
      rules: '1v1 Single Elimination. FIFA Competitive Ruleset. 6-minute half.'
    },
    {
      id: 't_valorant',
      title: 'VALORANT GOLD AURELIAN SHOWCASE',
      game: 'Valorant',
      prize: '🪙 15,000 Coins',
      date: 'June 05, 2026',
      time: '09:00 PM EST',
      playersCount: 16,
      registered: 11,
      region: 'Latin America',
      rules: '5v5 Union lobbies. Active tactical server checks required via VACS drivers.'
    }
  ];

  // Dynamic bracket matches mockup
  const bracketMatches = {
    quarters: [
      { id: 1, p1: 'SniperElite', p2: 'TikiTakaMaster', s1: '3', s2: '1', winner: 'SniperElite' },
      { id: 2, p1: 'WraithMain', p2: 'PathfinderPro', s1: '2', s2: '3', winner: 'PathfinderPro' },
      { id: 3, p1: 'VersaGamer', p2: 'ApexSyndicate', s1: '0', s2: '2', winner: 'ApexSyndicate' },
      { id: 4, p1: 'GamerX', p2: 'LobbyKing', s1: '1', s2: '3', winner: 'LobbyKing' }
    ],
    semis: [
      { id: 5, p1: 'SniperElite', p2: 'PathfinderPro', s1: '2', s2: '1', winner: 'SniperElite' },
      { id: 6, p1: 'ApexSyndicate', p2: 'LobbyKing', s1: '0', s2: '2', winner: 'LobbyKing' }
    ],
    finals: [
      { id: 7, p1: 'SniperElite', p2: 'LobbyKing', s1: '-', s2: '-', winner: null }
    ]
  };

  const handleRegister = (tId) => {
    if (registeredList.includes(tId)) {
      alert('You have already registered for this tournament! Prepare your console logs.');
      return;
    }
    setRegisteredList([...registeredList, tId]);
    alert('Tournament Registration Secured! Check your notifications ledger for seed brackets.');
  };

  const isMember = currentUser?.isMember;

  // 1. Lockout if not a paid member
  if (!currentUser) {
    return (
      <div style={styles.lockoutPage}>
        <div style={styles.lockoutCard} className="glass-panel">
          <span style={styles.lockoutIcon}>🔒</span>
          <h2 style={styles.lockoutTitle}>SIGN IN REQUIRED</h2>
          <p style={styles.lockoutDesc}>Please sign in to your global gamer key to view the high-stakes tournaments arena.</p>
          <Link href="/auth" className="btn btn-primary" style={styles.lockoutBtn}>
            🎮 Sign In / Register Tag
          </Link>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return (
      <div style={styles.lockoutPage}>
        <div style={styles.lockoutCard} className="glass-panel">
          <span style={styles.lockoutIcon}>💎</span>
          <h2 style={styles.lockoutTitle}>TOURNAMENTS LOCKED</h2>
          <p style={styles.lockoutDesc}>
            High-stakes competitive tournaments and custom gold bracket challenges are reserved exclusively for **VERSA Elite Pro** subscribers.
          </p>
          <div style={styles.lockoutTips} className="glass-card">
            <p>💡 Upgrading unlocks monthly cash prize tournaments, lower dispute overhead, and union multiplier boosts.</p>
          </div>
          <div style={styles.lockoutBtns}>
            <Link href="/membership" className="btn btn-primary" style={styles.lockoutBtn}>
              ⚡ Unlock Premium Tournaments
            </Link>
            <Link href="/matches" className="btn btn-secondary" style={styles.lockoutBtn}>
              Back to Arena Wagers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.ambientGlow}></div>

      <div className="container" style={styles.content}>
        {/* Page Header */}
        <div style={styles.header}>
          <span className="neon-tag neon-tag-blue">🛡️ Elite Tournaments</span>
          <h1 style={styles.title}>CHAMPIONS CHALLENGE</h1>
          <p style={styles.subtitle}>Register for monthly bracket challenges, beat the competition, and score premium coin payouts.</p>
        </div>

        {/* Dynamic Tournament Selection Card Grid */}
        <div style={styles.tournamentsGrid}>
          {mockTournaments.map((t) => {
            const isReg = registeredList.includes(t.id);
            return (
              <div key={t.id} style={styles.tCard} className="glass-panel">
                <div style={styles.tHeader}>
                  <span className="technical-label">{t.game}</span>
                  <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.65rem' }}>{t.region}</span>
                </div>
                <h3 style={styles.tTitle}>{t.title}</h3>
                
                <div style={styles.tMetaRow} className="glass-card">
                  <div style={styles.metaCell}>
                    <span style={styles.metaLabel}>Prize Pool</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>{t.prize}</strong>
                  </div>
                  <div style={styles.metaCell}>
                    <span style={styles.metaLabel}>Players</span>
                    <strong>{t.registered + (isReg ? 1 : 0)} / {t.playersCount}</strong>
                  </div>
                  <div style={styles.metaCell}>
                    <span style={styles.metaLabel}>Timeline</span>
                    <strong style={{ fontSize: '0.75rem' }}>{t.date}</strong>
                  </div>
                </div>

                <div style={styles.rulesBox}>
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e0', lineHeight: '1.4' }}>
                    <strong>Ruleset:</strong> {t.rules}
                  </p>
                </div>

                <div style={styles.tActions}>
                  <button 
                    onClick={() => handleRegister(t.id)} 
                    className="btn btn-primary"
                    style={{
                      ...styles.regBtn,
                      background: isReg ? 'rgba(212,175,55,0.08)' : 'var(--gold-gradient)',
                      border: isReg ? '1px solid rgba(212,175,55,0.3)' : 'none',
                      color: isReg ? 'var(--accent-gold)' : '#050505',
                      boxShadow: isReg ? 'none' : 'var(--gold-glow)'
                    }}
                  >
                    {isReg ? '✓ Registered' : '🎮 Register For Roster'}
                  </button>
                  <button onClick={() => setSelectedTournament(t)} className="btn btn-secondary" style={styles.viewBtn}>
                    View Brackets
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BRACKETS VISUAL SHOWCASE */}
        <div style={styles.bracketsSection} className="glass-card">
          <div style={styles.bracketsHeader}>
            <div>
              <span className="neon-tag neon-tag-blue">Seed Grid</span>
              <h2 style={styles.bracketsTitle} className="text-gradient-gold">
                {selectedTournament ? `${selectedTournament.title} BRACKET` : 'FC 24 CHAMPIONS SEED BRACKET'}
              </h2>
            </div>
            <span style={styles.bracketLabel} className="technical-label">Single Elimination</span>
          </div>

          <p style={styles.bracketPitch}>
            Interactive esports grid mapping competitor wagers down to the Grand Finals. Connect your games, enter, and track seeds live.
          </p>

          {/* Interactive tree branch container */}
          <div style={styles.bracketTreeContainer} className="responsive-bracket-scroll">
            {/* Round 1: Quarterfinals */}
            <div style={styles.roundCol}>
              <h4 style={styles.roundHeader} className="technical-label">Quarterfinals</h4>
              <div style={styles.matchGroup}>
                {bracketMatches.quarters.map((match) => (
                  <div key={match.id} style={styles.matchNode} className="glass-panel">
                    <div style={{ ...styles.playerSlot, color: match.winner === match.p1 ? 'var(--accent-gold)' : '#cbd5e0' }}>
                      <span style={{ fontSize: '0.8rem' }}>👤 @{match.p1}</span>
                      <span style={styles.scoreVal}>{match.s1}</span>
                    </div>
                    <div style={styles.nodeDivider}></div>
                    <div style={{ ...styles.playerSlot, color: match.winner === match.p2 ? 'var(--accent-gold)' : '#cbd5e0' }}>
                      <span style={{ fontSize: '0.8rem' }}>👤 @{match.p2}</span>
                      <span style={styles.scoreVal}>{match.s2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Branch line connectors */}
            <div style={styles.connectorCol}>
              <div style={styles.connectorLinePair}>
                <div style={styles.cLineHorizontal}></div>
                <div style={styles.cLineVertical}></div>
              </div>
              <div style={{ ...styles.connectorLinePair, marginTop: '70px' }}>
                <div style={styles.cLineHorizontal}></div>
                <div style={styles.cLineVertical}></div>
              </div>
            </div>

            {/* Round 2: Semifinals */}
            <div style={styles.roundCol}>
              <h4 style={styles.roundHeader} className="technical-label">Semifinals</h4>
              <div style={{ ...styles.matchGroup, gap: '6.5rem', marginTop: '2.5rem' }}>
                {bracketMatches.semis.map((match) => (
                  <div key={match.id} style={styles.matchNode} className="glass-panel">
                    <div style={{ ...styles.playerSlot, color: match.winner === match.p1 ? 'var(--accent-gold)' : '#cbd5e0' }}>
                      <span style={{ fontSize: '0.8rem' }}>👤 @{match.p1}</span>
                      <span style={styles.scoreVal}>{match.s1}</span>
                    </div>
                    <div style={styles.nodeDivider}></div>
                    <div style={{ ...styles.playerSlot, color: match.winner === match.p2 ? 'var(--accent-gold)' : '#cbd5e0' }}>
                      <span style={{ fontSize: '0.8rem' }}>👤 @{match.p2}</span>
                      <span style={styles.scoreVal}>{match.s2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tree Branch final connectors */}
            <div style={styles.connectorCol}>
              <div style={{ ...styles.connectorLinePair, height: '180px', marginTop: '70px' }}>
                <div style={styles.cLineHorizontal}></div>
                <div style={styles.cLineVertical}></div>
              </div>
            </div>

            {/* Round 3: Grand Finals */}
            <div style={styles.roundCol}>
              <h4 style={styles.roundHeader} className="technical-label">Grand Finals</h4>
              <div style={{ ...styles.matchGroup, marginTop: '8rem' }}>
                {bracketMatches.finals.map((match) => (
                  <div key={match.id} style={{ ...styles.matchNode, borderColor: 'var(--primary-gold)', boxShadow: 'var(--gold-glow)' }} className="glass-panel">
                    <div style={styles.playerSlot}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>👤 @{match.p1}</span>
                      <span style={styles.scoreVal}>{match.s1}</span>
                    </div>
                    <div style={{ ...styles.nodeDivider, backgroundColor: 'var(--primary-gold)' }}></div>
                    <div style={styles.playerSlot}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>👤 @{match.p2}</span>
                      <span style={styles.scoreVal}>{match.s2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .responsive-bracket-scroll {
            overflow-x: auto !important;
            padding-bottom: 1.5rem !important;
            justify-content: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    width: '100%',
    padding: '4rem 1.5rem 6rem 1.5rem',
    position: 'relative',
    background: '#050505',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  ambientGlow: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '1000px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(5, 5, 5, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 1
  },
  content: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '3.5rem'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '0.1em',
    color: '#fff',
    textTransform: 'uppercase'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#cbd5e0',
    maxWidth: '650px',
    lineHeight: '1.6'
  },
  tournamentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2.5rem',
    width: '100%'
  },
  tCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderImage: 'none',
    borderRadius: '12px'
  },
  tHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tTitle: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.02em',
    lineHeight: '1.3'
  },
  tMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '6px'
  },
  metaCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  metaLabel: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    color: '#718096',
    textTransform: 'uppercase'
  },
  rulesBox: {
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.01)',
    borderLeft: '2px solid var(--primary-gold)'
  },
  tActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  regBtn: {
    flex: 1.2,
    padding: '0.75rem'
  },
  viewBtn: {
    flex: 0.8,
    padding: '0.75rem'
  },
  // Brackets Visuals
  bracketsSection: {
    padding: '2.5rem 3rem'
  },
  bracketsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  bracketsTitle: {
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '0.05em'
  },
  bracketLabel: {
    fontSize: '0.7rem'
  },
  bracketPitch: {
    fontSize: '0.9rem',
    color: '#cbd5e0',
    marginBottom: '3rem',
    maxWidth: '750px',
    lineHeight: '1.5'
  },
  bracketTreeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    minWidth: '780px'
  },
  roundCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
    flex: 1
  },
  roundHeader: {
    fontSize: '0.7rem',
    marginBottom: '1rem'
  },
  matchGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    width: '100%'
  },
  matchNode: {
    width: '100%',
    maxWidth: '220px',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem',
    borderImage: 'none',
    borderRadius: '6px',
    background: 'rgba(0,0,0,0.5)',
    gap: '0.4rem'
  },
  playerSlot: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem'
  },
  scoreVal: {
    fontFamily: 'var(--font-mono)',
    fontWeight: 'bold'
  },
  nodeDivider: {
    height: '1px',
    backgroundColor: 'rgba(255,255,255,0.06)'
  },
  // Lines connectors
  connectorCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '320px',
    width: '30px'
  },
  connectorLinePair: {
    display: 'flex',
    position: 'relative',
    height: '100px',
    width: '100%'
  },
  cLineHorizontal: {
    position: 'absolute',
    top: '50%',
    left: '0',
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--primary-gold)',
    opacity: 0.35
  },
  cLineVertical: {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '1px',
    height: '100%',
    backgroundColor: 'var(--primary-gold)',
    opacity: 0.35
  },
  // Lockout Styles
  lockoutPage: {
    minHeight: 'calc(100vh - 70px)',
    width: '100%',
    background: '#050505',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  lockoutCard: {
    maxWidth: '460px',
    width: '100%',
    padding: '3rem 2.5rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem'
  },
  lockoutIcon: {
    fontSize: '4rem'
  },
  lockoutTitle: {
    fontSize: '1.85rem',
    fontWeight: '900',
    color: 'var(--accent-gold)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  },
  lockoutDesc: {
    fontSize: '0.95rem',
    color: '#cbd5e0',
    lineHeight: '1.6'
  },
  lockoutTips: {
    padding: '0.85rem 1.25rem',
    fontSize: '0.85rem',
    color: '#cbd5e0',
    width: '100%',
    background: 'rgba(212, 175, 55, 0.03)'
  },
  lockoutBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    marginTop: '0.5rem'
  },
  lockoutBtn: {
    width: '100%',
    padding: '0.85rem'
  }
};
