'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';

// Helper to generate simulated viewers without violating component purity
function getRandomViewers(base, range) {
  return Math.floor(base + Math.random() * range);
}

export default function LivePage() {
  const { currentUser } = useFirebase();

  // Broadcaster simulation states
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('Warzone Competitive Wager Arena - 200 Coin Stakes!');
  const [tempTitle, setTempTitle] = useState('');
  const [viewersCount, setViewersCount] = useState(142);

  // Live Chat states
  const [chatMsg, setChatMsg] = useState('');
  const [liveChat, setLiveChat] = useState([
    { username: 'SniperElite', text: 'This stream is insane! That snipe was wild.' },
    { username: 'TikiTakaMaster', text: 'Lag? Or was that genuine tactical positioning?' },
    { username: 'WraithMain', text: 'Genuine movement god. Sheeesh!' },
    { username: 'ProGamer_X', text: 'Wager coins locked in. Let\'s go!' }
  ]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMsg || !currentUser) return;
    setLiveChat([...liveChat, { username: currentUser.username, text: chatMsg }]);
    setChatMsg('');
  };

  const handleGoLiveToggle = () => {
    if (!currentUser) {
      alert('Please sign in to broadcast.');
      return;
    }
    if (isLive) {
      setIsLive(false);
    } else {
      setStreamTitle(tempTitle || `${currentUser.username}'s Arena Stream - Competitive Wagers!`);
      setViewersCount(getRandomViewers(10, 200));
      setIsLive(true);
    }
  };

  // Watch Party active streams list
  const MOCK_STREAMS = [
    { id: 'st1', host: 'SniperElite', title: '🔴 Warzone 1v1 Arena - Wager Stakes', viewers: 342, videoId: 'g1bwbN7C6J4' },
    { id: 'st2', host: 'TikiTakaMaster', title: '🏆 FC 24 Ultimate Team Competitive Wagers', viewers: 188, videoId: 'g1bwbN7C6J4' },
    { id: 'st3', host: 'WraithMain', title: '⚔️ Apex Predator Ranked Grinding', viewers: 512, videoId: 'g1bwbN7C6J4' }
  ];

  const [activeStreamVideo, setActiveStreamVideo] = useState('g1bwbN7C6J4'); // Default YouTube gaming trailer video
  const [activeStreamTitle, setActiveStreamTitle] = useState('VERSA Pro Arena Showcase - 1000 Coin Bounties!');

  const handleSelectWatchStream = (videoId, title) => {
    setActiveStreamVideo(videoId);
    setActiveStreamTitle(title);
    setViewersCount(getRandomViewers(80, 600));
  };

  return (
    <div className="container" style={styles.liveContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-magenta">🔴 Watch Party</span>
        <h1 style={styles.title}>LIVE STREAMS & ARENA ACTION</h1>
      </div>

      <div style={styles.grid} className="live-grid">
        {/* LEFT COLUMN: MAIN BROADCASTER CINEMA */}
        <div style={styles.leftCol} className="live-left">
          {/* Cinema Frame */}
          <div className="glass-panel" style={styles.cinemaFrame}>
            <div style={styles.iframeWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${activeStreamVideo}?autoplay=1&mute=1`}
                title="VERSA Livestream Arena"
                style={styles.iframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div style={styles.streamInfoBar}>
              <div>
                <div style={styles.streamTitleRow}>
                  <span className="pulse-icon" style={{ backgroundColor: 'var(--accent-magenta)' }}></span>
                  <h2 style={styles.streamTitle}>{isLive ? streamTitle : activeStreamTitle}</h2>
                </div>
                <p style={styles.broadcasterMeta}>
                  Broadcasted in High Definition • {viewersCount} active viewers
                </p>
              </div>
              
              {isLive && (
                <span className="neon-tag neon-tag-magenta" style={{ textShadow: 'var(--pink-glow)' }}>
                  STREAMING LIVE
                </span>
              )}
            </div>
          </div>

          {/* Broadcaster Dashboard Simulator */}
          <div className="glass-card" style={styles.broadcasterCard}>
            <h3 style={styles.sectionTitle}>🛠️ BROADCASTER STUDIO SIMULATOR</h3>
            <p style={styles.broadcasterDesc}>
              Simulate going live as a competitive esports streamer. Broadcasters earn 10 coins per viewer tick!
            </p>
            
            <div style={styles.studioForm}>
              {!isLive && (
                <input 
                  type="text" 
                  className="neon-input"
                  style={styles.studioInput}
                  placeholder="Set custom stream title..."
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                />
              )}
              <button 
                onClick={handleGoLiveToggle} 
                className="btn"
                style={{ 
                  ...styles.studioBtn,
                  background: isLive ? 'var(--accent-magenta)' : 'var(--accent-blue)',
                  color: '#fff',
                  boxShadow: isLive ? 'var(--pink-glow)' : 'var(--blue-glow)'
                }}
              >
                {isLive ? '⏹️ Stop Broadcast' : '🎥 Broadcast Live'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHAT AND WATCH PARTY LIST */}
        <div style={styles.rightCol} className="live-right">
          {/* Live Chat drawer */}
          <div className="glass-card" style={styles.chatCard}>
            <h3 style={styles.chatHeader}>💬 ARENA LIVE CHAT</h3>
            
            <div style={styles.chatList}>
              {liveChat.map((msg, idx) => (
                <div key={idx} style={styles.msgRow}>
                  <span style={{ 
                    ...styles.chatUser, 
                    color: msg.username === currentUser?.username ? 'var(--accent-cyan)' : 'var(--accent-blue)' 
                  }}>
                    @{msg.username}
                  </span>
                  <p style={styles.chatText}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={styles.chatForm}>
              <input 
                type="text" 
                className="neon-input"
                style={styles.chatInput}
                placeholder={currentUser ? "Chat with the arena..." : "Sign in to chat"}
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                disabled={!currentUser}
              />
              <button type="submit" className="btn btn-primary" style={styles.chatSendBtn} disabled={!currentUser}>
                Send
              </button>
            </form>
          </div>

          {/* Active Watch Party List */}
          <div className="glass-card" style={styles.watchPartyCard}>
            <h3 style={styles.sectionTitle}>ACTIVE WATCH PARTIES</h3>
            <div style={styles.watchList}>
              {MOCK_STREAMS.map((s) => (
                <div 
                  key={s.id} 
                  style={{ 
                    ...styles.watchRow,
                    borderColor: activeStreamTitle === s.title ? 'var(--accent-blue)' : 'rgba(255, 255, 255, 0.05)'
                  }} 
                  onClick={() => handleSelectWatchStream(s.videoId, s.title)}
                  className="watch-party-row"
                >
                  <div style={styles.watchMeta}>
                    <span style={styles.watchHost}>@{s.host}</span>
                    <h4 style={styles.watchTitle}>{s.title}</h4>
                  </div>
                  <span style={styles.viewersCount} className="neon-tag neon-tag-blue">
                    👥 {s.viewers}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .watch-party-row {
          cursor: pointer;
          transition: var(--transition-snappy);
        }
        .watch-party-row:hover {
          background: rgba(10, 132, 255, 0.04) !important;
          border-color: rgba(10, 132, 255, 0.3) !important;
        }
        @media (max-width: 960px) {
          .live-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  liveContainer: {
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
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '2.5rem',
    alignItems: 'start'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  cinemaFrame: {
    padding: '0.5rem',
    overflow: 'hidden'
  },
  iframeWrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 Aspect Ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '12px'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '12px'
  },
  streamInfoBar: {
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  streamTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem'
  },
  streamTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff'
  },
  broadcasterMeta: {
    fontSize: '0.85rem',
    color: '#718096'
  },
  broadcasterCard: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  broadcasterDesc: {
    fontSize: '0.85rem',
    color: '#718096',
    lineHeight: '1.5',
    marginBottom: '1.25rem'
  },
  studioForm: {
    display: 'flex',
    gap: '1rem',
    width: '100%'
  },
  studioInput: {
    flex: 1,
    padding: '0.75rem'
  },
  studioBtn: {
    borderRadius: '8px',
    padding: '0.75rem 1.75rem',
    fontWeight: '700'
  },
  // Right Column Chat and Watch party
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  chatCard: {
    padding: '1.5rem',
    height: '420px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  chatHeader: {
    fontSize: '0.95rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem'
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    padding: '0.25rem',
    marginBottom: '1rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '0.75rem'
  },
  msgRow: {
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  chatUser: {
    fontWeight: '800',
    marginRight: '0.4rem'
  },
  chatText: {
    display: 'inline',
    color: '#cbd5e0'
  },
  chatForm: {
    display: 'flex',
    gap: '0.5rem'
  },
  chatInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    fontSize: '0.85rem'
  },
  chatSendBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.85rem'
  },
  watchPartyCard: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  },
  watchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  watchRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '0.75rem 1rem'
  },
  watchMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  watchHost: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent-blue)',
    textTransform: 'uppercase'
  },
  watchTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff'
  },
  viewersCount: {
    fontSize: '0.75rem'
  }
};
