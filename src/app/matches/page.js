'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

function WagerArenaContent() {
  const { 
    currentUser, 
    matches, 
    games, 
    createMatch, 
    joinMatch, 
    declareWinner 
  } = useFirebase();

  const searchParams = useSearchParams();

  // Dialog Ref for details modal
  const dialogRef = useRef(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Filter and Form states
  const [filterGame, setFilterGame] = useState(searchParams.get('game') || 'all');
  const [filterWager, setFilterWager] = useState('all');
  const [activeTab, setActiveTab] = useState('open'); // open, active, completed

  // Create match form states
  const [matchTitle, setMatchTitle] = useState('');
  const [matchGame, setMatchGame] = useState('cod');
  const [matchWager, setMatchWager] = useState(50);
  const [matchPlayers, setMatchPlayers] = useState(2);
  const [matchIsPublic, setMatchIsPublic] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Membership lockout warning modal state
  const [showLockoutModal, setShowLockoutModal] = useState(false);

  // Check query parameters to pre-fill or focus
  useEffect(() => {
    const createParam = searchParams.get('create');
    const gameParam = searchParams.get('game');

    if (createParam === 'true') {
      const element = document.getElementById('match-builder-card');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('pulse-glow');
        setTimeout(() => element.classList.remove('pulse-glow'), 2000);
      }
    }

    if (gameParam && gameParam !== filterGame) {
      setTimeout(() => {
        setFilterGame(gameParam);
      }, 0);
    }
  }, [searchParams, filterGame]);

  // Backdrop click handler for detail modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event) => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      }
    };

    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  const handleOpenDetails = (match) => {
    const isLocked = match.isPublic && !currentUser?.isMember;
    if (isLocked) {
      setShowLockoutModal(true);
      return;
    }

    setSelectedMatch(match);
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const handleCloseDetails = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    setSelectedMatch(null);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!currentUser) {
      setFormError('Please sign in to place a wager.');
      return;
    }
    if (!matchTitle) {
      setFormError('A match title is mandatory.');
      return;
    }
    if (currentUser.coins < matchWager) {
      setFormError(`Insufficient balance. You need ${matchWager} coins to open this wager.`);
      return;
    }

    setFormLoading(true);
    try {
      const newMatch = await createMatch(matchTitle, matchGame, matchWager, matchPlayers, matchIsPublic);
      setFormSuccess('Wager match created successfully! Opponent slot is now open.');
      setMatchTitle('');
      
      // Auto open details of new match
      handleOpenDetails(newMatch);
    } catch (err) {
      setFormError(err.message || 'Failed to create wager match.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleJoinClick = async (matchId) => {
    if (!currentUser) {
      alert('Please sign in to join a wager.');
      return;
    }
    setActionLoading(true);
    try {
      await joinMatch(matchId);
      alert('You have successfully entered the wager arena! Lock and load.');
      handleCloseDetails();
    } catch (err) {
      alert(err.message || 'Failed to join match.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSettleWinner = async (matchId, winnerId) => {
    if (!confirm('Are you sure you want to declare this winner and distribute the coin pool?')) return;
    setActionLoading(true);
    try {
      await declareWinner(matchId, winnerId);
      alert('Match settled! Coins have been distributed to the winner.');
      handleCloseDetails();
    } catch (err) {
      alert(err.message || 'Failed to settle match.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter Match list logic
  const filteredMatches = matches.filter((m) => {
    const matchesGame = filterGame === 'all' || m.gameId === filterGame;
    
    let matchesWager = true;
    if (filterWager === 'low') matchesWager = m.wager <= 50;
    else if (filterWager === 'mid') matchesWager = m.wager > 50 && m.wager <= 200;
    else if (filterWager === 'high') matchesWager = m.wager > 200;

    const matchesStatus = m.status === activeTab;

    return matchesGame && matchesWager && matchesStatus;
  });

  return (
    <div className="container" style={styles.arenaContainer}>
      <div style={styles.ambientGlow}></div>

      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <span className="neon-tag neon-tag-blue">🏆 Competitive Lobbies</span>
          <h1 style={styles.title}>WAGER ARENA</h1>
        </div>
        {currentUser && (
          <div className="glass-panel" style={styles.balanceCard}>
            <span style={styles.balText} className="technical-label">Gamer Balance</span>
            <span style={styles.balVal}>🪙 {currentUser.coins.toLocaleString()} Coins</span>
          </div>
        )}
      </div>

      <div style={styles.mainGrid} className="arena-grid">
        {/* LEFT COLUMN: FILTERS AND CREATE WAGER */}
        <div style={styles.leftCol} className="arena-left">
          {/* Filters Card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>FILTER LOBBIES</h3>
            <div style={styles.filterGroup}>
              <label style={styles.label}>Select Arena Game</label>
              <select 
                value={filterGame} 
                onChange={(e) => setFilterGame(e.target.value)}
                style={styles.select}
              >
                <option value="all">🎮 All Featured Games</option>
                {games.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.label}>Wager Size (Coins)</label>
              <select 
                value={filterWager} 
                onChange={(e) => setFilterWager(e.target.value)}
                style={styles.select}
              >
                <option value="all">💎 Any Wager Size</option>
                <option value="low">🪙 0 - 50 Coins</option>
                <option value="mid">🪙 51 - 200 Coins</option>
                <option value="high">🪙 201+ Coins</option>
              </select>
            </div>
          </div>

          {/* Create Match Card */}
          <div className="glass-card" id="match-builder-card" style={styles.card}>
            <h3 style={styles.cardTitle}>CREATE NEW WAGER</h3>
            {formError && <div className="neon-tag-magenta" style={styles.error}>{formError}</div>}
            {formSuccess && <div className="neon-tag-blue" style={styles.success}>{formSuccess}</div>}

            <form onSubmit={handleCreateSubmit} style={styles.form}>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Match Title / Rules</label>
                <input 
                  type="text" 
                  className="neon-input" 
                  placeholder="e.g. Warzone 1v1 Snipers Only"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value)}
                  disabled={formLoading}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.label}>Game Arena</label>
                <select 
                  value={matchGame} 
                  onChange={(e) => setMatchGame(e.target.value)}
                  style={styles.select}
                  disabled={formLoading}
                >
                  {games.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.filterGroup, flex: 1 }}>
                  <label style={styles.label}>Wager (Coins)</label>
                  <input 
                    type="number" 
                    className="neon-input"
                    value={matchWager}
                    onChange={(e) => setMatchWager(Math.max(10, parseInt(e.target.value) || 0))}
                    disabled={formLoading}
                  />
                </div>
                <div style={{ ...styles.filterGroup, flex: 1 }}>
                  <label style={styles.label}>Max Players</label>
                  <select 
                    value={matchPlayers} 
                    onChange={(e) => setMatchPlayers(parseInt(e.target.value))}
                    style={styles.select}
                    disabled={formLoading}
                  >
                    <option value={2}>2 Players (1v1)</option>
                    <option value={4}>4 Players (2v2)</option>
                    <option value={10}>10 Players (5v5)</option>
                  </select>
                </div>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.label}>Room Visibility</label>
                <select 
                  value={matchIsPublic ? 'true' : 'false'} 
                  onChange={(e) => setMatchIsPublic(e.target.value === 'true')}
                  style={styles.select}
                  disabled={formLoading}
                >
                  <option value="true">🔓 Public Lobby (Members only to enter)</option>
                  <option value="false">🔒 Private Lobby (Open to everyone via direct invite)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={formLoading}>
                {formLoading ? 'Locking Wager...' : '🚀 Place Wager Deposit'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: TABS AND MATCH LOBBY BOARD */}
        <div style={styles.rightCol} className="arena-right">
          {/* Lobbies Tabs */}
          <div style={styles.tabsHeader} className="glass-panel">
            <button 
              onClick={() => setActiveTab('open')} 
              style={{ 
                ...styles.tabBtn, 
                color: activeTab === 'open' ? 'var(--accent-gold)' : '#718096',
                borderBottomColor: activeTab === 'open' ? 'var(--primary-gold)' : 'transparent'
              }}
            >
              🟢 Open Rooms
            </button>
            <button 
              onClick={() => setActiveTab('active')} 
              style={{ 
                ...styles.tabBtn, 
                color: activeTab === 'active' ? 'var(--neon-amber)' : '#718096',
                borderBottomColor: activeTab === 'active' ? 'var(--neon-amber)' : 'transparent'
              }}
            >
              ⚔️ Active Battles
            </button>
            <button 
              onClick={() => setActiveTab('completed')} 
              style={{ 
                ...styles.tabBtn, 
                color: activeTab === 'completed' ? 'var(--accent-gold)' : '#718096',
                borderBottomColor: activeTab === 'completed' ? 'var(--primary-gold)' : 'transparent'
              }}
            >
              🏁 Settled History
            </button>
          </div>

          {/* Lobby List */}
          <div style={styles.lobbyList}>
            {filteredMatches.length === 0 ? (
              <div className="glass-card" style={styles.emptyState}>
                <span>👾</span>
                <h3>No Wager Lobbies Found</h3>
                <p>Try resetting filters or create a new custom wager room!</p>
              </div>
            ) : (
              filteredMatches.map((m) => {
                const isLocked = m.isPublic && !currentUser?.isMember;
                return (
                  <div 
                    key={m.id} 
                    style={styles.matchRow} 
                    className="glass-card hover-row responsive-match-row" 
                    onClick={() => handleOpenDetails(m)}
                  >
                    <div style={styles.rowInfo}>
                      <div style={styles.badgeRow}>
                        <span style={styles.rowGame}>{m.gameName}</span>
                        {m.isPublic ? (
                          <span className="neon-tag neon-tag-blue" style={styles.miniTag}>Public</span>
                        ) : (
                          <span className="neon-tag neon-tag-cyan" style={styles.miniTag}>Private</span>
                        )}
                        {isLocked && (
                          <span style={styles.lockBadge}>🔒 LOCKED</span>
                        )}
                      </div>
                      <h4 style={styles.rowTitle}>
                        {m.title}
                      </h4>
                      <div style={styles.rowTags}>
                        <span style={styles.tag}>Host: @{m.hostName}</span>
                        <span style={styles.tag}>Room: {m.playersJoined.length}/{m.playersMax}</span>
                      </div>
                    </div>

                    <div style={styles.rowActionSection} className="responsive-row-action">
                      <div style={styles.wagerBadge}>
                        <span style={styles.wagerVal}>🪙 {m.wager}</span>
                        <span style={styles.wagerLabel}>WAGER</span>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={{
                          ...styles.rowBtn,
                          borderColor: isLocked ? 'rgba(255, 75, 75, 0.4)' : 'var(--glass-border)',
                          color: isLocked ? '#ff4b4b' : 'var(--foreground)'
                        }}
                      >
                        {isLocked ? 'Locked' : 'Lobby'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 6. DETAIL MODAL DIALOG */}
      <dialog 
        ref={dialogRef} 
        closedby="any" 
        aria-labelledby="dialog-title" 
        className={selectedMatch ? 'open' : ''}
        style={styles.dialog}
      >
        {selectedMatch && (
          <div>
            <div style={styles.modalHeader}>
              <span className="neon-tag neon-tag-blue">{selectedMatch.gameName}</span>
              <button onClick={handleCloseDetails} style={styles.closeBtn}>✕</button>
            </div>
            
            <h2 id="dialog-title" style={styles.modalTitle}>{selectedMatch.title}</h2>
            <p style={styles.modalMeta}>Hosted by: <strong>@{selectedMatch.hostName}</strong> • {selectedMatch.isPublic ? 'Public Wager' : 'Private Wager'}</p>

            <div style={styles.modalWagerPanel}>
              <div style={styles.modalMetric}>
                <span style={styles.metricBig}>🪙 {selectedMatch.wager} Coins</span>
                <span style={styles.metricSub}>Entry Wager Fee</span>
              </div>
              <div style={styles.modalMetric}>
                <span style={{ ...styles.metricBig, color: 'var(--accent-gold)' }}>
                  🪙 {selectedMatch.wager * selectedMatch.playersJoined.length} Coins
                </span>
                <span style={styles.metricSub}>&ldquo;Winner Takes All&rdquo; Pool</span>
              </div>
            </div>

            {/* Players Joined console */}
            <div style={styles.playersBox}>
              <h4 style={styles.modalSectionTitle}>Players in Lobby ({selectedMatch.playersJoined.length}/{selectedMatch.playersMax})</h4>
              <div style={styles.playersList}>
                {selectedMatch.playersJoined.map((pId, idx) => {
                  const pUser = selectedMatch.playersJoinedName?.[idx] || (idx === 0 ? selectedMatch.hostName : 'Competitor');
                  return (
                    <div key={pId} style={styles.playerTag}>
                      <span style={styles.playerAvatar}>🎮</span>
                      <span>@{pUser} (Ready)</span>
                    </div>
                  );
                })}
                {selectedMatch.playersJoined.length < selectedMatch.playersMax && (
                  <div style={{ ...styles.playerTag, borderStyle: 'dashed', background: 'transparent' }}>
                    <span style={{ ...styles.playerAvatar, filter: 'grayscale(1)' }}>➕</span>
                    <span style={{ color: '#718096' }}>Waiting for Opponent...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown timer mockup */}
            {selectedMatch.status === 'active' && (
              <div style={styles.timerPanel}>
                <span style={styles.timerIcon}>⏳</span>
                <div>
                  <h4 style={styles.timerTitle}>MATCH IN PROGRESS</h4>
                  <p style={styles.timerDesc}>Gamer lobby active. Submit platform victory logs when complete.</p>
                </div>
              </div>
            )}

            {/* Winner Settler (Test Mode only) */}
            {selectedMatch.status === 'active' && (
              <div style={styles.settleBox} className="glass-card">
                <h4 style={styles.settleTitle}>🛠️ TEST SUITE: DECLARE WINNER</h4>
                <p style={styles.settleDesc}>Simulate console API match victory logs. Pick the winner to allocate coins immediately:</p>
                <div style={styles.settleButtons}>
                  {selectedMatch.playersJoined.map((pId, idx) => {
                    const pUser = idx === 0 ? selectedMatch.hostName : 'Competitor';
                    return (
                      <button 
                        key={pId} 
                        onClick={() => handleSettleWinner(selectedMatch.id, pId)}
                        className="btn btn-outline-neon"
                        style={styles.settleBtn}
                        disabled={actionLoading}
                      >
                        🏆 @{pUser} Wins
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedMatch.status === 'completed' && (
              <div style={styles.winnerAnnounce} className="neon-tag-cyan">
                🎉 Match Settled! Winner: <strong>@{selectedMatch.winnerName}</strong> takes the pool of <strong>🪙 {selectedMatch.wager * selectedMatch.playersJoined.length} coins</strong>!
              </div>
            )}

            {/* Primary Action Button */}
            <div style={styles.modalActions}>
              {selectedMatch.status === 'open' && (
                !selectedMatch.playersJoined.includes(currentUser?.id) ? (
                  <button 
                    onClick={() => handleJoinClick(selectedMatch.id)}
                    className="btn btn-primary"
                    style={styles.modalPrimaryBtn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Joining Room...' : `🎮 Join Match & Wager 🪙 ${selectedMatch.wager}`}
                  </button>
                ) : (
                  <div style={styles.waitingNotice}>
                    You are in this room. Waiting for an opponent to deposit wager...
                  </div>
                )
              )}
              <button onClick={handleCloseDetails} className="btn btn-secondary" style={styles.modalCloseBtn}>
                Back to Arena
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* MEMBERSHIP LOCKOUT WARNING MODAL */}
      {showLockoutModal && (
        <div style={styles.lockoutOverlay}>
          <div style={styles.lockoutCard} className="glass-panel">
            <span style={styles.lockoutIcon}>🔒</span>
            <h2 style={styles.lockoutTitle}>MEMBERSHIP REQUIRED</h2>
            <p style={styles.lockoutDesc}>
              Public wager rooms are locked behind the **VERSA Elite Pro** membership to guarantee fair play and verified gamer logs.
            </p>
            <div style={styles.lockoutTips} className="glass-card">
              <p>💡 <em>Private wagers remain free and accessible to all registered users!</em></p>
            </div>
            <div style={styles.lockoutBtns}>
              <Link href="/membership" onClick={() => setShowLockoutModal(false)} className="btn btn-primary" style={styles.lockoutUpgradeBtn}>
                💎 Unlock Lobbies Now
              </Link>
              <button onClick={() => setShowLockoutModal(false)} className="btn btn-secondary" style={styles.lockoutCloseBtn}>
                Back to Arena
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .pulse-glow {
          box-shadow: 0 0 30px var(--primary-gold) !important;
          border-color: var(--primary-gold) !important;
        }
        .hover-row {
          cursor: pointer;
        }
        .hover-row:hover {
          background: rgba(212, 175, 55, 0.03) !important;
          border-color: rgba(212, 175, 55, 0.3) !important;
        }
        @media (max-width: 960px) {
          .arena-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 600px) {
          .responsive-match-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem !important;
          }
          .responsive-row-action {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
}

// Suspense Boundary Wrapper for searchParams
export default function WagerArena() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h3>Loading competitive wager lobbies...</h3>
      </div>
    }>
      <WagerArenaContent />
    </Suspense>
  );
}

const styles = {
  arenaContainer: {
    padding: '3rem 1.5rem 5rem 1.5rem',
    position: 'relative'
  },
  ambientGlow: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '900px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, rgba(5, 5, 5, 0) 70%)',
    pointerEvents: 'none',
    zIndex: -1
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginTop: '0.5rem'
  },
  balanceCard: {
    padding: '0.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    borderImage: 'none',
    borderRadius: '8px'
  },
  balText: {
    fontSize: '0.7rem'
  },
  balVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--accent-gold)'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '0.85fr 1.15fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  card: {
    background: 'rgba(19, 19, 19, 0.3)'
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.25rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#a0aec0'
  },
  select: {
    width: '100%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    borderRadius: '6px',
    padding: '0.85rem',
    color: 'var(--foreground)',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    marginTop: '1rem',
    padding: '0.85rem'
  },
  error: {
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  success: {
    padding: '0.75rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  tabsHeader: {
    display: 'flex',
    padding: '0.25rem',
    gap: '0.25rem',
    borderImage: 'none',
    borderRadius: '6px'
  },
  tabBtn: {
    flex: 1,
    padding: '1rem',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'var(--transition-snappy)'
  },
  lobbyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  emptyState: {
    padding: '4rem 2rem',
    textAlign: 'center',
    background: 'rgba(19, 19, 19, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    transform: 'none',
    boxShadow: 'none'
  },
  matchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 2rem',
    background: 'rgba(19, 19, 19, 0.35)',
    borderRadius: '8px'
  },
  rowInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  miniTag: {
    padding: '0.1rem 0.4rem',
    fontSize: '0.6rem'
  },
  lockBadge: {
    fontSize: '0.65rem',
    fontWeight: 'bold',
    color: '#ff4b4b',
    background: 'rgba(255, 75, 75, 0.1)',
    padding: '0.1rem 0.4rem',
    borderRadius: '2px',
    border: '1px solid rgba(255, 75, 75, 0.3)'
  },
  rowGame: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--accent-gold)',
    textTransform: 'uppercase'
  },
  rowTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#fff'
  },
  rowTags: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#cbd5e0'
  },
  tag: {
    fontFamily: 'var(--font-mono)'
  },
  rowActionSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  wagerBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  wagerVal: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: 'var(--accent-gold)'
  },
  wagerLabel: {
    fontSize: '0.65rem',
    color: '#a0aec0',
    fontWeight: '700'
  },
  rowBtn: {
    borderRadius: '4px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem'
  },
  dialog: {
    maxWidth: '540px'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#718096',
    fontSize: '1.25rem',
    cursor: 'pointer',
    transition: 'var(--transition-snappy)'
  },
  modalTitle: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: '#fff',
    marginBottom: '0.25rem'
  },
  modalMeta: {
    fontSize: '0.9rem',
    color: '#a0aec0',
    marginBottom: '1.5rem'
  },
  modalWagerPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(212, 175, 55, 0.15)'
  },
  modalMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  metricBig: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: 'var(--accent-gold)'
  },
  metricSub: {
    fontSize: '0.75rem',
    color: '#a0aec0',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  playersBox: {
    marginBottom: '1.5rem'
  },
  modalSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#cbd5e0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem'
  },
  playersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  playerTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem'
  },
  playerAvatar: {
    fontSize: '1.2rem',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '0.25rem',
    borderRadius: '4px'
  },
  timerPanel: {
    display: 'flex',
    gap: '1rem',
    background: 'rgba(255, 198, 64, 0.04)',
    border: '1px solid rgba(255, 198, 64, 0.15)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  timerIcon: {
    fontSize: '1.5rem'
  },
  timerTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'var(--neon-amber)',
    textShadow: 'var(--amber-glow)'
  },
  timerDesc: {
    fontSize: '0.8rem',
    color: '#cbd5e0'
  },
  settleBox: {
    padding: '1.25rem',
    background: 'rgba(14, 14, 14, 0.95)',
    border: '1px solid var(--primary-gold)',
    boxShadow: 'var(--gold-glow)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    transform: 'none'
  },
  settleTitle: {
    fontSize: '0.9rem',
    fontWeight: '900',
    color: 'var(--accent-gold)',
    marginBottom: '0.5rem'
  },
  settleDesc: {
    fontSize: '0.8rem',
    color: '#cbd5e0',
    marginBottom: '1rem',
    lineHeight: '1.4'
  },
  settleButtons: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%'
  },
  settleBtn: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '0.85rem'
  },
  winnerAnnounce: {
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.2)'
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem'
  },
  modalPrimaryBtn: {
    width: '100%',
    padding: '0.85rem'
  },
  modalCloseBtn: {
    width: '100%',
    padding: '0.85rem'
  },
  waitingNotice: {
    textAlign: 'center',
    padding: '0.75rem',
    fontSize: '0.85rem',
    color: 'var(--accent-gold)',
    background: 'rgba(212, 175, 55, 0.06)',
    borderRadius: '6px',
    border: '1px dashed rgba(212, 175, 55, 0.3)'
  },
  // Lockout Modal
  lockoutOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 5, 5, 0.9)',
    backdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  lockoutCard: {
    maxWidth: '460px',
    width: '100%',
    padding: '2.5rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem'
  },
  lockoutIcon: {
    fontSize: '3.5rem'
  },
  lockoutTitle: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: 'var(--accent-gold)',
    letterSpacing: '0.05em'
  },
  lockoutDesc: {
    fontSize: '0.95rem',
    color: '#cbd5e0',
    lineHeight: '1.6'
  },
  lockoutTips: {
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    color: '#a0aec0',
    width: '100%',
    background: 'rgba(212, 175, 55, 0.02)'
  },
  lockoutBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    marginTop: '0.5rem'
  },
  lockoutUpgradeBtn: {
    width: '100%',
    padding: '0.85rem'
  },
  lockoutCloseBtn: {
    width: '100%',
    padding: '0.85rem'
  }
};
