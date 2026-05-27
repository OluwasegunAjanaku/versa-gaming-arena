'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';

export default function AdminPage() {
  const { 
    currentUser, 
    allUsers, 
    matches, 
    addCoins, 
    declareWinner 
  } = useFirebase();

  // Minting simulator states
  const [selectedUserId, setSelectedUserId] = useState(allUsers[0]?.id || '');
  const [mintAmount, setMintAmount] = useState(1000);
  const [mintLabel, setMintLabel] = useState('Admin Bonus Credit');
  
  // Wager solving state
  const [selectedMatchWinnerId, setSelectedMatchWinnerId] = useState('');

  // Mock Store management state
  const [storeItems, setStoreItems] = useState([
    { id: 's1', name: '$10 PlayStation Gift Card', cost: 1000, stock: 15, category: 'Vouchers' },
    { id: 's2', name: 'Fortnite 5,000 V-Bucks Bundle', cost: 2500, stock: 8, category: 'In-Game Currency' },
    { id: 's3', name: 'SteelSeries Apex Gaming Mouse', cost: 6500, stock: 4, category: 'Hardware' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState(500);

  const handleMintCoins = (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert('Please select a player to credit.');
      return;
    }
    addCoins(selectedUserId, mintAmount, mintLabel);
    
    const user = allUsers.find(u => u.id === selectedUserId);
    alert(`Success! Credited 🪙 ${mintAmount} coins to @${user ? user.username : 'Gamer'} for "${mintLabel}".`);
  };

  const handleSolveWager = async (matchId, winnerId) => {
    if (!winnerId) {
      alert('Please select a valid player to declare as winner.');
      return;
    }
    if (!confirm('Resolve this match immediately and pay out the coin pool?')) return;
    try {
      await declareWinner(matchId, winnerId);
      alert('Match successfully solved and coin pool distributed.');
    } catch (err) {
      alert(err.message || 'Failed to solve match.');
    }
  };

  const handleAddStoreItem = (e) => {
    e.preventDefault();
    if (!newItemName) return;

    const newItem = {
      id: 's_' + Math.random().toString(36).substr(2, 9),
      name: newItemName,
      cost: newItemCost,
      stock: 10,
      category: 'Curated Item'
    };

    setStoreItems([...storeItems, newItem]);
    setNewItemName('');
    setNewItemCost(500);
    alert(`Store catalog updated! Added: ${newItem.name}`);
  };

  const activeMatches = matches.filter(m => m.status === 'open' || m.status === 'active');
  const completedMatches = matches.filter(m => m.status === 'completed');

  return (
    <div className="container" style={styles.adminContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-magenta">🔐 Private Administrative Panel</span>
        <h1 style={styles.title}>VERSA CONTROL DECK</h1>
      </div>

      <div style={styles.grid} className="admin-grid">
        {/* LEFT COLUMN: USER MANAGEMENT & VAULT MINTING */}
        <div style={styles.leftCol} className="admin-left">
          {/* Minting Vault */}
          <div className="glass-card" style={styles.balanceCard}>
            <div style={styles.balanceHeader}>
              <span>COIN VAULT CONTROLLER</span>
              <span className="neon-tag neon-tag-blue" style={{ fontSize: '0.65rem' }}>MINT MASTER</span>
            </div>
            
            <form onSubmit={handleMintCoins} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Select Target Gamer</label>
                <select 
                  value={selectedUserId} 
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={styles.select}
                >
                  <option value="">-- Choose Roster --</option>
                  {allUsers.map(u => (
                    <option key={u.id} value={u.id}>@{u.username} (Balance: 🪙 {u.coins})</option>
                  ))}
                </select>
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.inputGroup, flex: 1 }}>
                  <label style={styles.label}>Mint Quantity (Coins)</label>
                  <input 
                    type="number" 
                    className="neon-input"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div style={{ ...styles.inputGroup, flex: 1.5 }}>
                  <label style={styles.label}>Ledger Description Tag</label>
                  <input 
                    type="text" 
                    className="neon-input"
                    value={mintLabel}
                    onChange={(e) => setMintLabel(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                💎 Mint & Credit Wallet
              </button>
            </form>
          </div>

          {/* User Directory */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>REGISTERED GAMERS DIRECTORY</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Username</th>
                    <th style={styles.th}>Connections</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>W/L Stats</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => (
                    <tr key={u.id} style={styles.trRow}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: '700', color: '#fff' }}>@{u.username}</div>
                        <span style={{ fontSize: '0.75rem', color: '#718096' }}>{u.email}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.badgeCol}>
                          {u.psn && <span style={styles.miniBadge} className="neon-tag-blue">PSN</span>}
                          {u.steam && <span style={styles.miniBadge} className="neon-tag-cyan">Steam</span>}
                          {u.xbox && <span style={styles.miniBadge} className="neon-tag-magenta">Xbox</span>}
                          {u.github && <span style={{ ...styles.miniBadge, borderColor: '#24292e', color: '#e6edf3' }}>GitHub</span>}
                          {!u.psn && !u.steam && !u.xbox && !u.github && <span style={{ color: '#4a5568', fontSize: '0.75rem' }}>None</span>}
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                        {u.wins}W - {u.losses}L
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '800', color: '#ffd700' }}>
                        🪙 {u.coins.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE WAGER DEBTS & STORE LOGISTICS */}
        <div style={styles.rightCol} className="admin-right">
          {/* Active Wagers solved console */}
          <div className="glass-panel" style={styles.wagerPanelCard}>
            <h3 style={styles.cardTitle}>SYSTEM WAGER RESOLVER</h3>
            <p style={styles.cardDesc}>Solve dispute claims immediately by manually forcing winner settlements:</p>
            
            <div style={styles.wagerSolveList}>
              {activeMatches.length === 0 ? (
                <div style={styles.emptyWagers}>No active or open wager matches currently require resolver attention.</div>
              ) : (
                activeMatches.map((m) => (
                  <div key={m.id} style={styles.wagerRow} className="glass-card">
                    <div>
                      <h4 style={styles.wagerRowTitle}>{m.title}</h4>
                      <span style={styles.wagerRowMeta}>
                        Arena: {m.gameName} • Pool: 🪙 {m.wager * m.playersJoined.length} coins ({m.playersJoined.length}/{m.playersMax})
                      </span>
                    </div>

                    {m.status === 'active' ? (
                      <div style={styles.solverForm}>
                        <select 
                          onChange={(e) => setSelectedMatchWinnerId(e.target.value)}
                          style={styles.solverSelect}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Winner</option>
                          {m.playersJoined.map((pId) => {
                            const player = allUsers.find(u => u.id === pId);
                            return (
                              <option key={pId} value={pId}>@{player ? player.username : 'Opponent'}</option>
                            );
                          })}
                        </select>
                        <button 
                          onClick={() => handleSolveWager(m.id, selectedMatchWinnerId)}
                          className="btn btn-outline-neon"
                          style={styles.solverBtn}
                        >
                          Settle
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.8rem' }}>
                        LOBBY FILLING...
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Store items management */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>MOCK COIN STORE CATALOG</h3>
            <p style={styles.cardDesc}>Manage available reward items that players can purchase with coins.</p>
            
            <div style={styles.storeList}>
              {storeItems.map((item) => (
                <div key={item.id} style={styles.storeItemRow} className="glass-panel">
                  <div>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <span style={styles.itemCategory}>{item.category} • Stock: {item.stock}</span>
                  </div>
                  <span style={styles.itemCost}>🪙 {item.cost.toLocaleString()} Coins</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddStoreItem} style={styles.storeForm}>
              <h4 style={{ ...styles.cardTitle, fontSize: '0.95rem', marginTop: '1.5rem' }}>ADD NEW STORE ITEM</h4>
              <div style={styles.storeFormRow}>
                <input 
                  type="text" 
                  className="neon-input" 
                  style={{ flex: 2 }}
                  placeholder="e.g. Redragon Keyboard"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <input 
                  type="number" 
                  className="neon-input" 
                  style={{ flex: 1 }}
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(parseInt(e.target.value) || 0)}
                />
                <button type="submit" className="btn btn-outline-neon">
                  ➕ Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  adminContainer: {
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
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  balanceCard: {
    background: 'radial-gradient(ellipse at bottom left, rgba(212, 175, 55, 0.08) 0%, rgba(19, 19, 19, 0.6) 80%)',
    border: '1px solid rgba(212, 175, 55, 0.25)',
    padding: '2.25rem',
    boxShadow: 'var(--gold-glow)'
  },
  balanceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#718096',
    letterSpacing: '0.1em',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem'
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
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  card: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1.25rem'
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '1.5rem'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thRow: {
    borderBottom: '1.5px solid rgba(255, 255, 255, 0.06)'
  },
  th: {
    padding: '0.75rem 0.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  trRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
  },
  td: {
    padding: '1rem 0.5rem',
    fontSize: '0.9rem',
    color: '#cbd5e0',
    verticalAlign: 'middle'
  },
  badgeCol: {
    display: 'flex',
    gap: '0.4rem'
  },
  miniBadge: {
    fontSize: '0.65rem',
    padding: '0.1rem 0.4rem',
    borderRadius: '3px',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  // Right Column styles
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  wagerPanelCard: {
    padding: '2rem 1.5rem'
  },
  wagerSolveList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem'
  },
  emptyWagers: {
    padding: '2rem',
    textAlign: 'center',
    color: '#718096',
    fontSize: '0.85rem'
  },
  wagerRow: {
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    boxShadow: 'none',
    transform: 'none',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  wagerRowTitle: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff'
  },
  wagerRowMeta: {
    fontSize: '0.75rem',
    color: '#718096',
    display: 'block',
    marginTop: '0.2rem'
  },
  solverForm: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  solverSelect: {
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '0.5rem',
    color: 'var(--foreground)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
  },
  solverBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    borderRadius: '6px'
  },
  storeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  storeItemRow: {
    padding: '0.85rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff'
  },
  itemCategory: {
    fontSize: '0.75rem',
    color: '#718096'
  },
  itemCost: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#ffd700'
  },
  storeForm: {
    marginTop: '1rem'
  },
  storeFormRow: {
    display: 'flex',
    gap: '0.75rem'
  }
};
