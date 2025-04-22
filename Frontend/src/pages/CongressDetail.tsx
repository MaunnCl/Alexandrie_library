import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

    useEffect(() => {
        async function fetchAll() {
            try {
                const [cg, allContents, allOrators] = await Promise.all([
                    axios.get<Congress>(`/api/congress/${id}`),
                    axios.get<Content[]>(`/api/contents`),
                    axios.get<Orator[]>(`/api/orators`)
                ]);

                setCongress(cg.data);
                setSessions(allContents.data);
                setOrators(allOrators.data);
            } catch (err) {
                console.error('Error loading congress', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, [id]);

    const speakers = useMemo(() => {
        const map = new Map<number, string>();
        sessions.forEach(s => {
            if (!map.has(s.orator_id)) {
                map.set(s.orator_id, `Speaker #${s.orator_id}`);
            }
        });
        return Array.from(map.values());
    }, [sessions]);

    const topics = useMemo(() => {
        const set = new Set<string>();
        sessions.forEach(s => {
            try {
                const path = decodeURIComponent(new URL(s.url).pathname);
                const [, , topic] = path.split('/');
                if (topic) set.add(topic.replace(/_/g, ' '));
            } catch { }
        });
        return Array.from(set);
    }, [sessions]);

    const getOratorName = (id: number) => {
        return orators.find(o => o.id === id)?.name || `Speaker #${id}`;
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
                                    <ul className="session-list">
                                        {sessions.map(s => (
                                            <li key={s.id} className="session-item">
                                                <div
                                                    className="session-box"
                                                    onClick={() => window.open(s.url, '_blank')}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <p className="session-title">{s.title}</p>
                                                    <p className="speaker-name">{getOratorName(s.orator_id)}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
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
                                    <ul>
                                        {speakers.map((sp, i) => (
                                            <li key={i}>{sp}</li>
                                        ))}
                                    </ul>
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
                                    <ul>
                                        {topics.map((t, i) => (
                                            <li key={i}>{t}</li>
                                        ))}
                                    </ul>
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
