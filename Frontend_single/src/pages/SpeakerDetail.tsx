import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/SpeakerDetail.css';

interface Orator {
  id: number;
  name: string;
  picture: string;
  content_ids: number[];
  country: string;
  city: string;
}

interface Content {
  id: number;
  title: string;
  orator_id: number;
}

function SpeakerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [orator, setOrator] = useState<Orator | null>(null);
  const [sessions, setSessions] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [o, allContents] = await Promise.all([
          api.get<Orator>(`/api/orators/${id}`),
          api.get<Content[]>(`/api/contents`),
        ]);
        setOrator(o.data);
        const vids = (allContents.data || []).filter(c => c.orator_id === Number(id));
        setSessions(vids);
      } catch (err) {
        console.error('Error loading speaker', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="detail-page page-container">
        {loading ? (
          <p className="loading-text">Loading…</p>
        ) : (
          orator && (
            <>
              <h1 className="detail-title">{orator.name}</h1>
              <p className="detail-meta">
                {orator.city}, {orator.country}
              </p>
              <ul className="session-list">
                {sessions.length > 0 ? (
                  sessions.map(s => (
                    <li key={s.id} className="session-item">
                      <div
                        className="session-box"
                        onClick={() =>
                          navigate(`/watch/${s.id}`, { state: { from: location.pathname } })
                        }
                      >
                        <p className="session-title">{s.title}</p>
                        <p className="speaker-name">{orator.name}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No videos available.</p>
                )}
              </ul>
            </>
          )
        )}
      </div>
      <Footer />
    </>
  );
}

export default SpeakerDetail;
