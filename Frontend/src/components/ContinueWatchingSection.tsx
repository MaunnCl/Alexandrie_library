import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GridSection.css';

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
  
  const carouselContainerRef = useRef<HTMLDivElement>(null);

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

  const handlePrev = () => {
    if (carouselContainerRef.current) {
      carouselContainerRef.current.scrollBy({
        left: -carouselContainerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleNext = () => {
    if (carouselContainerRef.current) {
      carouselContainerRef.current.scrollBy({
        left: carouselContainerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Continue Watching</h2>
      <hr className="section-divider" />

      <div className="carousel-container" ref={carouselContainerRef}>
        <div className="carousel-track">
          {videos.map((v, index) => (
            <div
              key={index}
              className="carousel-slide"
              onClick={() => handleClick(v)}
            >
              <div className="image-container">
                <img
                  src={v.thumbnail || 'https://via.placeholder.com/800x450'}
                  alt={v.title}
                />
                <div className="progress-bar-overlay">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(v.progress / v.duration) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <h3>{v.title}</h3>
              <p>Watched {(v.progress / v.duration * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-button prev" onClick={handlePrev}>
        &lsaquo;
      </button>
      <button className="carousel-button next" onClick={handleNext}>
        &rsaquo;
      </button>
    </div>
  );
}

export default ContinueWatchingSection;
