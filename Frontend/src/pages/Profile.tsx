import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShield,
  FiSettings,
  FiBell,
  FiCreditCard,
  FiEdit3,
  FiSave
} from 'react-icons/fi';
import '../styles/Profile.css';

interface User {
  avatar: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  birthDate: string;
  bio: string;
  location: string;
}

function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    avatar: '/avatar.png',
    name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe123',
    phone: '+123 456 7890',
    birthDate: '1990-05-14',
    bio: 'Passionate developer and tech enthusiast.',
    location: 'New York, USA',
  });

  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    { label: 'Personal Info', icon: <FiSettings /> },
    { label: 'Security', icon: <FiShield /> },
    { label: 'Notifications', icon: <FiBell /> },
    { label: 'Billing', icon: <FiCreditCard /> },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].label);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    // Add your save logic here (e.g., API call)
    setIsEditing(false);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeCategory) {
      case 'Personal Info':
        return (
          <div className="section-content">
            <h2>Personal Info</h2>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              disabled={!isEditing}
              value={user.name}
              onChange={handleChange}
            />

            <label>Username</label>
            <input
              type="text"
              name="username"
              disabled={!isEditing}
              value={user.username}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              disabled={!isEditing}
              value={user.email}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              disabled={!isEditing}
              value={user.phone}
              onChange={handleChange}
            />

            <label>Location</label>
            <input
              type="text"
              name="location"
              disabled={!isEditing}
              value={user.location}
              onChange={handleChange}
            />

            <label>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              disabled={!isEditing}
              value={user.birthDate}
              onChange={handleChange}
            />
          </div>
        );

      case 'Security':
        return (
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
        );

      case 'Notifications':
        return (
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
        );

      case 'Billing':
        return (
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="profile-page-container">
      <aside className="sidebar">
        <div className="user-top">
          <img src={user.avatar} alt="Profile" className="avatar" />
          <h3>{user.name}</h3>
          <small>{user.email}</small>
        </div>

        <nav className="sidebar-nav">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`nav-item ${activeCategory === cat.label ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.label)}
            >
              {cat.icon}
              <span>{cat.label}</span>
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

      <main className="profile-main">{renderContent()}</main>
    </div>
  );
}

export default ProfilePage;
