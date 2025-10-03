import React, { useEffect, useState, useContext } from 'react';
import { StatusContext } from '../component/StatusContext';
import StatusForm from '../component/StatusForm';
import { useNavigate } from 'react-router-dom';
import '../styling/UserPage.css';

const UserPage = ({ isLoggedIn }) => {
  const { statuses, setStatuses } = useContext(StatusContext);
  const [user, setUser] = useState(null);
  const [description, setDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    if (!token || !storedUserId) {
      setError('You must log in to view this page.');
      setLoading(false);
      return;
    }
  
    // 获取用户数据
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${storedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data.user);
        setDescription(data.user.description || '');
        setStatuses(data.statuses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleSaveDescription = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/description`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update description');
      }

      setIsEditingDescription(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEdit = (statusId) => {
    const newContent = prompt('Edit your status:');
    if (newContent) {
      fetch(`http://localhost:3000/api/statuses/${statusId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: newContent }),
      })
        .then((res) => {
          console.log('API Response:', res.status); // 调试
          if (!res.ok) {
            throw new Error('Failed to update status');
          }
          return res.json();
        })
        .then((updatedStatus) => {
          console.log('Updated Status:', updatedStatus); // 调试
          setStatuses((prevStatuses) =>
            prevStatuses.map((status) =>
              status._id === updatedStatus.status._id ? updatedStatus.status : status
            )
          );
        })
        .catch((error) => {
          console.error('Failed to update status:', error);
          alert('Failed to update status. Please try again later.');
        });
    }
  };

  const handleDelete = (statusId) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      fetch(`/api/statuses/${statusId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setStatuses((prevStatuses) =>
              prevStatuses.filter((status) => status._id !== statusId)
            );
          }
        })
        .catch((error) => console.error('Failed to delete status:', error));
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        {!isLoggedIn && <button onClick={() => navigate('/login')}>Go to Login</button>}
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-info">
        <h1 className="user-header">{user?.username}</h1>
        <p className="user-joined">Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
        <p className="description">{description || 'No description provided'}</p>
        {isLoggedIn && userId === user?._id && (
          <button onClick={() => setIsEditingDescription(!isEditingDescription)}>
            {isEditingDescription ? 'Cancel Edit' : 'Edit Description'}
          </button>
        )}
        {isEditingDescription && (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button onClick={handleSaveDescription}>Save</button>
          </>
        )}
      </div>

      <div className="status-section">
        {isLoggedIn && userId === user?._id && <StatusForm userId={userId} />}
        <h2 className="status-header">Status Updates</h2>
        <ul className="status-list">
          {statuses.map((status) => (
            <li className="status-item" key={status._id}>
              <div className="status-content">
                <p>{status.content}</p>
                <small>{new Date(status.createdAt).toLocaleString()}</small>
              </div>
              <div className="status-actions">
                <button onClick={() => handleEdit(status._id)}>Edit</button>
                <button onClick={() => handleDelete(status._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPage;
