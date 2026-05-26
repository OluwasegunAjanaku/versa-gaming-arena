'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const FirebaseContext = createContext(null);

// Initial Mock Data
const INITIAL_GAMES = [
  { id: 'cod', name: 'Call of Duty: Warzone', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', category: 'FPS' },
  { id: 'fifa', name: 'EA SPORTS FC 24', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop', category: 'Sports' },
  { id: 'apex', name: 'Apex Legends', image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop', category: 'Battle Royale' },
  { id: 'valorant', name: 'Valorant', image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=600&auto=format&fit=crop', category: 'Tactical Shooter' }
];

const INITIAL_MATCHES = [
  { id: 'm1', title: 'Warzone Friday Arena Wager', gameId: 'cod', gameName: 'Call of Duty: Warzone', wager: 100, hostId: 'u2', hostName: 'SniperElite', playersMax: 2, playersJoined: ['u2'], status: 'open', time: '10:00 PM', date: 'Tonight' },
  { id: 'm2', title: 'FC 24 El Clásico Wager 1v1', gameId: 'fifa', gameName: 'EA SPORTS FC 24', wager: 250, hostId: 'u3', hostName: 'TikiTakaMaster', playersMax: 2, playersJoined: ['u3', 'u4'], status: 'active', time: '8:30 PM', date: 'Tonight' },
  { id: 'm3', title: 'Apex Predator Cup Duos', gameId: 'apex', gameName: 'Apex Legends', wager: 50, hostId: 'u5', hostName: 'WraithMain', playersMax: 4, playersJoined: ['u5'], status: 'open', time: '11:15 PM', date: 'Tonight' }
];

const INITIAL_TEAMS = [
  { id: 't1', name: 'Vanguard Elite', ownerId: 'u2', members: ['SniperElite', 'TikiTakaMaster', 'WraithMain'], rewardScore: 88, logo: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200&auto=format&fit=crop', matchesCount: 15 },
  { id: 't2', name: 'Apex Syndicate', ownerId: 'u5', members: ['WraithMain', 'PathfinderPro', 'LifelineWannabe'], rewardScore: 74, logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=200&auto=format&fit=crop', matchesCount: 12 }
];

const INITIAL_QUESTS = [
  { id: 'q1', title: 'First Blood Wager', desc: 'Create your first wager match in the arena', reward: 50, category: 'daily', completed: false, claimed: false },
  { id: 'q2', title: 'Victory Feast', desc: 'Win 2 matches in a single day', reward: 150, category: 'daily', completed: false, claimed: false },
  { id: 'q3', title: 'Recruit Gamer', desc: 'Connect at least one console/platform link', reward: 100, category: 'weekly', completed: true, claimed: false },
  { id: 'q4', title: 'Admin Trust', desc: 'Claim free test coins from the Admin Deck', reward: 200, category: 'weekly', completed: false, claimed: false }
];

const INITIAL_FEED = [
  { id: 'f1', username: 'SniperElite', avatar: '🎯', content: 'Just secured a crazy 360-no-scope victory in the Warzone arena! Check out the victory ledger, 200 coins secured! 🤑🏆', tags: ['Clutch', 'Warzone', 'WinStreak'], likes: 14, likedBy: [], comments: [{ username: 'WraithMain', text: 'Insane shot bro!' }, { username: 'TikiTakaMaster', text: 'Wager god!' }], time: '2 hours ago' },
  { id: 'f2', username: 'TikiTakaMaster', avatar: '⚽', content: 'FUT Champions wager matches are paying off today. Who is up for a 1v1 FC24 match next? 250 coins on the line.', tags: ['FC24', '1v1', 'WagerArena'], likes: 8, likedBy: [], comments: [], time: '5 hours ago' }
];

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [quests, setQuests] = useState([]);
  const [feed, setFeed] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const loadState = () => {
      try {
        const storedUsers = localStorage.getItem('versa_users');
        const storedMatches = localStorage.getItem('versa_matches');
        const storedTeams = localStorage.getItem('versa_teams');
        const storedQuests = localStorage.getItem('versa_quests');
        const storedFeed = localStorage.getItem('versa_feed');
        const storedTx = localStorage.getItem('versa_transactions');
        const storedAuth = localStorage.getItem('versa_auth');

        // Preload default users
        let usersList = [];
        if (storedUsers) {
          usersList = JSON.parse(storedUsers);
        } else {
          usersList = [
            { id: 'u1', email: 'gamer@versa.com', username: 'VersaGamer', avatar: '🎮', coins: 1000, wins: 5, losses: 2, streak: 2, psn: 'VersaGamer_PS', steam: 'VersaGamer_ST', xbox: '', github: 'VersaGamer_GH', union: 'Vanguard Elite' },
            { id: 'u2', email: 'sniper@versa.com', username: 'SniperElite', avatar: '🎯', coins: 2400, wins: 18, losses: 6, streak: 5, psn: 'SniperElite_PS', steam: '', xbox: '', github: '', union: 'Vanguard Elite' },
            { id: 'u3', email: 'soccer@versa.com', username: 'TikiTakaMaster', avatar: '⚽', coins: 1500, wins: 9, losses: 7, streak: 0, psn: '', steam: 'TikiTaka', xbox: '', github: '', union: 'Vanguard Elite' },
            { id: 'u4', email: 'path@versa.com', username: 'PathfinderPro', avatar: '🤖', coins: 500, wins: 3, losses: 5, streak: 1, psn: '', steam: '', xbox: 'PathfinderXbox', github: '', union: 'Apex Syndicate' },
            { id: 'u5', email: 'wraith@versa.com', username: 'WraithMain', avatar: '👾', coins: 850, wins: 12, losses: 8, streak: 3, psn: 'WraithMain_PS', steam: 'WraithMain', xbox: 'WraithXbox', github: '', union: 'Apex Syndicate' }
          ];
          localStorage.setItem('versa_users', JSON.stringify(usersList));
        }
        setAllUsers(usersList);

        // Preload database
        setMatches(storedMatches ? JSON.parse(storedMatches) : INITIAL_MATCHES);
        setTeams(storedTeams ? JSON.parse(storedTeams) : INITIAL_TEAMS);
        setQuests(storedQuests ? JSON.parse(storedQuests) : INITIAL_QUESTS);
        setFeed(storedFeed ? JSON.parse(storedFeed) : INITIAL_FEED);

        // Seed transactions if empty
        if (storedTx) {
          setTransactions(JSON.parse(storedTx));
        } else {
          const defaultTx = [
            { id: 'tx1', userId: 'u1', username: 'VersaGamer', type: 'Welcome Reward', amount: 500, date: '2026-05-20' },
            { id: 'tx2', userId: 'u1', username: 'VersaGamer', type: 'Completed Quest: Connect Platform', amount: 100, date: '2026-05-22' },
            { id: 'tx3', userId: 'u2', username: 'SniperElite', type: 'Wager Won: Warzone Arena', amount: 200, date: '2026-05-24' }
          ];
          setTransactions(defaultTx);
          localStorage.setItem('versa_transactions', JSON.stringify(defaultTx));
        }

        // Initialize Authentication status
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          const matchedUser = usersList.find(u => u.id === authData.id);
          if (matchedUser) {
            setCurrentUser(matchedUser);
          }
        }
      } catch (err) {
        console.error('Failed to load simulated database: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, []);

  // Save changes back to localStorage helper
  const syncStorage = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Sync users list and current authenticated user details
  const syncUsersAndCurrent = (updatedUsersList, activeUser = null) => {
    localStorage.setItem('versa_users', JSON.stringify(updatedUsersList));
    setAllUsers(updatedUsersList);
    
    const userToSync = activeUser || currentUser;
    if (userToSync) {
      const freshUser = updatedUsersList.find(u => u.id === userToSync.id);
      if (freshUser) {
        setCurrentUser(freshUser);
        localStorage.setItem('versa_auth', JSON.stringify(freshUser));
      }
    }
  };

  // AUTH ACTIONS
  const signUp = (email, password, username) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const usernameExists = allUsers.some(u => u.username.toLowerCase() === username.toLowerCase());
        const emailExists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

        if (usernameExists) return reject(new Error('Gamer tag already taken.'));
        if (emailExists) return reject(new Error('Email address already registered.'));

        const newUser = {
          id: 'u_' + Math.random().toString(36).substr(2, 9),
          email,
          username,
          avatar: '🎮',
          coins: 500, // Sign up coin incentive!
          wins: 0,
          losses: 0,
          streak: 0,
          psn: '',
          steam: '',
          xbox: '',
          github: '',
          union: ''
        };

        const updatedUsers = [...allUsers, newUser];
        syncUsersAndCurrent(updatedUsers, newUser);
        
        // Log transaction
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          userId: newUser.id,
          username: newUser.username,
          type: 'Versa Welcome Bonus',
          amount: 500,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedTxs = [newTx, ...transactions];
        syncStorage('versa_transactions', updatedTxs, setTransactions);

        resolve(newUser);
      }, 500);
    });
  };

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return reject(new Error('Invalid email or password.'));

        setCurrentUser(user);
        localStorage.setItem('versa_auth', JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  };

  const loginWithOAuth = (provider) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find existing gamer or create new
        const oAuthUsername = `${provider}Gamer_${Math.floor(1000 + Math.random() * 9000)}`;
        const email = `${provider.toLowerCase()}@versa.com`;
        
        let user = allUsers.find(u => u.email === email);
        if (!user) {
          user = {
            id: 'u_' + Math.random().toString(36).substr(2, 9),
            email,
            username: oAuthUsername,
            avatar: provider === 'PSN' ? '🎯' : provider === 'Xbox' ? '🤖' : provider === 'GitHub' ? '🐙' : '🎮',
            coins: 500,
            wins: 0,
            losses: 0,
            streak: 0,
            psn: provider === 'PSN' ? oAuthUsername : '',
            steam: provider === 'Steam' ? oAuthUsername : '',
            xbox: provider === 'Xbox' ? oAuthUsername : '',
            github: provider === 'GitHub' ? oAuthUsername : '',
            union: ''
          };
          const updatedUsers = [...allUsers, user];
          syncUsersAndCurrent(updatedUsers, user);

          // Add transaction
          const newTx = {
            id: 'tx_' + Math.random().toString(36).substr(2, 9),
            userId: user.id,
            username: user.username,
            type: `${provider} Linking Welcome Bonus`,
            amount: 500,
            date: new Date().toISOString().split('T')[0]
          };
          const updatedTxs = [newTx, ...transactions];
          syncStorage('versa_transactions', updatedTxs, setTransactions);
        } else {
          setCurrentUser(user);
          localStorage.setItem('versa_auth', JSON.stringify(user));
        }
        resolve(user);
      }, 500);
    });
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('versa_auth');
  };

  // PROFILE ACTIONS
  const updateProfile = (username, avatar, psn, steam, xbox, github) => {
    if (!currentUser) return;
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, username, avatar, psn, steam, xbox, github };
      }
      return u;
    });
    syncUsersAndCurrent(updatedUsers);
  };

  // COINS AND TRANSACTION ACTIONS
  const addCoins = (userId, amount, label = 'Admin Credit') => {
    const updatedUsers = allUsers.map(u => {
      if (u.id === userId) {
        return { ...u, coins: u.coins + amount };
      }
      return u;
    });
    syncUsersAndCurrent(updatedUsers);

    // Save transaction
    const user = updatedUsers.find(u => u.id === userId);
    const newTx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      userId,
      username: user ? user.username : 'Gamer',
      type: label,
      amount,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedTxs = [newTx, ...transactions];
    syncStorage('versa_transactions', updatedTxs, setTransactions);
  };

  const withdrawToBank = (bankDetails, coinAmount) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('Please sign in first.'));
        if (currentUser.coins < coinAmount) return reject(new Error('Insufficient coin balance.'));
        if (!bankDetails.routing || !bankDetails.account) return reject(new Error('Invalid bank routing or account details.'));

        // Subtract coins
        const updatedUsers = allUsers.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, coins: u.coins - coinAmount };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        // Add Transaction
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          username: currentUser.username,
          type: `Stripe Withdraw: Bank Account ending in *${bankDetails.account.slice(-4)}`,
          amount: -coinAmount,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedTxs = [newTx, ...transactions];
        syncStorage('versa_transactions', updatedTxs, setTransactions);

        // Complete Quest: if withdrawing
        const updatedQuests = quests.map(q => {
          if (q.id === 'q4') {
            return { ...q, completed: true };
          }
          return q;
        });
        syncStorage('versa_quests', updatedQuests, setQuests);

        resolve();
      }, 800);
    });
  };

  // MATCH ARENA ACTIONS
  const createMatch = (title, gameId, wager, playersMax) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('Please sign in first.'));
        if (currentUser.coins < wager) return reject(new Error('Insufficient balance to wage in this arena.'));

        const game = INITIAL_GAMES.find(g => g.id === gameId);
        const newMatch = {
          id: 'm_' + Math.random().toString(36).substr(2, 9),
          title,
          gameId,
          gameName: game ? game.name : 'Unknown Game',
          wager: parseInt(wager),
          hostId: currentUser.id,
          hostName: currentUser.username,
          playersMax: parseInt(playersMax),
          playersJoined: [currentUser.id],
          status: 'open',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today'
        };

        // Subtract Wager
        const updatedUsers = allUsers.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, coins: u.coins - parseInt(wager) };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        // Add Transaction
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          username: currentUser.username,
          type: `Wager Deposit: Created ${newMatch.title}`,
          amount: -parseInt(wager),
          date: new Date().toISOString().split('T')[0]
        };
        const updatedTxs = [newTx, ...transactions];
        syncStorage('versa_transactions', updatedTxs, setTransactions);

        // Add Match
        const updatedMatches = [newMatch, ...matches];
        syncStorage('versa_matches', updatedMatches, setMatches);

        // Completed quest First Blood
        const updatedQuests = quests.map(q => {
          if (q.id === 'q1') {
            return { ...q, completed: true };
          }
          return q;
        });
        syncStorage('versa_quests', updatedQuests, setQuests);

        resolve(newMatch);
      }, 500);
    });
  };

  const joinMatch = (matchId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('Please sign in first.'));
        
        const match = matches.find(m => m.id === matchId);
        if (!match) return reject(new Error('Match not found.'));
        if (match.status !== 'open') return reject(new Error('This wager room is already full or running.'));
        if (match.playersJoined.includes(currentUser.id)) return reject(new Error('You have already joined this match.'));
        if (currentUser.coins < match.wager) return reject(new Error('Insufficient balance to meet this match wager.'));

        // Deduct coin wager
        const updatedUsers = allUsers.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, coins: u.coins - match.wager };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        // Add Transaction
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          username: currentUser.username,
          type: `Wager Entry: Joined ${match.title}`,
          amount: -match.wager,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedTxs = [newTx, ...transactions];
        syncStorage('versa_transactions', updatedTxs, setTransactions);

        // Join match
        const updatedMatches = matches.map(m => {
          if (m.id === matchId) {
            const players = [...m.playersJoined, currentUser.id];
            return {
              ...m,
              playersJoined: players,
              status: players.length >= m.playersMax ? 'active' : 'open'
            };
          }
          return m;
        });
        syncStorage('versa_matches', updatedMatches, setMatches);

        resolve();
      }, 500);
    });
  };

  const declareWinner = (matchId, winnerUserId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const match = matches.find(m => m.id === matchId);
        if (!match) return reject(new Error('Match not found.'));
        if (match.status === 'completed') return reject(new Error('This match wager has already been settled.'));

        const totalPrizePool = match.wager * match.playersJoined.length;
        const winner = allUsers.find(u => u.id === winnerUserId);
        if (!winner) return reject(new Error('Winner user not found.'));

        // Award prize pool to winner
        const updatedUsers = allUsers.map(u => {
          if (u.id === winnerUserId) {
            return {
              ...u,
              coins: u.coins + totalPrizePool,
              wins: u.wins + 1,
              streak: u.streak + 1
            };
          }
          // Record losses for participants who did not win
          if (match.playersJoined.includes(u.id) && u.id !== winnerUserId) {
            return {
              ...u,
              losses: u.losses + 1,
              streak: 0
            };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        // Set match as completed
        const updatedMatches = matches.map(m => {
          if (m.id === matchId) {
            return { ...m, status: 'completed', winnerId: winnerUserId, winnerName: winner.username };
          }
          return m;
        });
        syncStorage('versa_matches', updatedMatches, setMatches);

        // Add Transaction for Winner
        const newTx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          userId: winnerUserId,
          username: winner.username,
          type: `Wager Settled: Won Match ${match.title}`,
          amount: totalPrizePool,
          date: new Date().toISOString().split('T')[0]
        };
        const updatedTxs = [newTx, ...transactions];
        syncStorage('versa_transactions', updatedTxs, setTransactions);

        // Quest Victory check
        const questCheckUsers = updatedUsers.find(u => u.id === winnerUserId);
        if (questCheckUsers && questCheckUsers.wins >= 2) {
          const updatedQuests = quests.map(q => {
            if (q.id === 'q2') {
              return { ...q, completed: true };
            }
            return q;
          });
          syncStorage('versa_quests', updatedQuests, setQuests);
        }

        resolve();
      }, 500);
    });
  };

  // TEAMS ACTIONS
  const createTeam = (name, logoUrl) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('Please sign in first.'));
        if (teams.some(t => t.name.toLowerCase() === name.toLowerCase())) {
          return reject(new Error('Team / Guild name already registered.'));
        }

        const newTeam = {
          id: 't_' + Math.random().toString(36).substr(2, 9),
          name,
          ownerId: currentUser.id,
          members: [currentUser.username],
          rewardScore: 50, // Starts at 50, goes up with games
          logo: logoUrl || 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=200&auto=format&fit=crop',
          matchesCount: 0
        };

        const updatedTeams = [...teams, newTeam];
        syncStorage('versa_teams', updatedTeams, setTeams);

        // Link user to union
        const updatedUsers = allUsers.map(u => {
          if (u.id === currentUser.id) {
            return { ...u, union: name };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        resolve(newTeam);
      }, 500);
    });
  };

  const inviteTeammate = (teamId, targetGamerTag) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const targetUser = allUsers.find(u => u.username.toLowerCase() === targetGamerTag.toLowerCase());
        if (!targetUser) return reject(new Error('Target gamer tag not found on VERSA.'));

        const team = teams.find(t => t.id === teamId);
        if (!team) return reject(new Error('Team not found.'));
        if (team.members.length >= 10) return reject(new Error('This team has reached the 10 member limit.'));
        if (team.members.includes(targetUser.username)) return reject(new Error('Gamer is already on this team.'));

        const updatedTeams = teams.map(t => {
          if (t.id === teamId) {
            return {
              ...t,
              members: [...t.members, targetUser.username]
            };
          }
          return t;
        });
        syncStorage('versa_teams', updatedTeams, setTeams);

        // Update target user union score
        const updatedUsers = allUsers.map(u => {
          if (u.id === targetUser.id) {
            return { ...u, union: team.name };
          }
          return u;
        });
        syncUsersAndCurrent(updatedUsers);

        resolve();
      }, 400);
    });
  };

  // QUEST REWARD ACTIONS
  const claimReward = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;
    if (!currentUser) return;

    // Add coins
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, coins: u.coins + quest.reward };
      }
      return u;
    });
    syncUsersAndCurrent(updatedUsers);

    // Update quest claimed status
    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return { ...q, claimed: true };
      }
      return q;
    });
    syncStorage('versa_quests', updatedQuests, setQuests);

    // Add transaction ledger
    const newTx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      username: currentUser.username,
      type: `Quest Earned: ${quest.title}`,
      amount: quest.reward,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedTxs = [newTx, ...transactions];
    syncStorage('versa_transactions', updatedTxs, setTransactions);
  };

  // COMMUNITY FEED ACTIONS
  const addFeedPost = (content, tags, mediaUrl = '') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!currentUser) return reject(new Error('Please sign in first.'));

        const newPost = {
          id: 'f_' + Math.random().toString(36).substr(2, 9),
          username: currentUser.username,
          avatar: currentUser.avatar,
          content,
          tags: tags.map(t => t.replace('#', '')),
          likes: 0,
          likedBy: [],
          comments: [],
          mediaUrl,
          time: 'Just now'
        };

        const updatedFeed = [newPost, ...feed];
        syncStorage('versa_feed', updatedFeed, setFeed);
        resolve();
      }, 400);
    });
  };

  const likeFeedPost = (postId) => {
    if (!currentUser) return;
    const updatedFeed = feed.map(p => {
      if (p.id === postId) {
        const alreadyLiked = p.likedBy?.includes(currentUser.id);
        const likedBy = alreadyLiked 
          ? p.likedBy.filter(id => id !== currentUser.id)
          : [...(p.likedBy || []), currentUser.id];
        return {
          ...p,
          likedBy,
          likes: likedBy.length
        };
      }
      return p;
    });
    syncStorage('versa_feed', updatedFeed, setFeed);
  };

  const addPostComment = (postId, text) => {
    if (!currentUser) return;
    const updatedFeed = feed.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), { username: currentUser.username, text }]
        };
      }
      return p;
    });
    syncStorage('versa_feed', updatedFeed, setFeed);
  };

  return (
    <FirebaseContext.Provider value={{
      currentUser,
      matches,
      teams,
      quests,
      feed,
      transactions,
      allUsers,
      games: INITIAL_GAMES,
      isLoading,
      signUp,
      signIn,
      signOut,
      loginWithOAuth,
      updateProfile,
      addCoins,
      withdrawToBank,
      createMatch,
      joinMatch,
      declareWinner,
      createTeam,
      inviteTeammate,
      claimReward,
      addFeedPost,
      likeFeedPost,
      addPostComment
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
