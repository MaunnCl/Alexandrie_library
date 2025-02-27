import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiShield,
  FiSettings,
  FiBell,
  FiCreditCard,
  FiEdit3,
  FiSave
} from 'react-icons/fi';
import '../styles/Profile.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Personal Info');

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          console.error('No token or userId found in localStorage');
          navigate('/login');
          return;
        }

        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User data received:", response.data);
        setUser(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login');
      }
    }

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.error('No token or userId found in localStorage');
        return;
      }

      await axios.put(`/api/users/${userId}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("User data updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleBackToHome = () => navigate('/');

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page-container">
      <aside className="sidebar">
        <div className="user-top">
          <img src={user.avatar || '/avatar.png'} alt="Profile" className="avatar" />
          <h3>{user.firstname} {user.lastname}</h3>
          <small>{user.email}</small>
        </div>

        <nav className="sidebar-nav">
          {['Personal Info', 'Security', 'Notifications', 'Billing'].map((label) => (
            <button
              key={label}
              className={`nav-item ${activeCategory === label ? 'active' : ''}`}
              onClick={() => setActiveCategory(label)}
            >
              {label === 'Personal Info' && <FiSettings />}
              {label === 'Security' && <FiShield />}
              {label === 'Notifications' && <FiBell />}
              {label === 'Billing' && <FiCreditCard />}
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-actions">
          {isEditing ? (
            <button onClick={handleSave} className="save-btn">
              <FiSave />
              <span>Save</span>
            </button>
          ) : (
            <button onClick={handleEdit} className="edit-btn">
              <FiEdit3 />
              <span>Edit</span>
            </button>
          )}
          <button onClick={handleBackToHome} className="back-btn">
            Back to Home
          </button>
        </div>
      </aside>

      <main className="profile-main">
        {activeCategory === 'Personal Info' && (
          <div className="section-content">
            <h2>Personal Info</h2>
            <label>First Name</label>
            <input type="text" name="firstname" disabled={!isEditing} value={user.firstname} onChange={handleChange} />
            <label>Last Name</label>
            <input type="text" name="lastname" disabled={!isEditing} value={user.lastname} onChange={handleChange} />
            <label>Email</label>
            <input type="email" name="email" disabled value={user.email} />
            <label>Phone</label>
            <input type="text" name="phone" disabled={!isEditing} value={user.phone || ''} onChange={handleChange} />
            <label>Location</label>
            <input type="text" name="location" disabled={!isEditing} value={user.location || ''} onChange={handleChange} />
            <label>Birth Date</label>
            <input type="date" name="birthDate" disabled={!isEditing} value={user.birthDate || ''} onChange={handleChange} />
          </div>
        )}

        {activeCategory === 'Security' && (
          <div className="section-content">
            <h2>Security</h2>
            <p>Manage your password, 2FA, and other security settings here.</p>
            <button className="profile-btn" disabled={!isEditing}>Change Password</button>
            <button className="profile-btn" disabled={!isEditing}>Enable Two-Factor Authentication</button>
          </div>
        )}

        {activeCategory === 'Notifications' && (
          <div className="section-content">
            <h2>Notifications</h2>
            <p>Configure how you want to receive notifications from us.</p>
            <div className="notifications-options">
              <label><input type="checkbox" disabled={!isEditing} defaultChecked /> Email Notifications</label>
              <label><input type="checkbox" disabled={!isEditing} /> SMS Notifications</label>
              <label><input type="checkbox" disabled={!isEditing} /> Push Notifications</label>
            </div>
          </div>
        )}

        {activeCategory === 'Billing' && (
          <div className="section-content">
            <h2>Billing</h2>
            <p>Your payment methods and subscription details go here.</p>
            <div className="billing-info">
              <p>Current Plan: <strong>Premium</strong></p>
              <p>Card on File: **** **** **** 1234</p>
              <button className="profile-btn" disabled={!isEditing}>Update Payment Method</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
