'use client';

import React, { useState } from 'react';
import { useFirebase } from '../lib/firebase';

export default function FeedPage() {
  const { currentUser, feed, addFeedPost, likeFeedPost, addPostComment } = useFirebase();

  // Create post states
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Comment form states
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentUser) {
      setErrorMsg('Please sign in to publish highlights.');
      return;
    }
    if (!content) {
      setErrorMsg('Highlight content description is mandatory.');
      return;
    }

    setLoading(true);
    try {
      // Parse tags
      const parsedTags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await addFeedPost(content, parsedTags, mediaUrl);
      setSuccessMsg('Highlight published successfully! Ready to collect likes.');
      setContent('');
      setTagsInput('');
      setMediaUrl('');
    } catch (err) {
      setErrorMsg('Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    addPostComment(postId, commentText.trim());
    setCommentText('');
  };

  const trendingTags = ['Clutch', 'Warzone', 'FC24', 'WinStreak', 'ApexPredator', 'MVP_Moment'];

  return (
    <div className="container" style={styles.feedContainer}>
      {/* Page Header */}
      <div style={styles.header}>
        <span className="neon-tag neon-tag-cyan">📢 Highlights Feed</span>
        <h1 style={styles.title}>COMMUNITY GAMEPLAY & MOMENTS</h1>
      </div>

      <div style={styles.grid} className="feed-grid">
        {/* LEFT COLUMN: COMPOSER AND TRENDING */}
        <div style={styles.leftCol} className="feed-left">
          {/* Post Composer card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>SHARE YOUR EPIC MOMENT</h3>
            {errorMsg && <div className="neon-tag-magenta" style={styles.formStatus}>{errorMsg}</div>}
            {successMsg && <div className="neon-tag-cyan" style={styles.formStatus}>{successMsg}</div>}

            <form onSubmit={handlePostSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Highlight Details</label>
                <textarea 
                  className="neon-input"
                  style={styles.textarea}
                  placeholder="e.g. Just wiped a squad singlehandedly! 🗡️🔥"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tags (Comma-separated)</label>
                <input 
                  type="text" 
                  className="neon-input"
                  placeholder="e.g. Clutch, Warzone, WinStreak"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mock Clip / Screenshot Image URL (Optional)</label>
                <input 
                  type="text" 
                  className="neon-input"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Publishing...' : '🚀 Broadcast Highlight'}
              </button>
            </form>
          </div>

          {/* Trending Tags card */}
          <div className="glass-card" style={styles.card}>
            <h3 style={styles.cardTitle}>TRENDING ARENA TAGS</h3>
            <div style={styles.tagCloud}>
              {trendingTags.map((tag) => (
                <button 
                  key={tag} 
                  onClick={() => setTagsInput(tagsInput ? `${tagsInput}, ${tag}` : tag)}
                  className="btn btn-secondary" 
                  style={styles.trendTag}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGHLIGHT FEED FLOW */}
        <div style={styles.rightCol} className="feed-right">
          <div style={styles.feedFlow}>
            {feed.map((post) => {
              const isLiked = currentUser ? post.likedBy?.includes(currentUser.id) : false;

              return (
                <div key={post.id} className="glass-panel" style={styles.postCard}>
                  {/* Post Header */}
                  <div style={styles.postHeader}>
                    <div style={styles.postAuthor}>
                      <span style={styles.authorAvatar}>{post.avatar || '🎮'}</span>
                      <div>
                        <h4 style={styles.authorName}>@{post.username}</h4>
                        <span style={styles.postTime}>{post.time}</span>
                      </div>
                    </div>
                    <span className="neon-tag neon-tag-blue" style={{ fontSize: '0.65rem' }}>MVP</span>
                  </div>

                  {/* Content details */}
                  <p style={styles.postContent}>{post.content}</p>

                  {/* Highlight Graphic if exists */}
                  {post.mediaUrl && (
                    <div style={styles.mediaContainer}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.mediaUrl} alt="Gameplay Highlight Screenshot" style={styles.mediaImage} />
                    </div>
                  )}

                  {/* Hash Tags */}
                  <div style={styles.postTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} style={styles.tagItem}>#{tag}</span>
                    ))}
                  </div>

                  {/* Interaction buttons */}
                  <div style={styles.postActions}>
                    <button 
                      onClick={() => likeFeedPost(post.id)}
                      style={{ 
                        ...styles.actionBtn, 
                        color: isLiked ? 'var(--accent-magenta)' : '#718096' 
                      }}
                    >
                      ❤️ <span style={styles.actionCount}>{post.likes} Likes</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      style={styles.actionBtn}
                    >
                      💬 <span style={styles.actionCount}>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {/* Comments Box drawer */}
                  {activeCommentPostId === post.id && (
                    <div style={styles.commentsDrawer} className="glass-card">
                      <div style={styles.commentsList}>
                        {post.comments.length === 0 ? (
                          <div style={styles.emptyComments}>No comments left yet. Write the first score!</div>
                        ) : (
                          post.comments.map((c, cIdx) => (
                            <div key={cIdx} style={styles.commentRow}>
                              <span style={styles.commentUser}>@{c.username}:</span>
                              <span style={styles.commentText}>{c.text}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {currentUser && (
                        <form onSubmit={(e) => handleCommentSubmit(e, post.id)} style={styles.commentForm}>
                          <input 
                            type="text" 
                            className="neon-input"
                            style={styles.commentInput}
                            placeholder="Add your review..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <button type="submit" className="btn btn-primary" style={styles.commentSendBtn}>
                            ⏎
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 960px) {
          .feed-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  feedContainer: {
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
  card: {
    background: 'rgba(10, 13, 20, 0.4)'
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '900',
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem'
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
  textarea: {
    height: '100px',
    resize: 'none',
    padding: '0.85rem'
  },
  submitBtn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '8px'
  },
  tagCloud: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem'
  },
  trendTag: {
    fontSize: '0.8rem',
    padding: '0.4rem 0.8rem',
    borderRadius: '16px'
  },
  // Right Column Highlight Feed
  rightCol: {},
  feedFlow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  postCard: {
    padding: '2rem'
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem'
  },
  postAuthor: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  authorAvatar: {
    fontSize: '1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '0.4rem',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  authorName: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff'
  },
  postTime: {
    fontSize: '0.75rem',
    color: '#718096'
  },
  postContent: {
    fontSize: '1.05rem',
    color: '#cbd5e0',
    lineHeight: '1.6',
    marginBottom: '1rem'
  },
  mediaContainer: {
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    marginBottom: '1rem',
    maxHeight: '260px',
    display: 'flex',
    alignItems: 'center'
  },
  mediaImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover'
  },
  postTags: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.25rem'
  },
  tagItem: {
    fontSize: '0.8rem',
    color: 'var(--accent-cyan)',
    fontWeight: '700'
  },
  postActions: {
    display: 'flex',
    gap: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
    paddingTop: '1rem'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: 0
  },
  actionCount: {
    fontWeight: '700'
  },
  // Comments Drawer
  commentsDrawer: {
    marginTop: '1.25rem',
    background: 'rgba(0, 0, 0, 0.25)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: 'none',
    transform: 'none'
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
  },
  emptyComments: {
    fontSize: '0.8rem',
    color: '#718096',
    textAlign: 'center',
    padding: '0.5rem'
  },
  commentRow: {
    fontSize: '0.85rem',
    lineHeight: '1.4'
  },
  commentUser: {
    fontWeight: '800',
    color: 'var(--accent-blue)',
    marginRight: '0.4rem'
  },
  commentText: {
    color: '#cbd5e0'
  },
  commentForm: {
    display: 'flex',
    gap: '0.5rem'
  },
  commentInput: {
    flex: 1,
    padding: '0.5rem 0.75rem',
    fontSize: '0.8rem',
    borderRadius: '6px'
  },
  commentSendBtn: {
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '900'
  }
};
