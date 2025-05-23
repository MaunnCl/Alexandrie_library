import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../lib/api';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          await api.post("/api/logout", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        navigate("/login");
      }
    }

    handleLogout();
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
