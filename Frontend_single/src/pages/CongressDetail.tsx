import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/CongressDetail.css';

interface Congress {
    id: number;
    name: string;
    key: string;
    session_ids: number[];
    date: string;
    city: string;
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
    picture: string;
    content_ids: number[];
    country: string;
    city: string;
}

type Category = 'SESSIONS' | 'SPEAKERS' | 'TOPICS';

function CongressDetail() {
    const { id } = useParams();
    const [congress, setCongress] = useState<Congress | null>(null);
    const [sessions, setSessions] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState<Category | null>(null);
    const [orators, setOrators] = useState<Orator[]>([]);
    const [selectedOrator, setSelectedOrator] = useState<Orator | null>(null);
    const [topicSessions, setTopicSessions] = useState<{ id: number; name: string; content_ids: number[] }[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function fetchAll() {
            try {
                const [cg, allContents, allOrators, allTopics] = await Promise.all([
                    api.get<Congress>(`/api/congress/${id}`),
                    api.get<Content[]>(`/api/contents`),
                    api.get<Orator[]>(`/api/orators`),
                    api.get(`/api/sessions`)
                ]);

                const congressData = cg.data;
                setCongress(congressData);

                const filteredSessions = allContents.data.filter((s: Content) =>
                    congressData.session_ids.includes(s.id)
                );
                setSessions(filteredSessions);
                setOrators(allOrators.data);
                setTopicSessions(allTopics.data);
            } catch (err) {
                console.error('Error loading congress', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, [id]);

    const getOratorName = (id: number) => {
        return orators.find(o => o.id === id)?.name || `Speaker #${id}`;
    };

    const getSessionsForTopic = (topicId: number): Content[] => {
        const topic = topicSessions.find(t => t.id === topicId);
        if (!topic || !Array.isArray(topic.content_ids)) return [];
        return sessions.filter(s => topic.content_ids.includes(s.id));
    };

    return (
        <>
            <Navbar />

            <motion.div
                className="detail-page page-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {loading && <p className="loading-text">Loading…</p>}

                {congress && (
                    <>
                        <h1 className="detail-title">{congress.name}</h1>
                        <p className="detail-meta">
                            {new Date(congress.date).toLocaleDateString()} — {congress.city}
                        </p>

                        <div className="cat-grid">
                            {(['SESSIONS', 'SPEAKERS', 'TOPICS'] as Category[]).map(cat => (
                                <motion.div
                                    key={cat}
                                    className={`cat-card ${active === cat ? 'active' : ''}`}
                                    onClick={() => setActive(active === cat ? null : cat)}
                                    whileHover={{ scale: 1.05 }}
                                    layoutId={cat}
                                >
                                    <h3>{cat}</h3>
                                </motion.div>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {active === 'SESSIONS' && (
                                <motion.div
                                    key="sessions-info"
                                    className="cat-content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {Array.isArray(sessions) && sessions.length > 0 ? (
                                        <ul className="session-list">
                                            {sessions.map(s => (
                                                <li key={s.id} className="session-item">
                                                    <div
                                                        className="session-box speaker-box"
                                                        onClick={() => navigate(`/watch/${s.id}`, { state: { from: location.pathname } }) }
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="speaker-info">
                                                            <div className="speaker-details">
                                                                <p className="speaker-label">{s.title}</p>
                                                                <p className="speaker-location">{getOratorName(s.orator_id)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No sessions available</p>
                                    )}
                                </motion.div>
                            )}

                            {active === 'SPEAKERS' && (
                                <motion.div
                                    key="speakers"
                                    className="cat-content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {!selectedOrator ? (
                                        <ul className="session-list">
                                            {Array.isArray(orators) && orators.length > 0 ? (
                                                orators.map(o => (
                                                    <li key={o.id} className="session-item">
                                                        <div
                                                            className="session-box speaker-box"
                                                            onClick={() => setSelectedOrator(o)}
                                                        >
                                                            <div className="speaker-info">
                                                                <div className="speaker-details">
                                                                    <p className="speaker-name">{o.name}</p>
                                                                    <p className="speaker-location">{o.city}, {o.country}</p>
                                                                </div>
                                                                <img src={o.picture} alt={o.name} className="speaker-image" />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No orators available</p>
                                            )}
                                        </ul>
                                    ) : (
                                        <>
                                            <button className="back-button" onClick={() => setSelectedOrator(null)}>
                                                ← Back to speakers
                                            </button>
                                            <ul className="session-list">
                                                {sessions
                                                    .filter(s => s.orator_id === selectedOrator.id)
                                                    .map(s => (
                                                        <li key={s.id} className="session-item">
                                                            <div
                                                                className="session-box"
                                                                onClick={() => navigate(`/watch/${s.id}`, { state: { from: location.pathname } }) }
                                                            >
                                                                <p className="session-title">{s.title}</p>
                                                                <p className="speaker-name">{selectedOrator.name}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {active === 'TOPICS' && (
                                <motion.div
                                    key="topics"
                                    className="cat-content"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {!selectedTopic ? (
                                        <ul className="session-list">
                                            {Array.isArray(topicSessions) && topicSessions.length > 0 ? (
                                                topicSessions.map(topic => (
                                                    <li key={topic.id} className="session-item">
                                                        <div
                                                            className="session-box speaker-box"
                                                            onClick={() => setSelectedTopic(topic.id)}
                                                        >
                                                            <div className="speaker-info">
                                                                <span className="speaker-label">{topic.name}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No topics available</p>
                                            )}
                                        </ul>
                                    ) : (
                                        <>
                                            <button className="back-button" onClick={() => setSelectedTopic(null)}>
                                                ← Back to topics
                                            </button>
                                            <ul className="session-list">
                                                {getSessionsForTopic(selectedTopic).map(s => (
                                                    <li key={s.id} className="session-item">
                                                        <div
                                                            className="session-box"
                                                            onClick={() => navigate(`/watch/${s.id}`, { state: { from: location.pathname } }) }
                                                        >
                                                            <p className="session-title">{s.title}</p>
                                                            <p className="speaker-name">{getOratorName(s.orator_id)}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </motion.div>

            <Footer />
        </>
    );
}

export default CongressDetail;
