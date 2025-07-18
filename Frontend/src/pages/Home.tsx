import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaVideo, FaCalendarCheck, FaUsers } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('introShown');

    if (!alreadyShown) {
      setShowIntro(true);
      sessionStorage.setItem('introShown', 'true');
    }
  }, []);

  return (
    <>
      {showIntro && (
        <motion.div
          className="intro-overlay"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          onAnimationComplete={() => setShowIntro(false)}
        >
          <div className="intro-content">
            <motion.div
              className="soone-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src="/SoOne.png" alt="SoOne Logo" className="intro-logo soone" />
              <motion.h1
                className="intro-text font-bold text-3xl text-secondary"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              >
                <span className="text-primary">So</span> One
              </motion.h1>
            </motion.div>

            <motion.img
              src="/logo_transparent.png"
              alt="Alexandria"
              className="intro-logo alexandria"
              initial={{ scale: 0.8, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: -10 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 1.4 }}
            />
          </div>
        </motion.div>
      )}

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
