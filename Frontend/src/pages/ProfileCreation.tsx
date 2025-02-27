// src/pages/ProfileCreation.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ProfileCreation.css';

function ProfileCreation() {
  const navigate = useNavigate();
  const location = useLocation();

  const { planName } = (location.state as { planName?: string }) || {};

  const placeholderImages = [
    'https://via.placeholder.com/150?text=Avatar+1',
    'https://via.placeholder.com/150?text=Avatar+2',
    'https://via.placeholder.com/150?text=Avatar+3',
    'https://via.placeholder.com/150?text=Avatar+4'
  ];

  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');

  const handleSelectPlaceholder = (image: string) => {
    setPhotoURL(image);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!photoURL || !bio || !preferences) {
      setError('Please fill in all fields (including selecting/providing a photo) to complete your profile.');
      return;
    }

    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planName,
          photoURL,
          bio,
          preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error creating profile');
      }

      navigate('/dashboard');
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
                className={`placeholder-image ${photoURL === img ? 'selected' : ''}`}
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
