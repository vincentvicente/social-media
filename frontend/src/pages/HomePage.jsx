import React, { useEffect, useState } from 'react';
import '../styling/HomePage.css';

const Homepage = () => {
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/statuses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statuses.');
      }

      const data = await response.json();
      setStatuses(data);
      setError('');
    } catch (err) {
      console.error('Error fetching statuses:', err);
      setError(err.message);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (statusId) => {
    if (!isLoggedIn) {
      alert('Please login to like posts!');
      return;
    }

    try {
      const response = await fetch(`/api/statuses/${statusId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like status');
      }

      const data = await response.json();
      
      // 更新本地状态
      setStatuses(prevStatuses =>
        prevStatuses.map(status =>
          status._id === statusId
            ? { ...status, likesCount: data.likesCount, likes: data.likes }
            : status
        )
      );
    } catch (err) {
      console.error('Error liking status:', err);
      alert('Failed to like. Please try again!');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return 'just now';
  };

  const getAvatarColor = (username) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredStatuses = statuses.filter(status =>
    status.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    status.userId?.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <div className="homepage-header-section">
        <h2 className="homepage-header">🌟 Latest Updates</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search posts or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <ul className="status-list">
        {filteredStatuses.length > 0 ? (
          filteredStatuses.map((status) => {
            const isLiked = status.likes?.includes(currentUserId);
            return (
              <li key={status._id} className="status-item">
                <div className="status-avatar" style={{ backgroundColor: getAvatarColor(status.userId?.username || 'U') }}>
                  {(status.userId?.username || 'U')[0].toUpperCase()}
                </div>
                <div className="status-content-wrapper">
                  <div className="status-item-header">
                    <div className="user-info">
                      <strong className="username">{status.userId?.username || 'Unknown User'}</strong>
                      <small className="timestamp">{getTimeAgo(status.createdAt)}</small>
                    </div>
                  </div>
                  <div className="status-item-content">
                    {status.content}
                  </div>
                  <div className="status-item-footer">
                    <button 
                      className={`like-button ${isLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(status._id)}
                      disabled={!isLoggedIn}
                    >
                      <span className="like-icon">{isLiked ? '❤️' : '🤍'}</span>
                      <span className="like-count">{status.likesCount || 0}</span>
                    </button>
                    <div className="status-stats">
                      <span>💬 0</span>
                      <span>🔄 0</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <div className="no-statuses">
            <p>😔 {searchTerm ? 'No matching posts found' : 'No posts yet'}</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Homepage;
