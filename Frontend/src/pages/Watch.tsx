import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import '../styles/Watch.css';
import siteLogo from '/logo.png';

interface Segment { frame: string }
interface Orator {
  name: string;
  picture: string;
  city?: string;
  country?: string;
}

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [orator, setOrator] = useState<Orator | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [videoDur, setVideoDur] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [showVid, setShowVid] = useState(false);
  const [pendingSeek, setPending] = useState<number | null>(null);

  const [curIdx, setCurIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const fmtDur = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h
      ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      : `${m}:${sec.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    (async () => {
      const { data: c } = await api.get(`/api/contents/${id}`);
      setVideoUrl(c.url);
      setTitle(c.title.replace(/\.mp4$/i, ''));
      setThumbnail(c.video_thumbnail_url ||
        'https://placehold.co/1280x720?text=Loading…');

      if (c.orator_id) {
        const { data: o } = await api.get(`/api/orators/${c.orator_id}`);
        setOrator({
          name: o.name,
          picture: o.picture,
          city: o.city,
          country: o.country
        });
      }

      if (c.timeStamp) {
        try {
          const response = await api.get(c.timeStamp);
          if (typeof response.data === 'string') {
            const txt = response.data;
            const nums = txt.match(/set\s+vide2\s*=\s*\[([\s\S]+?)\]/i)
              ?.[1].match(/\d+/g) ?? [];
            const starts = nums.slice(0, -1).map(Number);
            setSegments(starts.map(f => ({ frame: f.toString() })));
          } else if (Array.isArray(response.data)) {
            const data = response.data;
            const frames = data.map(d => Math.floor(d.start * 60));
            setSegments(frames.map(f => ({ frame: f.toString() })));
          }
        } catch (e) {
          console.error('Erreur lors du chargement des timestamps :', e);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!videoUrl || segments.length === 0) return;
    let cancel = false;
    (async () => {
      const vid = document.createElement('video');
      vid.src = videoUrl; vid.crossOrigin = 'anonymous';
      await new Promise(r => vid.addEventListener('loadeddata', r, { once: true }));
      const cvs = document.createElement('canvas');
      cvs.width = vid.videoWidth / 4;
      cvs.height = vid.videoHeight / 4;
      const ctx = cvs.getContext('2d')!;
      const map: Record<string, string> = {};
      for (const { frame } of segments) {
        const t = (+frame + 20) / 60;
        await new Promise<void>(res => {
          const h = () => { vid.removeEventListener('seeked', h); res(); };
          vid.addEventListener('seeked', h); vid.currentTime = t;
        });
        ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        map[frame] = cvs.toDataURL('image/jpeg');
        if (cancel) return;
      }
      if (!cancel) setPreviews(map);
    })();
    return () => { cancel = true };
  }, [videoUrl, segments]);

  const seekIdx = (i: number) => {
    const t = (+segments[i].frame + 3) / 60;
    if (videoRef.current) videoRef.current.currentTime = t;
    else setPending(t);
    setCurIdx(i); setShowVid(true);
  };
  const prev = () => curIdx > 0 && seekIdx(curIdx - 1);
  const next = () => curIdx < segments.length - 1 && seekIdx(curIdx + 1);
  const toggle = () => videoRef.current?.paused ? videoRef.current.play()
    : videoRef.current?.pause();
  const toGrid = () => setShowVid(false);

  const updateProgress = () => {
    if (!videoRef.current || !barRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration || 0) * 100;
    barRef.current.style.setProperty('--pct', `${pct}%`);
  };
  const clickProgress = (e: React.MouseEvent) => {
    if (!videoRef.current || !barRef.current) return;
    const { left, width } = barRef.current.getBoundingClientRect();
    const ratio = (e.clientX - left) / width;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.volume = volume;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setVideoDur(v.duration);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', updateProgress);
    v.addEventListener('loadedmetadata', onLoaded);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', updateProgress);
      v.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [showVid, volume]);

  useEffect(() => {
    if (!showVid || !videoRef.current) return;
    const v = videoRef.current;
    if (pendingSeek != null) v.currentTime = pendingSeek;
    const start = () => v.play().catch(() => { });
    v.readyState >= 2 ? start() :
      v.addEventListener('canplay', start, { once: true });
  }, [showVid]);

  return (
    <div className="watch-page">
      <header className="watch-header glass">
        <img src={siteLogo} className="watch-logo" onClick={() => navigate('/')} />
        <h1 className="session-title neon">{title}</h1>
      </header>

      {loading
        ? <p className="loading-text">Chargement…</p>
        : (
          <section className="watch-layout">
            {orator && (
              <aside className="left-pane card">
                <img src={orator.picture} className="orator-img" />
                <h3 className="orator-name">{orator.name}</h3>

                <div className="controls-bar">
                  <button className="ctrl" onClick={prev}
                    disabled={!showVid || curIdx <= 0}>⏮</button>
                  <button className="ctrl" onClick={toggle} disabled={!showVid}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button className="ctrl" onClick={next}
                    disabled={!showVid || curIdx >= segments.length - 1}>⏭</button>
                  <button className="ctrl" onClick={toGrid}>🖼</button>
                </div>

                <input type="range" className="volume" min="0" max="1" step="0.05"
                  value={volume}
                  onChange={e => {
                    const v = +e.target.value; setVolume(v);
                    if (videoRef.current) videoRef.current.volume = v;
                  }} />
              </aside>
            )}

            <main className="right-pane">
              {!showVid ? (
                <>
                  <h3 className="neon sub">Choisissez un moment</h3>
                  <ul className="frame-grid">
                    {segments.map(({ frame }, i) => (
                      <li key={frame} className="thumb-wrapper"
                        onClick={() => seekIdx(i)}>
                        {previews[frame]
                          ? <img src={previews[frame]} className="thumb" />
                          : <div className="placeholder" />}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <video ref={videoRef} poster={thumbnail}
                    playsInline className="video-player glow">
                    <source src={videoUrl!} type="video/mp4" />
                  </video>

                  <div className="progress-bar" ref={barRef}
                    onClick={clickProgress}>
                    <div className="progress-fill" />
                  </div>

                  <div className="video-info-bar">
                    <p><strong>{title}</strong></p>
                    {orator && (
                      <p>{orator.name} — {orator.city}, {orator.country}</p>
                    )}
                    <p>
                      Durée : {fmtDur(videoDur)} — Slide {curIdx + 1}/{segments.length}
                    </p>
                  </div>
                </>
              )}
            </main>
          </section>
        )}
    </div>
  );
}
