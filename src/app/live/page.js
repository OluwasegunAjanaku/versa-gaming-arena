'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFirebase } from '../lib/firebase';

// Viewer count simulators outside of the component body to maintain render purity
function simulateBroadcastViewers() {
  return Math.floor(100 + Math.random() * 250);
}

function simulateWatchViewers() {
  return Math.floor(120 + Math.random() * 400);
}

export default function LivePage() {
  const { currentUser } = useFirebase();

  // Broadcaster simulation states
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('Warzone Competitive Wager Arena - 200 Coin Stakes!');
  const [tempTitle, setTempTitle] = useState('');
  const [viewersCount, setViewersCount] = useState(342);

  // Platform Filter states
  const [chatFilter, setChatFilter] = useState('all'); // all, twitch, youtube, tiktok

  // Voice Note states
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const recordIntervalRef = useRef(null);

  // Live Chat initial states with platforms
  const [liveChat, setLiveChat] = useState([
    { username: 'SniperElite', text: 'This stream is insane! That snipe was wild.', platform: 'twitch', isVoice: false },
    { username: 'TikiTakaMaster', text: 'Lag? Or was that genuine tactical positioning?', platform: 'youtube', isVoice: false },
    { username: 'WraithMain', text: 'Genuine movement god. Sheeesh!', platform: 'tiktok', isVoice: false },
    { username: 'ProGamer_X', text: 'Wager coins locked in. Let\'s go!', platform: 'twitch', isVoice: false },
    { username: 'GamerGirl77', text: '🔊 Played a voice note in Union chat!', platform: 'youtube', isVoice: true, duration: '0:04' }
  ]);
  const [chatMsg, setChatMsg] = useState('');

  // Simulated viewer/comment stream intervals
  useEffect(() => {
    // Viewer tick
    const viewerInterval = setInterval(() => {
      setViewersCount((prev) => prev + Math.floor(Math.random() * 9) - 4);
    }, 4000);

    // Dynamic Comments tick
    const mockUsernames = ['NoobSlayer', 'ApexKing', 'WagerMaster', 'ValorantDiva', 'ConsoleGod', 'StripeCashOut'];
    const mockTexts = [
      'Backing my play with 100 coins tonight!',
      'VACS scan was so clean, loving the radar.',
      'Who is up for FIFA 1v1 right now?',
      'Let\'s build a team union in COD!',
      'Just withdrawn 500 coins to Stripe, fast cash!',
      'Gamer tag linked successfully. Best UX ever.'
    ];
    const mockPlatforms = ['twitch', 'youtube', 'tiktok'];

    const commentInterval = setInterval(() => {
      const randomUser = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      const randomPlatform = mockPlatforms[Math.floor(Math.random() * mockPlatforms.length)];

      setLiveChat((prev) => [
        ...prev,
        { username: randomUser, text: randomText, platform: randomPlatform, isVoice: false }
      ].slice(-30)); // Cap to last 30 comments to keep performance sleek
    }, 3500);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(commentInterval);
    };
  }, []);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMsg || !currentUser) return;
    setLiveChat((prev) => [
      ...prev,
      { username: currentUser.username, text: chatMsg, platform: 'twitch', isVoice: false }
    ]);
    setChatMsg('');
  };

  const startVoiceRecording = () => {
    if (!currentUser) {
      alert('Please sign in to send voice notes.');
      return;
    }
    setIsRecording(true);
    setRecordTimer(0);
    recordIntervalRef.current = setInterval(() => {
      setRecordTimer((prev) => {
        if (prev >= 4) {
          // Auto complete recording at 4 seconds
          clearInterval(recordIntervalRef.current);
          setIsRecording(false);
          // Append voice note to chat
          setLiveChat((prevChat) => [
            ...prevChat,
            { username: currentUser.username, text: 'Simulated Voice Note', platform: 'twitch', isVoice: true, duration: '0:04' }
          ]);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopVoiceRecording = () => {
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
    }
    setIsRecording(false);
    if (recordTimer > 0) {
      setLiveChat((prevChat) => [
        ...prevChat,
        { username: currentUser?.username || 'Gamer', text: 'Simulated Voice Note', platform: 'twitch', isVoice: true, duration: `0:0${recordTimer}` }
      ]);
    }
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
      setViewersCount(simulateBroadcastViewers());
      setIsLive(true);
    }
  };

  // Watch Party active streams list
  const MOCK_STREAMS = [
    { id: 'st1', host: 'SniperElite', title: '🔴 Warzone 1v1 Arena - Wager Stakes', viewers: 342, videoId: 'e-H48PZ8Urc' },
    { id: 'st2', host: 'TikiTakaMaster', title: '🏆 FC 24 Ultimate Team Competitive Wagers', viewers: 188, videoId: 'R939u_j1z4s' },
    { id: 'st3', host: 'WraithMain', title: '⚔️ Apex Predator Ranked Grinding', viewers: 512, videoId: '3nO2N2Xn5sM' }
  ];

  const [activeStreamVideo, setActiveStreamVideo] = useState('e-H48PZ8Urc'); // Default YouTube gaming video
  const [activeStreamTitle, setActiveStreamTitle] = useState('VERSA Pro Arena Showcase - 1000 Coin Bounties!');

  const handleSelectWatchStream = (videoId, title) => {
    setActiveStreamVideo(videoId);
    setActiveStreamTitle(title);
    setViewersCount(simulateWatchViewers());
  };

  // Filter comments
  const filteredChat = liveChat.filter((msg) => {
    if (chatFilter === 'all') return true;
    return msg.platform === chatFilter;
  });

  return (
    <div className="container" style={styles.liveContainer}>
      <div style={styles.ambientGlow}></div>

      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-blue">🔴 Watch Arena</span>
        <h1 style={styles.title}>LIVE MULTISTREAM HUB</h1>
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
                  <span className="pulse-icon"></span>
                  <h2 style={styles.streamTitle}>{isLive ? streamTitle : activeStreamTitle}</h2>
                </div>
                <p style={styles.broadcasterMeta}>
                  Broadcasted in High Definition • {viewersCount} active viewers
                </p>
              </div>
              
              {isLive && (
                <span className="neon-tag neon-tag-magenta" style={{ textShadow: 'var(--amber-glow)', color: 'var(--accent-gold)', borderColor: 'var(--primary-gold)' }}>
                  STREAMING LIVE
                </span>
              )}
            </div>
          </div>

          {/* Broadcaster Dashboard Simulator */}
          <div className="glass-card" style={styles.broadcasterCard}>
            <h3 style={styles.sectionTitle} className="text-gradient-gold">🛠️ BROADCASTER STUDIO SIMULATOR</h3>
            <p style={styles.broadcasterDesc}>
              Simulate going live as a competitive esports streamer on VERSA. Broadcasters earn 10 coins per viewer tick!
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
                className="btn btn-primary"
                style={styles.studioBtn}
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
            <div style={styles.chatHeader}>
              <h3 style={styles.chatTitle}>💬 UNIFIED LIVE COMMENTARY</h3>
              
              {/* PLATFORM FILTERS */}
              <div style={styles.filterToolbar}>
                <button 
                  onClick={() => setChatFilter('all')} 
                  style={{ ...styles.filterBtn, color: chatFilter === 'all' ? 'var(--accent-gold)' : '#cbd5e0', background: chatFilter === 'all' ? 'rgba(212,175,55,0.1)' : 'transparent' }}
                >All</button>
                <button 
                  onClick={() => setChatFilter('twitch')} 
                  style={{ ...styles.filterBtn, color: chatFilter === 'twitch' ? '#a970ff' : '#cbd5e0', background: chatFilter === 'twitch' ? 'rgba(169,112,255,0.1)' : 'transparent' }}
                >Twitch</button>
                <button 
                  onClick={() => setChatFilter('youtube')} 
                  style={{ ...styles.filterBtn, color: chatFilter === 'youtube' ? '#ff0000' : '#cbd5e0', background: chatFilter === 'youtube' ? 'rgba(255,0,0,0.1)' : 'transparent' }}
                >YouTube</button>
                <button 
                  onClick={() => setChatFilter('tiktok')} 
                  style={{ ...styles.filterBtn, color: chatFilter === 'tiktok' ? '#00f2fe' : '#cbd5e0', background: chatFilter === 'tiktok' ? 'rgba(0,242,254,0.1)' : 'transparent' }}
                >TikTok</button>
              </div>
            </div>
            
            {/* Chats Listing */}
            <div style={styles.chatList}>
              {filteredChat.map((msg, idx) => {
                const platformBadge = 
                  msg.platform === 'twitch' ? { color: '#a970ff', label: '🟪' } : 
                  msg.platform === 'youtube' ? { color: '#ff0000', label: '🟥' } : 
                  { color: '#00f2fe', label: '🟫' };

                return (
                  <div key={idx} style={styles.msgRow}>
                    <span style={{ fontSize: '0.75rem', marginRight: '0.25rem' }}>{platformBadge.label}</span>
                    <span style={{ 
                      ...styles.chatUser, 
                      color: msg.username === currentUser?.username ? 'var(--accent-gold)' : '#cbd5e0' 
                    }}>
                      @{msg.username}:
                    </span>
                    
                    {msg.isVoice ? (
                      <div style={styles.voiceWidget}>
                        <span>🔊 Voice Note [{msg.duration}]</span>
                        <button type="button" onClick={() => alert('Playing simulated gamer voice note...')} style={styles.playBtn}>▶ Play</button>
                      </div>
                    ) : (
                      <p style={styles.chatText}>{msg.text}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chat Send Form */}
            <form onSubmit={handleSendChat} style={styles.chatForm}>
              {isRecording ? (
                <div style={styles.recordingOverlay}>
                  <span className="pulse-icon" style={{ backgroundColor: '#ff4b4b' }}></span>
                  <span style={{ color: '#ff4b4b', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    Recording voice note... 0:0{recordTimer} / 0:04
                  </span>
                  <button type="button" onClick={stopVoiceRecording} className="btn" style={styles.stopRecordBtn}>
                    Stop & Send
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    type="button" 
                    onMouseDown={startVoiceRecording}
                    onTouchStart={startVoiceRecording}
                    title="Hold to record voice note (Simulated)"
                    style={styles.micBtn}
                  >
                    🎙️
                  </button>
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
                </>
              )}
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
                    borderColor: activeStreamTitle === s.title ? 'var(--primary-gold)' : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: activeStreamTitle === s.title ? 'var(--gold-glow)' : 'none'
                  }} 
                  onClick={() => handleSelectWatchStream(s.videoId, s.title)}
                  className="watch-party-row"
                >
                  <div style={styles.watchMeta}>
                    <span style={styles.watchHost}>@{s.host}</span>
                    <h4 style={styles.watchTitle}>{s.title}</h4>
                  </div>
                  <span style={styles.viewersCount} className="neon-tag neon-tag-blue">
                    👥 {s.viewers} Viewers
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
          background: rgba(212, 175, 55, 0.03) !important;
          border-color: rgba(212, 175, 55, 0.3) !important;
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
    marginBottom: '3.5rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginTop: '0.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.25fr 0.75fr',
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
    overflow: 'hidden',
    borderImage: 'none',
    borderRadius: '12px'
  },
  iframeWrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9 Aspect Ratio
    height: 0,
    overflow: 'hidden',
    borderRadius: '8px'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px'
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
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff'
  },
  broadcasterMeta: {
    fontSize: '0.85rem',
    color: '#cbd5e0'
  },
  broadcasterCard: {
    background: 'rgba(19, 19, 19, 0.3)'
  },
  broadcasterDesc: {
    fontSize: '0.85rem',
    color: '#cbd5e0',
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
    padding: '0.75rem 1.75rem'
  },
  // Right Column Chat and Watch party
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  chatCard: {
    padding: '1.5rem',
    height: '460px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'rgba(19, 19, 19, 0.3)'
  },
  chatHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem'
  },
  chatTitle: {
    fontSize: '0.95rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em'
  },
  filterToolbar: {
    display: 'flex',
    gap: '0.4rem',
    flexWrap: 'wrap'
  },
  filterBtn: {
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '4px',
    padding: '0.2rem 0.5rem',
    fontSize: '0.7rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'var(--transition-snappy)'
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    marginBottom: '1rem',
    background: 'rgba(0, 0, 0, 0.35)',
    borderRadius: '6px',
    padding: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.02)'
  },
  msgRow: {
    fontSize: '0.85rem',
    lineHeight: '1.4',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chatUser: {
    fontWeight: '800',
    marginRight: '0.4rem',
    fontFamily: 'var(--font-mono)'
  },
  chatText: {
    display: 'inline',
    color: '#cbd5e0'
  },
  voiceWidget: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid rgba(212, 175, 55, 0.2)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    color: 'var(--accent-gold)'
  },
  playBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  },
  chatForm: {
    display: 'flex',
    gap: '0.5rem',
    position: 'relative'
  },
  micBtn: {
    background: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '4px',
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'var(--transition-snappy)'
  },
  chatInput: {
    flex: 1,
    padding: '0.65rem 0.85rem',
    fontSize: '0.85rem',
    borderRadius: '4px'
  },
  chatSendBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '4px',
    fontSize: '0.85rem'
  },
  recordingOverlay: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 0.5rem',
    background: 'rgba(255, 75, 75, 0.08)',
    border: '1px solid rgba(255, 75, 75, 0.3)',
    borderRadius: '4px',
    height: '38px'
  },
  stopRecordBtn: {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '4px',
    background: '#ff4b4b',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  watchPartyCard: {
    background: 'rgba(19, 19, 19, 0.3)'
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
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    padding: '0.75rem 1rem'
  },
  watchMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  watchHost: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent-gold)',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-mono)'
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
