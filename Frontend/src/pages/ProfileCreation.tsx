// src/pages/ProfileCreation.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ProfileCreation.css';

function ProfileCreation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { planName } = (location.state as { planName?: string }) || {};

  const placeholderImages = [
    '/avatar.png',
    'https://via.placeholder.com/150?text=Avatar+2',
    'https://via.placeholder.com/150?text=Avatar+3',
    'https://via.placeholder.com/150?text=Avatar+4'
  ];

  const [profile_picture, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');

  const storedUserId = localStorage.getItem('userId'); 
  const user_id = storedUserId ? parseInt(storedUserId, 10) : null;

  const handleSelectPlaceholder = (image: string) => {
    setPhotoURL(image);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!profile_picture || !bio || !preferences) {
      setError('Please fill in all fields (including selecting/providing a photo).');
      return;
    }

    if (!user_id) {
      setError('No valid user ID found. Please log in or register first.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id,
          profile_picture,
          bio,
          preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating profile');
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    }
  };

  return (
    <div className="profile-creation-page">
      <div className="profile-creation-container">
        <h1 className="profile-creation-title">Complete Your Profile</h1>
        {planName && <p>You are on the <strong>{planName}</strong> plan.</p>}

        {error && <p className="profile-creation-error">{error}</p>}

        <form className="profile-creation-form" onSubmit={handleProfileSubmit}>
          <label htmlFor="photoURL">Choose a Profile Photo</label>

          <div className="placeholder-images">
            {placeholderImages.map((img) => (
              <div
                key={img}
                className={`placeholder-image ${profile_picture === img ? 'selected' : ''}`}
                onClick={() => handleSelectPlaceholder(img)}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))}
          </div>

          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a bit about yourself..."
          />

          <label htmlFor="preferences">Preferences</label>
          <input
            type="text"
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="E.g., favorite genres, interests, etc."
          />

          <button type="submit" className="profile-creation-button">
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileCreation;
