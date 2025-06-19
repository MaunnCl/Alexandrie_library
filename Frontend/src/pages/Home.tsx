import { Link } from 'react-router-dom';
import { FaVideo, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

function Home() {
  return (
    <>
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Alexandria</h1>
          <p>Your library of on‑demand medical congress videos and events.</p>
          <Link to="/congress" className="cta-button">Explore the Library</Link>
        </div>
      </section>

      <section className="features">
        <Link to="/categories" className="feature-card">
          <FaVideo />
          <h3>Video Library</h3>
          <p>Browse sessions by specialty and watch when it suits you.</p>
        </Link>
        <Link to="/congress" className="feature-card">
          <FaCalendarCheck />
          <h3>Congress Directory</h3>
          <p>Find schedules and details for upcoming meetings.</p>
        </Link>
        <Link to="/categories" className="feature-card">
          <FaUsers />
          <h3>Expert Speakers</h3>
          <p>Discover sessions featuring renowned professionals.</p>
        </Link>
      </section>
      <Footer />
    </>
  );
}

export default Home;
