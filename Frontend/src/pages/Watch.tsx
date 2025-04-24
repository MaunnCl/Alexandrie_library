import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Watch.css';
import siteLogo from '/logo.png';

interface Segment { frame: string }
interface Orator  { name: string; picture: string }

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ─────────── state ─────────── */
  const [videoUrl,  setVideoUrl]  = useState<string | null>(null);
  const [title,     setTitle]     = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [segments,  setSegments]  = useState<Segment[]>([]);
  const [orator,    setOrator]    = useState<Orator | null>(null);

  const [loading,   setLoading]   = useState(true);
  const [previews,  setPreviews]  = useState<Record<string, string>>({});
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  const [showVid,   setShowVid]   = useState(false);      // remplace la grille

  /* ─────────── fetch méta ─────────── */
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: c } = await axios.get(`/api/contents/${id}`);
        setVideoUrl(c.url);
        setTitle(c.title);
        setThumbnail(
          c.video_thumbnail_url || 'https://placehold.co/1280x720?text=Loading…'
        );

        if (c.orator_id) {
          const { data: o } = await axios.get(`/api/orators/${c.orator_id}`);
          setOrator({ name: o.name, picture: o.picture });
        }

        if (c.timeStamp) {
          const txt = (await axios.get<string>(c.timeStamp)).data;
          const nums = txt.match(/set\s+vide2\s*=\s*\[([\s\S]+?)\]/i)
            ?.[1].match(/\d+/g) ?? [];

          const starts = nums.slice(0, -1).map(Number);     // on retire la fin
          setSegments(starts.map(f => ({ frame: f.toString() })));
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  /* ─────────── miniatures ─────────── */
  useEffect(() => {
    if (!videoUrl || segments.length === 0) return;
    let cancel = false;

    const buildThumbs = async () => {
      const vid = document.createElement('video');
      vid.src = videoUrl;
      vid.crossOrigin = 'anonymous';
      await new Promise(r => vid.addEventListener('loadeddata', r, { once: true }));

      const cvs = document.createElement('canvas');
      cvs.width = vid.videoWidth / 4;
      cvs.height = vid.videoHeight / 4;
      const ctx = cvs.getContext('2d')!;
      const map: Record<string, string> = {};
      const OFFSET = 20;

      for (const { frame } of segments) {
        const t = (+frame + OFFSET) / 60;
        await new Promise<void>(res => {
          const h = () => { vid.removeEventListener('seeked', h); res(); };
          vid.addEventListener('seeked', h);
          vid.currentTime = t;
        });
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        map[frame] = cvs.toDataURL('image/jpeg');
        if (cancel) return;
      }
      if (!cancel) setPreviews(map);
    };
    buildThumbs();
    return () => { cancel = true; };
  }, [videoUrl, segments]);

  /* ─────────── seek différé ─────────── */
  useEffect(() => {
    if (pendingSeek == null || !videoRef.current) return;
    const v = videoRef.current;
    const apply = () => { v.currentTime = pendingSeek; setPendingSeek(null); };
    if (v.readyState >= 1) apply();
    else v.addEventListener('loadedmetadata', apply, { once: true });
  }, [pendingSeek]);

  /* ─────────── actions ─────────── */
  const jump = (f: string) => {
    const t = (+f + 3) / 60;
    if (videoRef.current) videoRef.current.currentTime = t;
    else setPendingSeek(t);
    setShowVid(true);
  };
  const cleanTitle = title.replace(/\.mp4$/i, '');

  /* ─────────── rendu ─────────── */
  return (
    <div className="watch-page">
      <header className="watch-header">
        <img
          src={siteLogo} alt="Logo"
          className="watch-logo cursor-pointer"
          onClick={() => navigate('/')}
        />
      </header>

      {loading ? (
        <p className="loading-text">Chargement…</p>
      ) : (
        <section className="watch-layout">
          {/* colonne gauche */}
          {orator && (
            <aside className="left-pane">
              <img src={orator.picture} alt={orator.name} className="orator-img" />
              <h3 className="orator-name">{orator.name}</h3>
            </aside>
          )}

          {/* colonne droite : grille OU vidéo */}
          <main className="right-pane">
            {!showVid ? (
              <>
                <h3>Choisissez un moment</h3>
                <ul className="frame-list grid grid-cols-3 gap-2">
                  {segments.map(({ frame }) => (
                    <li key={frame} className="frame-item" onClick={() => jump(frame)}>
                      {previews[frame]
                        ? <img src={previews[frame]} alt={`slide ${frame}`}
                               className="w-full object-cover rounded-lg shadow" />
                        : <div className="w-full aspect-video bg-gray-300 animate-pulse rounded-lg" />}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <video
                  ref={videoRef}
                  controls
                  preload="metadata"
                  poster={thumbnail}
                  className="w-full rounded-lg border border-gray-600"
                >
                  <source src={videoUrl!} type="video/mp4" />
                </video>
                <h2 className="video-title mt-2 text-center">{cleanTitle}</h2>
              </>
            )}
          </main>
        </section>
      )}
    </div>
  );
}
