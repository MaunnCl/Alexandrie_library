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

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [segments, setSegments] = useState<Segment[]>([]);
  const [orator, setOrator] = useState<Orator | null>(null);
  const [showVid, setShowVid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState<Record<string, string>>({});

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

    const seekTo = (video: HTMLVideoElement, time: number) =>
      new Promise<void>(resolve => {
        const handler = () => {
          video.removeEventListener('seeked', handler);
          resolve();
        };
        video.addEventListener('seeked', handler);
        video.currentTime = time;
      });

    (async () => {
      const offVideo = document.createElement('video');
      offVideo.src = videoUrl;
      offVideo.crossOrigin = 'anonymous';
      offVideo.preload = 'auto';

      await new Promise<void>(resolve => {
        offVideo.addEventListener('loadeddata', () => resolve(), { once: true });
      });

      const canvas = document.createElement('canvas');
      canvas.width = offVideo.videoWidth / 4;
      canvas.height = offVideo.videoHeight / 4;
      const ctx = canvas.getContext('2d');

      const thumbMap: Record<string, string> = {};

      const PREVIEW_OFFSET = 20;          // +20 frames ≃ 0,33 s

      for (const seg of segments) {
        const t = (Number(seg.frame) + PREVIEW_OFFSET) / 60;
        await seekTo(offVideo, t);
        ctx.drawImage(offVideo, 0, 0, canvas.width, canvas.height);

        thumbMap[seg.frame] = canvas.toDataURL('image/jpeg');
      }

      if (!cancelled) setPreviews(thumbMap);
    })();

    return () => {
      cancelled = true;
    };
  }, [videoUrl, segments]);

  const jumpToFrame = (f: string) => {
    const target = (Number(f) + 3) / 60;
    videoRef.current!.currentTime = target;
    setShowVid(true);
  };

  const cleanTitle = title.replace(/\.mp4$/i, '');

  return (
    <div className="watch-page">
      <div className="watch-header">
        <img
          src={siteLogo}
          alt="Logo"
          onClick={() => navigate('/')}
          className="watch-logo cursor-pointer"
        />
      </div>

      {loading ? (
        <p className="loading-text">Chargement…</p>
      ) : (
        <div className="watch-layout">
          <div className="left-pane">
            {orator && (
              <>
                <img
                  src={orator.picture}
                  alt={orator.name}
                  className="orator-img"
                />
                <h3 className="orator-name">{orator.name}</h3>
              </>
            )}
          </div>

          <div className="right-pane">
            <h3>Choisissez un moment</h3>
            <ul className="frame-list grid grid-cols-3 gap-2">
              {segments.map(({ frame }, i) => (
                <li
                  key={i}
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
          </div>
        </div>
      )}

      {showVid && videoUrl && (
        <div className="video-container mt-6">
          <video ref={videoRef} controls poster={thumbnail} className="w-full">
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

export default Watch;
