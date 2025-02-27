import React, { FormEvent, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import '../styles/Navbar.css';

function Navbar() {
  const [query, setQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  const handleProfileClick = () => {
    setProfileOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <nav className="nav-links left-nav">
        <Link to="/">Home</Link>
        <Link to="/live">Live Events</Link>
        <Link to="/categories">Categories</Link>
      </nav>

      <Link to="/" className="logo-link">
        <img src="/logo_transparent.png" alt="Logo" className="logo" />
      </Link>

      <div className="search-wrapper">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="profile-section" ref={profileRef}>
        <div className="profile-toggle" onClick={handleProfileClick}>
          <img src="/avatar.png" alt="User Avatar" className="avatar" />
          <span className="profile-name">John Doe</span>
          <span className="arrow-down">▼</span>
        </div>

        {profileOpen && (
          <div className="profile-card animate-slideDown">
            <div className="profile-card-header">
              <img src="/avatar.png" alt="User Avatar" className="avatar" />
              <div>
                <h4>John Doe</h4>
                <p>john.doe@example.com</p>
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
    </header>
  );
}

export default Navbar;