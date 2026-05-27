'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '../lib/firebase';
import Link from 'next/link';

const VACS_LOGS = [
  { threshold: 0, text: 'Initializing VACS Secure Connection...' },
  { threshold: 15, text: 'Scanning for third-party injection hooks...' },
  { threshold: 30, text: 'Verifying game environment package integrity...' },
  { threshold: 45, text: 'Checking active background drivers and processes...' },
  { threshold: 60, text: 'Auditing platform API account connection states...' },
  { threshold: 75, text: 'Scanning client memory blocks for unauthorized tools...' },
  { threshold: 90, text: 'Finalizing hardware-level secure validation...' },
  { threshold: 100, text: 'VACS Integrity Verified. Clean environment.' }
];

export default function VacsScanPage() {
  const { currentUser } = useFirebase();
  const router = useRouter();

  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing VACS Scan...');
  const [hasFailed, setHasFailed] = useState(false);
  const [forceFail, setForceFail] = useState(false); // Interactive fail toggle for testing
  const [completed, setCompleted] = useState(false);

  // Load progress
  useEffect(() => {
    // If not logged in, redirect back to auth
    if (!currentUser) {
      router.push('/auth');
      return;
    }

    let interval;
    if (progress < 100 && !hasFailed) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 8) + 3;
          const capped = next > 100 ? 100 : next;

          // Check if we want to simulate a failure state for testing
          if (forceFail && capped > 45 && prev <= 45) {
            setHasFailed(true);
            setScanStatus('SECURITY CRITICAL ALERT: Suspicious tool signature detected in active driver stack!');
            clearInterval(interval);
            return prev;
          }

          // Update status text based on logs
          const activeLog = [...VACS_LOGS].reverse().find((log) => capped >= log.threshold);
          if (activeLog) {
            setScanStatus(activeLog.text);
          }

          if (capped === 100) {
            setCompleted(true);
            clearInterval(interval);
            // Auto redirect to homepage dashboard after 1.2s on success
            setTimeout(() => {
              router.push('/');
            }, 1200);
          }

          return capped;
        });
      }, 150);
    }

    return () => clearInterval(interval);
  }, [progress, hasFailed, forceFail, currentUser, router]);

  const handleRetry = () => {
    setHasFailed(false);
    setForceFail(false);
    setProgress(0);
    setScanStatus('Re-initializing VACS Secure Protocol...');
  };

  const triggerFailureSimulation = () => {
    setForceFail(true);
    if (progress > 45) {
      // If already past, fail immediately
      setHasFailed(true);
      setScanStatus('SECURITY CRITICAL ALERT: Suspicious tool signature detected in active driver stack!');
    }
  };

  if (!currentUser) return null;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.ambientGlow}></div>
      <div style={styles.glowLeft}></div>

      <div style={styles.scanCard} className="glass-panel">
        {/* VACS Header */}
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <span style={styles.logoText}>VACS</span>
            <span style={styles.versionTag} className="neon-tag neon-tag-blue">Anti-Cheat System</span>
          </div>
          <p style={styles.subtitle}>VERSA ACTIVE CONSOLE SCANNER • PROTOCOL v4.1.8</p>
        </div>

        {/* Scan Circular Radar */}
        <div style={styles.radarWrapper}>
          <div style={{
            ...styles.radarCircle,
            borderColor: hasFailed ? '#ff4b4b' : 'var(--primary-gold)',
            boxShadow: hasFailed ? '0 0 25px rgba(255, 75, 75, 0.2)' : 'var(--gold-glow)'
          }}>
            {/* Spinning Radar sweep */}
            {!hasFailed && !completed && <div style={styles.radarSweep}></div>}
            
            {/* Center Status Icon */}
            <div style={styles.centerStatus}>
              {hasFailed ? (
                <span style={{ ...styles.centerIcon, color: '#ff4b4b' }}>🚨</span>
              ) : completed ? (
                <span style={{ ...styles.centerIcon, color: 'var(--accent-gold)' }}>🛡️</span>
              ) : (
                <span style={styles.centerIcon}>⚙️</span>
              )}
              <span style={{
                ...styles.centerPercent,
                color: hasFailed ? '#ff4b4b' : 'var(--foreground)'
              }}>
                {hasFailed ? 'ERR' : `${progress}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Console Log status message */}
        <div style={{
          ...styles.statusMessage,
          borderColor: hasFailed ? '#ff4b4b' : completed ? 'var(--primary-gold)' : 'var(--glass-border)',
          background: hasFailed ? 'rgba(255, 75, 75, 0.08)' : completed ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0,0,0,0.2)'
        }}>
          <div style={styles.statusIndicatorRow}>
            <span className="pulse-icon" style={{
              backgroundColor: hasFailed ? '#ff4b4b' : completed ? 'var(--primary-gold)' : 'var(--neon-amber)'
            }}></span>
            <span style={{
              ...styles.statusText,
              color: hasFailed ? '#ff4b4b' : completed ? 'var(--accent-gold)' : 'var(--foreground)',
              fontFamily: 'var(--font-mono)'
            }}>
              {scanStatus}
            </span>
          </div>
        </div>

        {/* Technical Diagnostics Logs terminal */}
        <div style={styles.terminal} className="glass-card">
          <p style={styles.terminalHeader} className="technical-label">Gamer Machine Diagnostic Environment</p>
          <div style={styles.terminalLines}>
            <p style={styles.termLine}><span style={styles.termPrompt}>$</span> USER_GKEY: {currentUser.id.toUpperCase()}</p>
            <p style={styles.termLine}><span style={styles.termPrompt}>$</span> GAMER_TAG: {currentUser.username}</p>
            <p style={styles.termLine}><span style={styles.termPrompt}>$</span> HWID: VACS_HWID_{currentUser.username.toUpperCase()}_77XF</p>
            
            {progress >= 15 && (
              <p style={{ ...styles.termLine, color: '#22c55e' }}>✓ Driver integrity: VALID</p>
            )}
            {progress >= 35 && (
              <p style={{ ...styles.termLine, color: '#22c55e' }}>✓ Hook detections: 0 detected signatures</p>
            )}
            {progress >= 60 && (
              <p style={{ ...styles.termLine, color: '#22c55e' }}>✓ Console account linking API: CONNECTED</p>
            )}
            
            {hasFailed && (
              <>
                <p style={{ ...styles.termLine, color: '#ff4b4b' }}>✗ CRITICAL ERROR: Active overlay injection detected in memory block D3-09</p>
                <p style={{ ...styles.termLine, color: '#ff4b4b' }}>✗ VACS ACCESS DENIED: Please close cheating overlay packages and try again</p>
              </>
            )}

            {completed && (
              <p style={{ ...styles.termLine, color: 'var(--accent-gold)', fontWeight: 'bold' }}>✓ SUCCESS: Secure sandbox created. Redirection active.</p>
            )}
          </div>
        </div>

        {/* Buttons / Control panel */}
        <div style={styles.actions}>
          {hasFailed ? (
            <button onClick={handleRetry} className="btn btn-primary" style={styles.actionBtn}>
              🔄 Clean & Retry System Scan
            </button>
          ) : (
            <div style={styles.testingControls} className="glass-card">
              <span className="technical-label" style={{ marginBottom: '0.5rem', display: 'block' }}>VACS Platform Test Controls</span>
              <div style={styles.testBtnRow}>
                <button 
                  onClick={triggerFailureSimulation} 
                  className="btn btn-secondary" 
                  style={{ ...styles.testBtn, color: '#ff4b4b', borderColor: '#ff4b4b' }}
                  disabled={completed}
                >
                  ⚠️ Simulate Anti-Cheat Flag (Failure State)
                </button>
              </div>
              <p style={styles.testNote}>Test mode allows you to simulate failure to verify that dispute / anti-cheat access restrictions function correctly.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 1.5rem',
    position: 'relative',
    background: '#050505'
  },
  ambientGlow: {
    position: 'fixed',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '700px',
    height: '700px',
    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(5, 5, 5, 0) 70%)',
    pointerEvents: 'none',
    zIndex: -1
  },
  glowLeft: {
    position: 'fixed',
    bottom: '0',
    right: '0',
    width: '400px',
    height: '400px',
    background: 'radial-gradient(circle, rgba(255, 198, 64, 0.04) 0%, rgba(5, 5, 5, 0) 70%)',
    pointerEvents: 'none',
    zIndex: -1
  },
  scanCard: {
    maxWidth: '560px',
    width: '100%',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem'
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: '900',
    letterSpacing: '0.2rem',
    color: '#fff',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.2)'
  },
  versionTag: {
    padding: '0.2rem 0.5rem',
    fontSize: '0.65rem'
  },
  subtitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.08em',
    color: '#718096',
    fontFamily: 'var(--font-mono)'
  },
  radarWrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1.5rem 0'
  },
  radarCircle: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    borderWidth: '2px',
    borderStyle: 'solid',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-smooth)',
    overflow: 'hidden',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  radarSweep: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'conic-gradient(from 0deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0) 50%)',
    borderRadius: '50%',
    animation: 'sweep 3.5s linear infinite',
    pointerEvents: 'none'
  },
  centerStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    zIndex: 2
  },
  centerIcon: {
    fontSize: '2rem'
  },
  centerPercent: {
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '0.05em'
  },
  statusMessage: {
    border: '1px solid',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    transition: 'var(--transition-smooth)'
  },
  statusIndicatorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  statusText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
    lineHeight: '1.4'
  },
  terminal: {
    padding: '1.25rem',
    background: 'rgba(0, 0, 0, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  terminalHeader: {
    marginBottom: '0.75rem',
    fontSize: '0.7rem'
  },
  terminalLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    maxHeight: '130px',
    overflowY: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: '#cbd5e0'
  },
  termLine: {
    lineHeight: '1.4'
  },
  termPrompt: {
    color: 'var(--primary-gold)',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  actionBtn: {
    width: '100%',
    padding: '0.9rem'
  },
  testingControls: {
    padding: '1.25rem',
    background: 'rgba(255, 255, 255, 0.01)',
    textAlign: 'center'
  },
  testBtnRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '0.5rem'
  },
  testBtn: {
    width: '100%',
    fontSize: '0.75rem',
    padding: '0.6rem 1rem'
  },
  testNote: {
    fontSize: '0.7rem',
    color: '#718096',
    marginTop: '0.75rem',
    lineHeight: '1.3'
  }
};
