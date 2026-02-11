import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Topics.css';

interface Session {
  id: number;
  name: string;
  content_ids: number[];
}

interface Content {
  id: number;
  title: string;
  orator_id: number;
  url: string;
}

interface Orator {
  id: number;
  name: string;
}

function Topics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<Session | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [orators, setOrators] = useState<Orator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionRes, allContents, allOrators] = await Promise.all([
          api.get<Session>(`/api/sessions/${id}`),
          api.get<Content[]>('/api/contents'),
          api.get<Orator[]>('/api/orators'),
        ]);

        const sessionData = sessionRes.data;
        setSession(sessionData);

        const topicContents = (allContents.data || []).filter((c: Content) =>
          sessionData.content_ids?.includes(c.id)
        );
        setContents(topicContents);

        const oratorIds = new Set(topicContents.map((c: Content) => c.orator_id));
        const relevantOrators = (allOrators.data || []).filter((o: Orator) =>
          oratorIds.has(o.id)
        );
        setOrators(relevantOrators);
      } catch (err) {
        console.error('Error loading topic', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const getOratorName = (oratorId: number) =>
    orators.find((o) => o.id === oratorId)?.name || `Speaker #${oratorId}`;

  return (
    <>
      <Navbar />

      <motion.div
        className="topics-page page-container"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {loading && <p className="loading-text">Loading…</p>}

        {!loading && !session && <p className="loading-text">Topic not found.</p>}

        {session && (
          <>
            <h1 className="topics-title">{session.name}</h1>
            <p className="topics-meta">
              {contents.length} session{contents.length !== 1 ? 's' : ''}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key="topic-contents"
                className="topics-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {contents.length > 0 ? (
                  <ul className="session-list">
                    {contents.map((c) => (
                      <li key={c.id} className="session-item">
                        <div
                          className="session-box speaker-box"
                          onClick={() =>
                            navigate(`/watch/${c.id}`, {
                              state: { from: location.pathname },
                            })
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="speaker-info">
                            <div className="speaker-details">
                              <p className="speaker-label">{c.title}</p>
                              <p className="speaker-location">
                                {getOratorName(c.orator_id)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No sessions available for this topic.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </motion.div>

      <Footer />
    </>
  );
}

export default Topics;
