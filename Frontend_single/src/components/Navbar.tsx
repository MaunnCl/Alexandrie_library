import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import api from '../lib/api';
import SearchBar from './SearchBar';
import '../styles/Navbar.css';

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('No userId found in localStorage');
          navigate('/login');
          return;
        }

        const userResponse = await api.get(`/api/users/${userId}`);
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate('/login');
      }
    }

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => setProfileOpen((prev) => !prev);

  const handleNavigate = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
        <SearchBar />
      </nav>

      {user && (
        <div className="profile-section" ref={profileRef}>
          <div className="profile-toggle" onClick={handleProfileClick}>
            <img
              src="https://via.placeholder.com/40x40?text=👤"
              alt="User Avatar"
              className="avatar"
            />
            <span className="profile-name">{user.firstname} {user.lastname}</span>
            <span className="arrow-down">▼</span>
          </div>

          {profileOpen && (
            <div className="profile-card animate-slideDown">
              <div className="profile-card-header">
                <img
                  src="https://via.placeholder.com/60x60?text=👤"
                  alt="User Avatar"
                  className="avatar"
                />
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
