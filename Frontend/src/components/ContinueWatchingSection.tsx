import { useEffect, useState } from 'react';
import '../styles/GridSection.css';
import { useNavigate } from 'react-router-dom';

interface WatchedVideo {
  title: string;
  url: string;
  thumbnail: string;
  progress: number;
  duration: number;
}

function ContinueWatchingSection() {
  const [videos, setVideos] = useState<WatchedVideo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('watch-history') || '[]');
    const inProgressVideos = stored.filter(
      (v: WatchedVideo) => v.progress > 0 && v.progress < v.duration - 5
    );
    setVideos(inProgressVideos);
  }, []);

  const handleClick = (video: WatchedVideo) => {
    navigate(`/watch?title=${encodeURIComponent(video.title)}`);
  };

  if (videos.length === 0) return null;

  return (
    <div className="grid-section">
      <h2 className="section-title">Continue Watching</h2>
      <hr className="section-divider" />
      <div className="grid">
        {videos.map((v, index) => (
          <div key={index} className="grid-item" onClick={() => handleClick(v)}>
            <div className="image-container">
              <img
                src={v.thumbnail || 'https://via.placeholder.com/800x450'}
                alt={v.title}
              />
              <div className="progress-bar-overlay">
                <div
                  className="progress-fill"
                  style={{ width: `${(v.progress / v.duration) * 100}%` }}
                ></div>
              </div>
            </div>
            <h3>{v.title}</h3>
            <p>Watched {(v.progress / v.duration * 100).toFixed(0)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatchingSection;
