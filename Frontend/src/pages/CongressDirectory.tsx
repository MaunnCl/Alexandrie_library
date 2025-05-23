import { useEffect, useState } from 'react';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/CongressDirectory.css';

interface Congress {
  id: number;
  name: string;
  key: string;
  picture: string | null;
  date: string;
  city: string;
  session_ids: number[];
}

function CongressDirectory() {
  const [congresses, setCongresses] = useState<Congress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCongresses() {
      try {
        const res = await api.get<Congress[]>('/api/congress');
        setCongresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Erreur de récupération des congrès', err);
        setCongresses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCongresses();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-container">
        <main className="congress-section">
          <h1 className="section-title">Congress Directory</h1>
          <hr className="section-divider large-gap" />

          {loading && <p className="loading-text">Loading…</p>}

          <div className="congress-grid">
            {Array.isArray(congresses) && congresses.length > 0 ? (
              congresses.map((c, i) => (
                <motion.div
                  key={c.id}
                  className="congress-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/congress/${c.id}`)}
                >
                  <div className="card-body">
                    <h3>{c.name}</h3>
                    <p className="meta">
                      {new Date(c.date).toLocaleDateString()} — {c.city}
                    </p>
                    <p className="sessions">
                      {c.session_ids?.length > 0 ? `${c.session_ids.length} sessions` : 'No sessions available'}
                    </p>
                    {c.picture && <img src={c.picture} alt={c.name} className="congress-image" />}
                  </div>
                </motion.div>
              ))
            ) : (
              !loading && <p className="loading-text">No congresses available.</p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default CongressDirectory;
