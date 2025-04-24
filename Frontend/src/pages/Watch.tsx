import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Watch.css';
import siteLogo from '/logo.png';

interface Segment {
  frame: string;
}
interface Orator {
  name: string;
  picture: string;
}

export default function Watch() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const videoRef      = useRef<HTMLVideoElement>(null);

  const [videoUrl,  setVideoUrl]  = useState<string | null>(null);
  const [title,     setTitle]     = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [segments,  setSegments]  = useState<Segment[]>([]);
  const [orator,    setOrator]    = useState<Orator | null>(null);

  const [loading,   setLoading]   = useState(true);
  const [previews,  setPreviews]  = useState<Record<string, string>>({});
  const [showVid,   setShowVid]   = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);   // NEW

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: content } = await axios.get(`/api/contents/${id}`);

        setVideoUrl(content.url);
        setTitle(content.title);
        setThumbnail(
          content.video_thumbnail_url ||
          'https://placehold.co/1280x720?text=Loading…'
        );

        if (content.orator_id) {
          const { data: o } = await axios.get(`/api/orators/${content.orator_id}`);
          setOrator({ name: o.name, picture: o.picture });
        }

        if (content.timeStamp) {
          const txt = (await axios.get<string>(content.timeStamp)).data;
          const numbers = txt.match(/set\s+vide2\s*=\s*\[([\s\S]+?)\]/i)
            ?.[1].match(/\d+/g) ?? [];

          const starts = numbers.slice(0, -1).map(Number);

          setSegments(starts.map(f => ({ frame: f.toString() })));
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    if (!videoUrl || segments.length === 0) return;

    let cancelled = false;

    const seekTo = (v: HTMLVideoElement, t: number) =>
      new Promise<void>(resolve => {
        const handler = () => {
          v.removeEventListener('seeked', handler);
          resolve();
        };
        v.addEventListener('seeked', handler);
        v.currentTime = t;
      });

    (async () => {
      const off = document.createElement('video');
      off.src = videoUrl;
      off.crossOrigin = 'anonymous';
      off.preload = 'auto';

      await new Promise<void>(r => off.addEventListener('loadeddata', () => r(), { once: true }));

      const canvas = document.createElement('canvas');
      canvas.width  = off.videoWidth  / 4;
      canvas.height = off.videoHeight / 4;
      const ctx = canvas.getContext('2d')!;

      const map: Record<string, string> = {};
      const PREVIEW_OFFSET = 20;

      for (const { frame } of segments) {
        const t = (Number(frame) + PREVIEW_OFFSET) / 60;
        await seekTo(off, t);
        ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
        map[frame] = canvas.toDataURL('image/jpeg');
        if (cancelled) return;
      }

      if (!cancelled) setPreviews(map);
    })();

    return () => { cancelled = true; };
  }, [videoUrl, segments]);

  useEffect(() => {
    if (pendingSeek == null || !videoRef.current) return;

    const vid = videoRef.current;

    const applySeek = () => {
      vid.currentTime = pendingSeek;
      setPendingSeek(null);
    };

    if (vid.readyState >= 1) {
      applySeek();
    } else {
      vid.addEventListener('loadedmetadata', applySeek, { once: true });
      return () => vid.removeEventListener('loadedmetadata', applySeek);
    }
  }, [pendingSeek, showVid]);

  const jumpToFrame = (f: string) => {
    const target = (Number(f) + 3) / 60;
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    } else {
      setPendingSeek(target);
    }
    setShowVid(true);
  };

  const cleanTitle = title.replace(/\.mp4$/i, '');

  return (
    <div className="watch-page">
      <header className="watch-header">
        <img
          src={siteLogo}
          alt="Logo"
          onClick={() => navigate('/')}
          className="watch-logo cursor-pointer"
        />
      </header>

      {loading ? (
        <p className="loading-text">Chargement…</p>
      ) : (
        <section className="watch-layout">
          {/* orateur */}
          {orator && (
            <aside className="left-pane">
              <img src={orator.picture} alt={orator.name} className="orator-img" />
              <h3 className="orator-name">{orator.name}</h3>
            </aside>
          )}

          <main className="right-pane">
            <h3>Choisissez un moment</h3>
            <ul className="frame-list grid grid-cols-3 gap-2">
              {segments.map(({ frame }) => (
                <li
                  key={frame}
                  className="frame-item cursor-pointer hover:opacity-80"
                  onClick={() => jumpToFrame(frame)}
                >
                  {previews[frame] ? (
                    <img
                      src={previews[frame]}
                      alt={`Prévisualisation ${frame}`}
                      className="w-full h-auto object-cover rounded-lg shadow"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-gray-300 animate-pulse rounded-lg" />
                  )}
                </li>
              ))}
            </ul>
          </main>
        </section>
      )}

      {showVid && videoUrl && (
        <div className="video-container mt-6">
          <video
            ref={videoRef}
            controls
            preload="metadata"
            poster={thumbnail}
            className="w-full"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <h2 className="video-title mt-2 text-center text-xl font-semibold">
            {cleanTitle}
          </h2>
        </div>
      )}
    </div>
  );
}
