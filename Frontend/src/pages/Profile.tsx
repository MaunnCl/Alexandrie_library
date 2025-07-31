import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../lib/api";
import "../styles/Profile.css";
import enzopic from "../assets/enzo.jpg";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    async function fetchUser() {
      try {
        const res = await api.get(`/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
    <div className="profile-page">
      {user ? (
        <div className="profile-page-card">  {/* <-- changé ici */}
          <img
            src={enzopic}
            alt="User Avatar"
            className="profile-avatar"
          />
          <h2>{user.firstname} {user.lastname}</h2>
          <p className="email">{user.email}</p>
          <button className="edit-btn">Edit Profile</button>
        </div>
      ) : (
        <p className="loading">Loading profile...</p>
      )}
    </div>
      <Footer />
    </>
  );
}

export default Profile;
