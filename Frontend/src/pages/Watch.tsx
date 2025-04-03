import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import '../styles/Watch.css';
import siteLogo from '/logo.png';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VideoTest() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const videoTitle = searchParams.get('title');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await axios.get(`http://localhost:8080/api/contents/title/${videoTitle}`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const video = response.data[0];
          setVideoUrl(video.url);
          setVideoName(video.title);
          setVideoThumbnail(
            video.video_thumbnail_url || video.orator_image_url || 'https://via.placeholder.com/800x450?text=Video+Loading'
          );
        } else {
          console.error('Format de réponse invalide:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la vidéo depuis le backend:', error);
      } finally {
        setLoading(false);
      }
    }

    if (videoTitle) {
      fetchVideo();
    }
  }, [videoTitle]);

  const displayTitle = videoName.replace(/\.mp4$/i, '') || 'Vidéo';

  return (
    <div className="video-test-page">
      {loading ? (
        <p className="loading-text">Loading video...</p>
      ) : videoUrl ? (
        <div className="video-and-logo">
          <div className="video-wrapper">
            <VideoPlayer
              src={videoUrl}
              poster={videoThumbnail}
              title={displayTitle}
            />
          </div>

          <div className="logo-section">
            <img
              src={siteLogo}
              alt="Site Logo"
              className="site-logo"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <p className="video-name">{displayTitle}</p>
          </div>
        </div>
      ) : (
        <p className="error-text">Failed to load video.</p>
      )}
    </div>
  );
}

export default VideoTest;
