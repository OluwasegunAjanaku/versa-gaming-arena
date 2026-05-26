'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';

export default function TeamsPage() {
  const { 
    currentUser, 
    teams, 
    allUsers, 
    createTeam, 
    inviteTeammate 
  } = useFirebase();

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [inviteTag, setInviteTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Chat placeholder state
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { username: 'SniperElite', text: 'Guys, did you see the new Apex Pred wager? Lets sign up!' },
    { username: 'TikiTakaMaster', text: 'I am down. I will carry.' },
    { username: 'WraithMain', text: 'In your dreams soccer boy. I will host.' }
  ]);

  // Find if user is currently affiliated with a team
  const myTeam = teams.find(t => t.name === currentUser?.union || t.ownerId === currentUser?.id);

  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in to establish a Union.');
      return;
    }
    if (!teamName) {
      setErrorMsg('A team name is mandatory.');
      return;
    }

    setLoading(true);
    try {
      await createTeam(teamName, teamLogo);
      setSuccessMsg(`Congratulations! Union "${teamName}" is officially active!`);
      setTeamName('');
      setTeamLogo('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!myTeam) return;
    if (!inviteTag) {
      setErrorMsg('Please input a target Gamer Tag.');
      return;
    }

    setLoading(true);
    try {
      await inviteTeammate(myTeam.id, inviteTag);
      setSuccessMsg(`Invite accepted! @${inviteTag} is now linked to ${myTeam.name}.`);
      setInviteTag('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to invite player.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMsg = (e) => {
    e.preventDefault();
    if (!chatMessage || !currentUser) return;
    setChatMessages([...chatMessages, { username: currentUser.username, text: chatMessage }]);
    setChatMessage('');
  };

  // Sort teams by Union Reward Score for leaderboard
  const leaderboardTeams = [...teams].sort((a, b) => b.rewardScore - a.rewardScore);

  return (
    <div className="container" style={styles.teamsContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-blue">🛡️ Guild Operations</span>
        <h1 style={styles.title}>UNIONS & ESCORES</h1>
      </div>

      <div style={styles.grid} className="teams-grid">
        {/* LEFT PANEL: MY TEAM OR REGISTRATION */}
        <div style={styles.leftCol} className="teams-left">
          {myTeam ? (
            /* ACTIVE TEAM DASHBOARD */
            <div className="glass-card" style={styles.teamDashboardCard}>
              <div style={styles.teamDashboardHeader}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={myTeam.logo} 
                  alt={myTeam.name} 
                  style={styles.teamLogo}
                />
                <div>
                  <h2 style={styles.teamName}>{myTeam.name}</h2>
                  <span style={styles.unionAffil}>VERSA Guild Alliance</span>
                </div>
              </div>

              {/* Roster Metrics */}
              <div style={styles.metricsRow}>
                <div style={styles.metricBox} className="glass-panel">
                  <span style={styles.metricLabel}>UNION SCORE</span>
                  <span style={{ ...styles.metricVal, color: 'var(--accent-cyan)' }}>{myTeam.rewardScore}</span>
                </div>
                <div style={styles.metricBox} className="glass-panel">
                  <span style={styles.metricLabel}>ROSTER LIMIT</span>
                  <span style={styles.metricVal}>{myTeam.members.length}/10</span>
                </div>
                <div style={styles.metricBox} className="glass-panel">
                  <span style={styles.metricLabel}>ACTIVE MATCHES</span>
                  <span style={styles.metricVal}>{myTeam.matchesCount}</span>
                </div>
              </div>

              {/* Invite teammates form */}
              {myTeam.ownerId === currentUser?.id && (
                <div style={styles.inviteSection}>
                  <h3 style={styles.sectionTitle}>INVITE TEAMMATE</h3>
                  {errorMsg && <div className="neon-tag-magenta" style={styles.formStatus}>{errorMsg}</div>}
                  {successMsg && <div className="neon-tag-cyan" style={styles.formStatus}>{successMsg}</div>}
                  
                  <form onSubmit={handleInviteSubmit} style={styles.inviteForm}>
                    <input 
                      type="text" 
                      className="neon-input"
                      placeholder="Enter gamer tag (e.g. VersaGamer)"
                      value={inviteTag}
                      onChange={(e) => setInviteTag(e.target.value)}
                      disabled={loading}
                    />
                    <button type="submit" className="btn btn-outline-neon" disabled={loading}>
                      ➕ Add
                    </button>
                  </form>
                </div>
              )}

              {/* Active Members Roster list */}
              <div style={styles.rosterSection}>
                <h3 style={styles.sectionTitle}>ROSTER LOGS</h3>
                <div style={styles.membersList}>
                  {myTeam.members.map((username, idx) => {
                    const matchedUser = allUsers.find(u => u.username === username);
                    return (
                      <div key={username} style={styles.memberRow}>
                        <div style={styles.memberInfo}>
                          <span style={styles.avatarBadge}>{matchedUser?.avatar || '🎮'}</span>
                          <div>
                            <h4 style={styles.memberName}>@{username}</h4>
                            <span style={styles.memberRank}>
                              {myTeam.ownerId === matchedUser?.id ? '👑 Captain' : '🗡️ Vanguard'}
                            </span>
                          </div>
                        </div>
                        <div style={styles.memberStats}>
                          <span>W: {matchedUser?.wins || 0}</span>
                          <span style={{ color: '#718096' }}>|</span>
                          <span>L: {matchedUser?.losses || 0}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* CREATE TEAM BUILDER */
            <div className="glass-card" style={styles.card}>
              <h2 style={styles.cardTitle}>ESTABLISH GUILD UNION</h2>
              <p style={styles.cardDesc}>
                Assemble your crew of 10 elite players. Create custom guild badges, track your collective Esports score, complete guild challenges, and split coin bonuses!
              </p>
              {errorMsg && <div className="neon-tag-magenta" style={styles.formStatus}>{errorMsg}</div>}
              {successMsg && <div className="neon-tag-cyan" style={styles.formStatus}>{successMsg}</div>}

              <form onSubmit={handleCreateTeamSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Union Guild Name</label>
                  <input 
                    type="text" 
                    className="neon-input"
                    placeholder="e.g. Apex Predators"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Guild Emblem Banner URL (Optional)</label>
                  <input 
                    type="text" 
                    className="neon-input"
                    placeholder="https://domain.com/emblem.jpg"
                    value={teamLogo}
                    onChange={(e) => setTeamLogo(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                  🛡️ Activate Union Code
                </button>
              </form>
            </div>
          )}

          {/* Roster Chat console placeholder */}
          {myTeam && (
            <div className="glass-panel" style={styles.chatCard}>
              <h3 style={styles.sectionTitle}>💬 UNION ROSTER CHAT</h3>
              
              <div style={styles.chatBox}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={styles.chatMsg}>
                    <span style={{ 
                      ...styles.chatUser, 
                      color: msg.username === currentUser?.username ? 'var(--accent-cyan)' : 'var(--accent-blue)' 
                    }}>
                      @{msg.username}:
                    </span>
                    <span style={styles.chatText}>{msg.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChatMsg} style={styles.chatForm}>
                <input 
                  type="text" 
                  className="neon-input"
                  style={styles.chatInput}
                  placeholder={currentUser ? "Send message to roster..." : "Sign in to send messages"}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  disabled={!currentUser}
                />
                <button type="submit" className="btn btn-primary" style={styles.chatSendBtn} disabled={!currentUser}>
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: LEADERBOARD AND RECENT MATCHES */}
        <div style={styles.rightCol} className="teams-right">
          {/* Guild Leaderboard previews */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>UNION LEADERBOARD PREVIEW</h3>
            <p style={styles.cardDesc}>Global ladders ranked by Union Scores based on past competitive wagers.</p>
            
            <div style={styles.leaderboardList}>
              {leaderboardTeams.map((team, idx) => (
                <div key={team.id} style={styles.leadRow}>
                  <div style={styles.leadLeft}>
                    <span style={{ 
                      ...styles.leadRank, 
                      color: idx === 0 ? '#ffd700' : idx === 1 ? '#c0c0c0' : idx === 2 ? '#cd7f32' : '#718096' 
                    }}>
                      #{idx + 1}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={team.logo} alt={team.name} style={styles.leadLogo} />
                    <span style={styles.leadName}>{team.name}</span>
                  </div>
                  <span style={styles.leadScore} className="neon-tag neon-tag-cyan">
                    {team.rewardScore} Pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent matches */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>RECENT TEAM MATCHES</h3>
            <div style={styles.recentList}>
              <div style={styles.recentRow}>
                <div style={styles.recentLeft}>
                  <span style={{ ...styles.winBadge, color: 'var(--accent-cyan)' }}>WIN</span>
                  <div>
                    <h4 style={styles.recentTitle}>VS Alpha Syndicate</h4>
                    <span style={styles.recentMeta}>FC24 Arena • Pool: 500 Coins</span>
                  </div>
                </div>
                <span style={styles.recentDate}>May 23</span>
              </div>

              <div style={styles.recentRow}>
                <div style={styles.recentLeft}>
                  <span style={{ ...styles.winBadge, color: 'var(--accent-magenta)' }}>LOSS</span>
                  <div>
                    <h4 style={styles.recentTitle}>VS Team Liquid (Mock)</h4>
                    <span style={styles.recentMeta}>Warzone Squad • Pool: 1,000 Coins</span>
                  </div>
                </div>
                <span style={styles.recentDate}>May 19</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .teams-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  teamsContainer: {
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
    marginBottom: '1rem'
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#718096',
    lineHeight: '1.6',
    marginBottom: '1.5rem'
  },
  formStatus: {
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1.25rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem'
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
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  // Team Dashboard styles
  teamDashboardCard: {
    background: 'rgba(10, 13, 20, 0.45)',
    padding: '2.5rem 2rem'
  },
  teamDashboardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem'
  },
  teamLogo: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    objectFit: 'cover'
  },
  teamName: {
    fontSize: '1.6rem',
    fontWeight: '900',
    color: '#fff'
  },
  unionAffil: {
    fontSize: '0.8rem',
    color: 'var(--accent-blue)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  metricsRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  metricBox: {
    flex: 1,
    padding: '0.75rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem'
  },
  metricLabel: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#718096'
  },
  metricVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff'
  },
  inviteSection: {
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '1.25rem',
    borderRadius: '10px',
    marginBottom: '2rem',
    border: '1px dashed rgba(255, 255, 255, 0.05)'
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem'
  },
  inviteForm: {
    display: 'flex',
    gap: '0.75rem'
  },
  rosterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  memberRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '0.75rem 1rem'
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  avatarBadge: {
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '0.25rem',
    borderRadius: '6px'
  },
  memberName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff'
  },
  memberRank: {
    fontSize: '0.7rem',
    color: '#718096',
    fontWeight: '700'
  },
  memberStats: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#cbd5e0',
    display: 'flex',
    gap: '0.5rem'
  },
  chatCard: {
    padding: '1.5rem'
  },
  chatBox: {
    height: '180px',
    overflowY: 'auto',
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  chatMsg: {
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  chatUser: {
    fontWeight: '700',
    marginRight: '0.4rem'
  },
  chatText: {
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
  // Right Column styles
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '0.5rem'
  },
  leadRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '0.75rem 1rem'
  },
  leadLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  leadRank: {
    fontSize: '0.95rem',
    fontWeight: '900',
    width: '24px'
  },
  leadLogo: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    objectFit: 'cover'
  },
  leadName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff'
  },
  leadScore: {
    fontSize: '0.75rem'
  },
  recentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  recentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
  },
  recentLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  winBadge: {
    fontSize: '0.7rem',
    fontWeight: '900',
    border: '1px solid',
    borderRadius: '3px',
    padding: '0.15rem 0.4rem',
    width: '46px',
    textAlign: 'center'
  },
  recentTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#fff'
  },
  recentMeta: {
    fontSize: '0.75rem',
    color: '#718096'
  },
  recentDate: {
    fontSize: '0.8rem',
    color: '#4a5568'
  }
};
