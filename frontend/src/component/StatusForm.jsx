import React, { useState, useContext } from 'react';
import { StatusContext } from './StatusContext';
import '../styling/StatusForm.css';

const StatusForm = ({ userId }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addStatus } = useContext(StatusContext);
  
  const MAX_LENGTH = 280;
  const remainingChars = MAX_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20 && remainingChars >= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || isOverLimit) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/statuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ userId, content }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create status');
      }
  
      const { newStatus } = await response.json();
      console.log('New status response:', newStatus);
      addStatus(newStatus);
      setContent('');
    } catch (error) {
      console.error('Error creating status:', error);
      alert('Failed to post. Please try again!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="status-form">
      <div className="form-header">
        <h3>✍️ Share Your Thoughts</h3>
      </div>
      <div className="textarea-wrapper">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          className={`status-textarea ${isOverLimit ? 'error' : ''}`}
          disabled={isSubmitting}
        ></textarea>
        <div className="char-counter-wrapper">
          <div className={`char-counter ${isOverLimit ? 'over-limit' : isNearLimit ? 'near-limit' : ''}`}>
            <svg className="counter-circle" width="24" height="24">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="#e1e8ed"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke={isOverLimit ? '#e0245e' : isNearLimit ? '#ffad1f' : '#1da1f2'}
                strokeWidth="2"
                strokeDasharray={`${(1 - Math.abs(remainingChars) / MAX_LENGTH) * 62.83} 62.83`}
                transform="rotate(-90 12 12)"
                className="counter-progress"
              />
            </svg>
            {(isNearLimit || isOverLimit) && (
              <span className="char-count">{remainingChars}</span>
            )}
          </div>
        </div>
      </div>
      <div className="form-footer">
        <div className="form-actions">
          <button 
            type="button" 
            className="emoji-button"
            title="Add Emoji (Coming Soon)"
          >
            😊
          </button>
          <button 
            type="button" 
            className="media-button"
            title="Add Image (Coming Soon)"
          >
            📷
          </button>
        </div>
        <button 
          type="submit" 
          className="submit-button"
          disabled={!content.trim() || isOverLimit || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-small"></span>
              Posting...
            </>
          ) : (
            'Post'
          )}
        </button>
      </div>
    </form>
  );
};

export default StatusForm;
