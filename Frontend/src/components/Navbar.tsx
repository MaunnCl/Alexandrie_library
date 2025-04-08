import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Navbar.css';

function Navbar() {
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

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

        const userResponse = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = Array.isArray(userResponse.data)
          ? userResponse.data[0]
          : userResponse.data;

        setUser(userData);

        const profileResponse = await axios.get(`/api/profiles/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = Array.isArray(profileResponse.data)
          ? profileResponse.data[0]
          : profileResponse.data;

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching user or profile data:", error);
        navigate('/login');
      }
    }

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  const handleProfileClick = () => setProfileOpen((prev) => !prev);

  const handleNavigate = (path) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo-link">
        <img src="/logo_transparent.png" alt="Logo" className="logo" />
      </Link>
      <nav className="nav-links">
        <Link to="/categories" className="nav-link">Categories</Link>
      </nav>


      {/* <div className="search-wrapper">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div> */}

      {user && profile && (
        <div className="profile-section" ref={profileRef}>
          <div className="profile-toggle" onClick={handleProfileClick}>
            <img src={profile.profile_picture} alt="User Avatar" className="avatar" />
            <span className="profile-name">{user.firstname} {user.lastname}</span>
            <span className="arrow-down">▼</span>
          </div>

          {profileOpen && (
            <div className="profile-card animate-slideDown">
              <div className="profile-card-header">
                <img src={profile.profile_picture} alt="User Avatar" className="avatar" />
                <div>
                  <h4>{user.firstname} {user.lastname}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
              <hr />
              <button onClick={() => handleNavigate('/profile')}>
                <FiUser />
                <span>My Profile</span>
              </button>
              <button onClick={() => handleNavigate('/settings')}>
                <FiSettings />
                <span>Settings</span>
              </button>
              <button onClick={handleLogout}>
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
