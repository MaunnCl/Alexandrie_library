import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome } from "react-icons/fa";
import "../styles/SidebarMenu.css";

function SidebarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="hamburger-btn" onClick={() => setOpen(true)}>
        <FaBars size={20} />
      </button>

      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <div className="sidebar" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setOpen(false)}>
            <FaTimes size={20} />
          </button>
          <nav className="sidebar-links">
            <Link to="/" onClick={() => setOpen(false)}>
              <FaHome style={{ marginRight: "8px" }} /> Home
            </Link>
            <Link to="/congress" onClick={() => setOpen(false)}>
              📅 Congress
            </Link>
            <Link to="/speakers" onClick={() => setOpen(false)}>
              👤 Speakers
            </Link>
            <Link to="/history" onClick={() => setOpen(false)}>
              🕒 History
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default SidebarMenu;
