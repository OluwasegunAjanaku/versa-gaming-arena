'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

export default function MembershipPage() {
  const { currentUser, subscribeMembership, isLoading } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: 'VERSA Elite Pro', price: '$9.99' });

  const handleOpenCheckout = (planName, price) => {
    if (!currentUser) {
      alert('Please sign in or register a gamer tag first to subscribe.');
      return;
    }
    setSelectedPlan({ name: planName, price });
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      alert('Please enter simulated card details.');
      return;
    }
    setLoading(true);
    try {
      await subscribeMembership();
      setSuccess(true);
      setTimeout(() => {
        setShowCheckout(false);
        setSuccess(false);
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.heroGlow}></div>
        <div style={{ ...styles.content, width: '100%' }} className="container">
          <div style={styles.header}>
            <span className="neon-tag neon-tag-blue">VERSA Pass</span>
            <h1 style={styles.title}>ACCESS TIER DETAILS</h1>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', width: '100%', maxWidth: '460px', margin: '2rem auto' }}>
              <span style={{ fontSize: '2.5rem', display: 'inline-block', animation: 'sweep 2s linear infinite' }}>⚙️</span>
              <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>CONNECTING TO STRIPE GATEWAY...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plans = [
    {
      name: 'Challenger',
      price: '$0.00',
      period: 'Forever Free',
      accent: '#cbd5e0',
      glow: 'none',
      features: [
        'Create private matches',
        'Invite custom opponents',
        'Standard wagers & payouts',
        'Access to community feed',
        'Simulate basic cashouts'
      ],
      actionLabel: 'Active Plan',
      isCurrent: !currentUser?.isMember,
      disabled: true
    },
    {
      name: 'Elite Pro',
      price: '$9.99',
      period: 'Monthly Plan',
      accent: 'var(--accent-gold)',
      glow: 'var(--gold-glow)',
      isPro: true,
      features: [
        '✓ Access to public wagers & match arena',
        '✓ Members-only high-stakes Tournaments',
        '✓ Premium Elite Pro profile badge',
        '✓ 1.25x Union Reward points boost',
        '✓ Lower cashout verification overhead',
        '✓ High-priority admin dispute support'
      ],
      actionLabel: currentUser?.isMember ? 'Subscribed' : 'Subscribe with Stripe',
      isCurrent: currentUser?.isMember,
      disabled: currentUser?.isMember
    },
    {
      name: 'Union Master',
      price: '$24.99',
      period: 'Monthly Plan',
      accent: 'var(--neon-amber)',
      glow: 'var(--amber-glow)',
      features: [
        '✓ Access to ALL public wagers & tournaments',
        '✓ Exclusive Master brackets',
        '✓ Gold profile frame & Master badge',
        '✓ 1.50x Union Reward points boost',
        '✓ 0% platform fee on wagers',
        '✓ Expand Team Union up to 15 members'
      ],
      actionLabel: currentUser?.isMember ? 'Tier Upgraded' : 'Get Master Access',
      isCurrent: false,
      disabled: currentUser?.isMember
    }
  ];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.heroGlow}></div>

      <div className="container" style={styles.content}>
        {/* Page Header */}
        <div style={styles.header}>
          <span className="neon-tag neon-tag-blue">VERSA Pass</span>
          <h1 style={styles.title}>CHOOSE YOUR ACCESS TIER</h1>
          <p style={styles.subtitle}>Unlock high-stakes public wagers, competitive tournaments, and score boost multipliers.</p>
        </div>

        {/* Plan Cards Grid */}
        <div style={styles.grid}>
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              style={{
                ...styles.planCard,
                borderColor: plan.isPro && !plan.isCurrent ? 'var(--primary-gold)' : 'var(--glass-border)',
                boxShadow: plan.isPro && !plan.isCurrent ? 'var(--gold-glow)' : 'var(--card-shadow)'
              }}
              className="glass-panel"
            >
              {plan.isPro && !plan.isCurrent && (
                <div style={styles.popularBadge} className="neon-tag neon-tag-blue">MOST POPULAR</div>
              )}
              <h3 style={{ ...styles.planName, color: plan.accent }}>{plan.name}</h3>
              <div style={styles.priceRow}>
                <span style={styles.priceVal}>{plan.price}</span>
                <span style={styles.pricePeriod}>/ {plan.period}</span>
              </div>

              <div style={styles.divider}></div>

              <ul style={styles.featureList}>
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} style={styles.featureItem}>
                    <span style={{ ...styles.featDot, color: plan.accent }}>•</span>
                    <span style={{
                      ...styles.featText,
                      color: plan.isCurrent ? 'var(--foreground)' : '#cbd5e0'
                    }}>{feat}</span>
                  </li>
                ))}
              </ul>

              {plan.isCurrent ? (
                <div style={styles.currentIndicator} className="neon-tag neon-tag-blue">
                  ✓ YOUR ACTIVE ACCESS TIER
                </div>
              ) : (
                <button 
                  onClick={() => handleOpenCheckout(plan.name, plan.price)}
                  disabled={plan.disabled}
                  className="btn btn-primary"
                  style={{
                    ...styles.actionBtn,
                    background: plan.disabled ? 'rgba(255,255,255,0.05)' : 'var(--gold-gradient)',
                    color: plan.disabled ? '#718096' : '#050505',
                    boxShadow: plan.disabled ? 'none' : 'var(--gold-glow)',
                    border: plan.disabled ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }}
                >
                  {plan.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Pricing FAQs */}
        <div style={styles.faqSection} className="glass-card">
          <h2 style={styles.faqTitle} className="text-gradient-gold">Frequently Asked Questions</h2>
          <div style={styles.faqGrid}>
            <div style={styles.faqItem}>
              <h4 style={styles.faqQuest}>Why are public matches locked?</h4>
              <p style={styles.faqAnswer}>To maintain competitive balance, secure fairness, and prevent fraudulent wagers, only verified and subscribed Elite members can join public wagering lobbies. All gamers can create private wagers for free.</p>
            </div>
            <div style={styles.faqItem}>
              <h4 style={styles.faqQuest}>Can I cancel my subscription?</h4>
              <p style={styles.faqAnswer}>Yes, subscriptions are handled securely through simulated Stripe setups. You can cancel at any time directly in your gamer profile dashboard without any lock-in contracts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* STRIPE CHECKOUT MODAL SIMULATION */}
      {showCheckout && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="glass-panel">
            {success ? (
              <div style={styles.successWrapper}>
                <span style={styles.successIcon}>🏆</span>
                <h3 style={styles.successTitle}>UPGRADE SECURED!</h3>
                <p style={styles.successText}>Welcome to the Elite Wager Arena. Redirecting details...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} style={styles.modalForm}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Stripe Checkout</h3>
                  <button 
                    type="button" 
                    onClick={() => setShowCheckout(false)} 
                    style={styles.closeBtn}
                  >✕</button>
                </div>
                <p style={styles.modalSubtitle}>Secure payment processing simulated via Stripe</p>
                
                <div style={styles.checkoutSummary} className="glass-card">
                  <span>Upgrade to {selectedPlan.name}</span>
                  <strong style={{ color: 'var(--accent-gold)' }}>{selectedPlan.price} / mo</strong>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Simulated Card Number</label>
                  <input 
                    type="text" 
                    className="neon-input" 
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.row}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Expiry</label>
                    <input 
                      type="text" 
                      className="neon-input" 
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>CVC</label>
                    <input 
                      type="text" 
                      className="neon-input" 
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={styles.secureNotice}>
                  🔒 Safe & Secure. Simulated transaction environment. No real funds charged.
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={styles.payBtn}
                  disabled={loading}
                >
                  {loading ? 'Authorizing Upgrades...' : `Pay ${selectedPlan.price} USD`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    width: '100%',
    padding: '4rem 1.5rem',
    position: 'relative',
    background: '#050505',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heroGlow: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '900px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(5, 5, 5, 0) 70%)',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    width: '100%'
  },
  planCard: {
    padding: '2.5rem',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '480px'
  },
  popularBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '0.65rem'
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '1rem'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    marginBottom: '1.5rem'
  },
  priceVal: {
    fontSize: '3rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '-0.02em'
  },
  pricePeriod: {
    fontSize: '0.85rem',
    color: '#a0aec0',
    fontWeight: '500'
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: '1.5rem'
  },
  featureList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2.5rem',
    flexGrow: 1
  },
  featureItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    lineHeight: '1.5'
  },
  featDot: {
    fontSize: '1.25rem',
    lineHeight: '1'
  },
  featText: {
    fontSize: '0.95rem'
  },
  currentIndicator: {
    width: '100%',
    padding: '0.75rem',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '0.8rem'
  },
  actionBtn: {
    width: '100%',
    padding: '0.85rem'
  },
  faqSection: {
    padding: '3rem',
    marginTop: '1.5rem'
  },
  faqTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2.5rem'
  },
  faqItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  faqQuest: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fff'
  },
  faqAnswer: {
    fontSize: '0.9rem',
    color: '#cbd5e0',
    lineHeight: '1.6'
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 5, 5, 0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem'
  },
  modalCard: {
    maxWidth: '440px',
    width: '100%',
    padding: '2.5rem'
  },
  successWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    padding: '1.5rem 0'
  },
  successIcon: {
    fontSize: '4rem'
  },
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: '900',
    color: 'var(--accent-gold)',
    letterSpacing: '0.05em'
  },
  successText: {
    fontSize: '0.95rem',
    color: '#cbd5e0',
    lineHeight: '1.5'
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.02em'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#718096',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem'
  },
  modalSubtitle: {
    fontSize: '0.85rem',
    color: '#a0aec0',
    marginTop: '-0.75rem'
  },
  checkoutSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
    fontSize: '0.95rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  row: {
    display: 'flex',
    gap: '1rem'
  },
  secureNotice: {
    fontSize: '0.75rem',
    color: '#718096',
    textAlign: 'center',
    marginTop: '0.25rem'
  },
  payBtn: {
    width: '100%',
    padding: '0.9rem'
  }
};
