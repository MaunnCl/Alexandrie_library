import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/SpeakersList.css';

interface Orator {
  id: number;
  name: string;
  picture?: string;
  country: string;
  city: string;
}

function SpeakersList() {
  const [speakers, setSpeakers] = useState<Orator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const res = await api.get<Orator[]>('/api/orators');
        setSpeakers(res.data || []);
      } catch (err) {
        console.error('Error loading speakers', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSpeakers();
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-container speakers-page">
        <h1 className="page-title">Expert Speakers</h1>
        {loading ? (
          <p className="loading-text">Loading…</p>
        ) : speakers.length > 0 ? (
          <div className="speakers-grid">
            {speakers.map(sp => (
              <Link key={sp.id} to={`/speaker/${sp.id}`} className="speaker-card">
                <div className="speaker-img-wrapper">
                  <img
                    src={sp.picture || '/avatar.png'}
                    alt={sp.name}
                    className="speaker-img"
                  />
                </div>
                <h3 className="speaker-name">{sp.name}</h3>
                <p className="speaker-meta">
                  {sp.city}, {sp.country}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No speakers found.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default SpeakersList;
