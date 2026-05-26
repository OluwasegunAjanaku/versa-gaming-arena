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
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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

  // Fallback backdrop click handler for browsers not supporting closedby="any" natively
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
      const newMatch = await createMatch(matchTitle, matchGame, matchWager, matchPlayers);
      setFormSuccess('Wager match created successfully! Opponent slot is now open.');
      setMatchTitle('');
      // Open details of the new match
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
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <span className="neon-tag neon-tag-blue">🏆 Esports Arena</span>
          <h1 style={styles.title}>COMPETITIVE WAGER LOBBIES</h1>
        </div>
        {currentUser && (
          <div className="glass-card" style={styles.balanceCard}>
            <span style={styles.balText}>Gamer Balance:</span>
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
            {formSuccess && <div className="neon-tag-cyan" style={styles.success}>{formSuccess}</div>}

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
                color: activeTab === 'open' ? 'var(--accent-blue)' : '#718096',
                borderBottomColor: activeTab === 'open' ? 'var(--accent-blue)' : 'transparent'
              }}
            >
              🟢 Open Rooms
            </button>
            <button 
              onClick={() => setActiveTab('active')} 
              style={{ 
                ...styles.tabBtn, 
                color: activeTab === 'active' ? 'var(--accent-magenta)' : '#718096',
                borderBottomColor: activeTab === 'active' ? 'var(--accent-magenta)' : 'transparent'
              }}
            >
              ⚔️ Active Battles
            </button>
            <button 
              onClick={() => setActiveTab('completed')} 
              style={{ 
                ...styles.tabBtn, 
                color: activeTab === 'completed' ? 'var(--accent-cyan)' : '#718096',
                borderBottomColor: activeTab === 'completed' ? 'var(--accent-cyan)' : 'transparent'
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
              filteredMatches.map((m) => (
                <div key={m.id} style={styles.matchRow} className="glass-card hover-row responsive-match-row" onClick={() => handleOpenDetails(m)}>
                  <div style={styles.rowInfo}>
                    <span style={styles.rowGame}>{m.gameName}</span>
                    <h4 style={styles.rowTitle}>{m.title}</h4>
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
                    <button className="btn btn-secondary" style={styles.rowBtn}>
                      Lobby
                    </button>
                  </div>
                </div>
              ))
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
            <p style={styles.modalMeta}>Hosted by: <strong>@{selectedMatch.hostName}</strong></p>

            <div style={styles.modalWagerPanel}>
              <div style={styles.modalMetric}>
                <span style={styles.metricBig}>🪙 {selectedMatch.wager} Coins</span>
                <span style={styles.metricSub}>Entry Wager Fee</span>
              </div>
              <div style={styles.modalMetric}>
                <span style={{ ...styles.metricBig, color: 'var(--accent-cyan)' }}>
                  🪙 {selectedMatch.wager * selectedMatch.playersJoined.length} Coins
                </span>
                <span style={styles.metricSub}>&ldquo;Winner Takes All&rdquo; Pool</span>
              </div>
            </div>

            {/* Players Joined console */}
            <div style={styles.playersBox}>
              <h4 style={styles.modalSectionTitle}>Players in Lobby ({selectedMatch.playersJoined.length}/{selectedMatch.playersMax})</h4>
              <div style={styles.playersList}>
                {selectedMatch.playersJoined.map((pId, idx) => (
                  <div key={pId} style={styles.playerTag}>
                    <span style={styles.playerAvatar}>🎮</span>
                    <span>Player {idx + 1} Slot Locked</span>
                  </div>
                ))}
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
                  <p style={styles.timerDesc}>Timer countdown: 45m remaining to submit score logs.</p>
                </div>
              </div>
            )}

            {/* Winner Settler (Test Mode only) */}
            {selectedMatch.status === 'active' && (
              <div style={styles.settleBox} className="glass-card">
                <h4 style={styles.settleTitle}>🛠️ TEST SUITE: SETTLE MATCH</h4>
                <p style={styles.settleDesc}>Simulate console API match victory logs. Pick the winner to allocate coins immediately:</p>
                <div style={styles.settleButtons}>
                  {selectedMatch.playersJoined.map((pId, idx) => (
                    <button 
                      key={pId} 
                      onClick={() => handleSettleWinner(selectedMatch.id, pId)}
                      className="btn btn-outline-neon"
                      style={styles.settleBtn}
                      disabled={actionLoading}
                    >
                      🏆 Player {idx + 1} Wins
                    </button>
                  ))}
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

      <style jsx global>{`
        .pulse-glow {
          box-shadow: 0 0 30px var(--accent-blue) !important;
          border-color: var(--accent-blue) !important;
        }
        .hover-row {
          cursor: pointer;
        }
        .hover-row:hover {
          background: rgba(10, 132, 255, 0.04) !important;
          border-color: rgba(10, 132, 255, 0.3) !important;
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
    padding: '3rem 1.5rem 5rem 1.5rem'
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
    fontSize: '2.25rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginTop: '0.5rem'
  },
  balanceCard: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255, 215, 0, 0.05)',
    border: '1px solid rgba(255, 215, 0, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    boxShadow: 'none',
    transform: 'none'
  },
  balText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#718096',
    textTransform: 'uppercase'
  },
  balVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#ffd700'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.2fr',
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
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
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
    padding: '0.85rem',
    borderRadius: '8px'
  },
  error: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1rem'
  },
  success: {
    padding: '0.75rem',
    borderRadius: '6px',
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
    gap: '0.25rem'
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
    background: 'rgba(10, 13, 20, 0.25)',
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
    background: 'rgba(10, 13, 20, 0.3)',
    borderRadius: '12px'
  },
  rowInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  rowGame: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--accent-blue)',
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
    color: '#718096'
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
    color: '#ffd700'
  },
  wagerLabel: {
    fontSize: '0.65rem',
    color: '#718096',
    fontWeight: '700'
  },
  rowBtn: {
    borderRadius: '20px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem'
  },
  // Dialog modal styles
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
    color: '#718096',
    marginBottom: '1.5rem'
  },
  modalWagerPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.04)'
  },
  modalMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  metricBig: {
    fontSize: '1.35rem',
    fontWeight: '900',
    color: '#ffd700'
  },
  metricSub: {
    fontSize: '0.75rem',
    color: '#718096',
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  playersBox: {
    marginBottom: '1.5rem'
  },
  modalSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#a0aec0',
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
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem'
  },
  playerAvatar: {
    fontSize: '1.2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '0.25rem',
    borderRadius: '6px'
  },
  timerPanel: {
    display: 'flex',
    gap: '1rem',
    background: 'rgba(255, 0, 127, 0.04)',
    border: '1px solid rgba(255, 0, 127, 0.15)',
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '1.5rem'
  },
  timerIcon: {
    fontSize: '1.5rem'
  },
  timerTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'var(--accent-magenta)',
    textShadow: 'var(--pink-glow)'
  },
  timerDesc: {
    fontSize: '0.8rem',
    color: '#cbd5e0'
  },
  settleBox: {
    padding: '1.25rem',
    background: 'rgba(10, 12, 18, 0.9)',
    border: '1.5px dashed var(--accent-cyan)',
    boxShadow: 'var(--cyan-glow)',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    transform: 'none'
  },
  settleTitle: {
    fontSize: '0.9rem',
    fontWeight: '900',
    color: 'var(--accent-cyan)',
    marginBottom: '0.5rem'
  },
  settleDesc: {
    fontSize: '0.8rem',
    color: '#a0aec0',
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
    borderRadius: '8px',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem'
  },
  modalPrimaryBtn: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  modalCloseBtn: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  waitingNotice: {
    textAlign: 'center',
    padding: '0.75rem',
    fontSize: '0.85rem',
    color: 'var(--accent-blue)',
    background: 'rgba(10, 132, 255, 0.08)',
    borderRadius: '8px',
    border: '1.5px dashed rgba(10, 132, 255, 0.3)'
  }
};
