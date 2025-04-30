import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  FiShield,
  FiSettings,
  FiBell,
  FiCreditCard,
  FiEdit3,
  FiSave,
  FiUser
} from 'react-icons/fi';
import '../styles/Profile.css';

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Personal Info');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          console.error('No token or userId found in localStorage');
          navigate('/login');
          return;
        }
        const userResponse = await api.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = Array.isArray(userResponse.data)
          ? userResponse.data[0]
          : userResponse.data;

        setUser(userData);

        const profileResponse = await api.get(`/api/profiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const profileData = Array.isArray(profileResponse.data)
          ? profileResponse.data[0]
          : profileResponse.data;

        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching user or profile data:', error);
        navigate('/login');
      }
    }

    fetchData();
  }, [navigate]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        console.error('No token or userId found in localStorage');
        return;
      }

      if (activeCategory === 'Personal Info') {
        await api.put(`/api/users/${userId}`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (activeCategory === 'Profile') {
        await api.put(`/api/profiles/${userId}`, profile, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleBackToHome = () => navigate('/');

  if (!user || !profile) {
    return <p>Loading profile...</p>;
  }

  const categories = [
    { label: 'Personal Info', icon: <FiSettings /> },
    { label: 'Profile', icon: <FiUser /> },
    { label: 'Security', icon: <FiShield /> },
    { label: 'Notifications', icon: <FiBell /> },
    { label: 'Billing', icon: <FiCreditCard /> },
  ];

  return (
    <div className="profile-page-container">
      <aside className="sidebar">
        <div className="user-top">
          <img
            src={profile?.profile_picture}
            alt="Profile"
            className="avatar"
          />
          <h3>
            {user.firstname} {user.lastname}
          </h3>
          <small>{user.email}</small>
        </div>

        <nav className="sidebar-nav">
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              className={`nav-item ${activeCategory === label ? 'active' : ''}`}
              onClick={() => setActiveCategory(label)}
            >
              {icon}
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
            <input
              type="text"
              name="firstname"
              disabled={!isEditing}
              value={user.firstname || ''}
              onChange={handleUserChange}
            />
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              disabled={!isEditing}
              value={user.lastname || ''}
              onChange={handleUserChange}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              disabled={true}
              value={user.email || ''}
            />
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              disabled={!isEditing}
              value={user.phone || ''}
              onChange={handleUserChange}
            />
            <label>Location</label>
            <input
              type="text"
              name="location"
              disabled={!isEditing}
              value={user.location || ''}
              onChange={handleUserChange}
            />
            <label>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              disabled={!isEditing}
              value={user.birthDate || ''}
              onChange={handleUserChange}
            />
          </div>
        )}

        {activeCategory === 'Profile' && (
          <div className="section-content">
            <h2>User Profile</h2>
            <label>Bio</label>
            <textarea
              name="bio"
              rows={4}
              disabled={!isEditing}
              value={profile.bio || ''}
              onChange={handleProfileChange}
            />
            <label>Preferences</label>
            <input
              type="text"
              name="preferences"
              disabled={!isEditing}
              value={profile.preferences || ''}
              onChange={handleProfileChange}
            />
          </div>
        )}

        {activeCategory === 'Security' && (
          <div className="section-content">
            <h2>Security</h2>
            <p>Manage your password, 2FA, and other security settings here.</p>
            <button className="profile-btn" disabled={!isEditing}>
              Change Password
            </button>
            <button className="profile-btn" disabled={!isEditing}>
              Enable Two-Factor Authentication
            </button>
          </div>
        )}

        {activeCategory === 'Notifications' && (
          <div className="section-content">
            <h2>Notifications</h2>
            <p>Configure how you want to receive notifications from us.</p>
            <div className="notifications-options">
              <label>
                <input type="checkbox" disabled={!isEditing} defaultChecked />
                Email Notifications
              </label>
              <label>
                <input type="checkbox" disabled={!isEditing} />
                SMS Notifications
              </label>
              <label>
                <input type="checkbox" disabled={!isEditing} />
                Push Notifications
              </label>
            </div>
          </div>
        )}

        {activeCategory === 'Billing' && (
          <div className="section-content">
            <h2>Billing</h2>
            <p>Your payment methods and subscription details go here.</p>
            <div className="billing-info">
              <p>
                Current Plan: <strong>Premium</strong>
              </p>
              <p>Card on File: **** **** **** 1234</p>
              <button className="profile-btn" disabled={!isEditing}>
                Update Payment Method
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
