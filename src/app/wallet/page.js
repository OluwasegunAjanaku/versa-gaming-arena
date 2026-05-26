'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

export default function WalletPage() {
  const { currentUser, transactions, withdrawToBank, addCoins } = useFirebase();

  // Withdraw states
  const [routing, setRouting] = useState('');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState(200);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Deposit simulation states (for easy test-mode usage!)
  const [depositAmount, setDepositAmount] = useState(500);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in to process transactions.');
      return;
    }
    if (!routing || !account) {
      setErrorMsg('Routing and Account numbers are mandatory.');
      return;
    }
    if (routing.length !== 9) {
      setErrorMsg('Bank Routing number must be precisely 9 digits.');
      return;
    }
    if (account.length < 8 || account.length > 17) {
      setErrorMsg('Bank Account number must be between 8 and 17 digits.');
      return;
    }
    if (amount <= 0) {
      setErrorMsg('Withdrawal amount must be greater than zero.');
      return;
    }
    if (currentUser.coins < amount) {
      setErrorMsg(`Insufficient balance. You only have ${currentUser.coins} coins.`);
      return;
    }

    setLoading(true);
    try {
      await withdrawToBank({ routing, account }, amount);
      setSuccessMsg(`Stripe simulated bank transfer initiated! ${amount} coins have been successfully paid out to bank ending in *${account.slice(-4)}.`);
      setRouting('');
      setAccount('');
    } catch (err) {
      setErrorMsg(err.message || 'Withdrawal failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDepositCoinsSim = () => {
    if (!currentUser) {
      alert('Please sign in first.');
      return;
    }
    addCoins(currentUser.id, depositAmount, 'Stripe Deposit Simulator');
    alert(`Success! Credited 🪙 ${depositAmount} test coins to your account.`);
  };

  // Filter transactions for current authenticated user
  const userTransactions = transactions.filter(t => t.userId === currentUser?.id);

  return (
    <div className="container" style={styles.walletContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-magenta">💳 Coin Ledger</span>
        <h1 style={styles.title}>MY VERSA WALLET</h1>
      </div>

      <div style={styles.grid} className="wallet-grid">
        {/* LEFT COLUMN: BALANCE AND ACTIONS */}
        <div style={styles.leftCol} className="wallet-left">
          {/* Gold Balance Card */}
          <div className="glass-card" style={styles.balanceCard}>
            <div style={styles.balanceHeader}>
              <span>ACCOUNT COIN BALANCE</span>
              <span className="neon-tag neon-tag-cyan" style={{ fontSize: '0.65rem' }}>ACTIVE</span>
            </div>
            <div style={styles.balanceRow}>
              <span style={styles.goldCoin}>🪙</span>
              <div>
                <h2 style={styles.coinCount}>
                  {currentUser ? currentUser.coins.toLocaleString() : '0'}
                </h2>
                <span style={styles.usdVal}>
                  ≈ ${currentUser ? (currentUser.coins / 100).toFixed(2) : '0.00'} USD
                </span>
              </div>
            </div>
            <div style={styles.conversionLabel}>
              Guaranteed Value Rate: 100 Coins = $1.00 USD
            </div>
          </div>

          {/* Test Suite Deposit card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={{ ...styles.cardTitle, color: 'var(--accent-cyan)' }}>🛠️ TEST SUITE: DEPOSIT SIMULATOR</h3>
            <p style={styles.cardDesc}>Need test coins to create wagers or test payouts? Credit your mock bank balance instantly below:</p>
            
            <div style={styles.depositRow}>
              <select 
                value={depositAmount} 
                onChange={(e) => setDepositAmount(parseInt(e.target.value))}
                style={styles.select}
              >
                <option value={200}>🪙 +200 Coins ($2.00)</option>
                <option value={500}>🪙 +500 Coins ($5.00)</option>
                <option value={1000}>🪙 +1000 Coins ($10.00)</option>
                <option value={5000}>🪙 +5000 Coins ($50.00)</option>
              </select>
              <button onClick={handleDepositCoinsSim} className="btn btn-outline-neon" style={{ flexShrink: 0 }}>
                💳 Instant Add
              </button>
            </div>
          </div>

          {/* Withdraw to Bank card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>WITHDRAW TO BANK (STRIPE)</h3>
            {errorMsg && <div className="neon-tag-magenta" style={styles.error}>{errorMsg}</div>}
            {successMsg && <div className="neon-tag-cyan" style={styles.success}>{successMsg}</div>}

            <form onSubmit={handleWithdrawSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Bank Routing Number (9 Digits)</label>
                <input 
                  type="text" 
                  className="neon-input"
                  maxLength={9}
                  placeholder="e.g. 121000248"
                  value={routing}
                  onChange={(e) => setRouting(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Bank Account Number (8-17 Digits)</label>
                <input 
                  type="text" 
                  className="neon-input"
                  placeholder="e.g. 998877665"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.replace(/\D/g, ''))}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount to Cashout (Coins)</label>
                <input 
                  type="number" 
                  className="neon-input"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(10, parseInt(e.target.value) || 0))}
                  disabled={loading}
                />
                <span style={styles.calcText}>
                  Value: ${amount > 0 ? (amount / 100).toFixed(2) : '0.00'} USD
                </span>
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Stripe Processing...' : '💸 Initiate Bank Transfer'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: TRANSACTION LEDGER */}
        <div style={styles.rightCol} className="wallet-right">
          <div className="glass-panel" style={styles.ledgerCard}>
            <div style={styles.ledgerHeader}>
              <h3 style={styles.cardTitle}>TRANSACTION HISTORY</h3>
              <Link href="/rewards" style={styles.earnMoreBtn}>
                Earn More Coins ➡️
              </Link>
            </div>

            <div style={styles.tableWrapper}>
              {!currentUser ? (
                <div style={styles.emptyLedger}>
                  Please sign in to view your ledger.
                </div>
              ) : userTransactions.length === 0 ? (
                <div style={styles.emptyLedger}>
                  No transactions recorded on this gamer ID yet.
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Transaction Details</th>
                      <th style={styles.th}>Date</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userTransactions.map((tx) => (
                      <tr key={tx.id} style={styles.trRow}>
                        <td style={styles.td}>
                          <div style={styles.txType}>{tx.type}</div>
                          <span style={styles.txId}>ID: {tx.id}</span>
                        </td>
                        <td style={styles.td}>{tx.date}</td>
                        <td style={{ 
                          ...styles.td, 
                          textAlign: 'right', 
                          fontWeight: '800',
                          color: tx.amount > 0 ? 'var(--accent-cyan)' : 'var(--accent-magenta)' 
                        }}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 960px) {
          .wallet-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  walletContainer: {
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
  balanceCard: {
    background: 'radial-gradient(ellipse at bottom left, rgba(255, 215, 0, 0.12) 0%, rgba(13, 17, 23, 0.6) 80%)',
    border: '1px solid rgba(255, 215, 0, 0.25)',
    padding: '2.5rem',
    boxShadow: '0 8px 32px 0 rgba(255, 215, 0, 0.05)'
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
  balanceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  goldCoin: {
    fontSize: '3rem',
    animation: 'spin 5s linear infinite'
  },
  coinCount: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: '#ffd700',
    lineHeight: '1',
    textShadow: '0 0 15px rgba(255, 215, 0, 0.25)'
  },
  usdVal: {
    fontSize: '1.25rem',
    color: '#cbd5e0',
    fontWeight: '600'
  },
  conversionLabel: {
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1rem'
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
    marginBottom: '1.25rem'
  },
  depositRow: {
    display: 'flex',
    gap: '1rem'
  },
  select: {
    flex: 1,
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
  calcText: {
    fontSize: '0.8rem',
    color: 'var(--accent-cyan)',
    fontWeight: '700'
  },
  submitBtn: {
    padding: '0.85rem',
    borderRadius: '8px'
  },
  error: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem'
  },
  success: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem',
    lineHeight: '1.4'
  },
  rightCol: {},
  ledgerCard: {
    padding: '2.5rem 2rem'
  },
  ledgerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    paddingBottom: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  earnMoreBtn: {
    fontSize: '0.85rem',
    color: 'var(--accent-cyan)',
    fontWeight: '700'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  emptyLedger: {
    padding: '4rem 2rem',
    textAlign: 'center',
    color: '#718096',
    fontSize: '0.95rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thRow: {
    borderBottom: '1.5px solid rgba(255, 255, 255, 0.06)'
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  trRow: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    transition: 'var(--transition-snappy)'
  },
  td: {
    padding: '1.25rem 1rem',
    fontSize: '0.9rem',
    color: '#cbd5e0',
    verticalAlign: 'middle'
  },
  txType: {
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.2rem'
  },
  txId: {
    fontSize: '0.7rem',
    color: '#4a5568'
  }
};
