import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Watch.css';
import siteLogo from '/logo.png';

function Watch() {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await axios.get(`/api/contents/${id}`);
        const video = response.data;

        setVideoUrl(video.url);
        setTitle(video.title);
        setThumbnail(
          video.video_thumbnail_url || 'https://via.placeholder.com/1280x720?text=Loading...'
        );
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchVideo();
  }, [id]);

  const cleanTitle = title.replace(/\.mp4$/i, '');

  return (
    <div className="watch-page">
      <div className="watch-header">
        <img src={siteLogo} alt="Logo" onClick={() => navigate('/')} className="watch-logo" />
      </div>

      {loading ? (
        <p className="loading-text">Chargement de la vidéo…</p>
      ) : videoUrl ? (
        <div className="video-container">
          <video controls poster={thumbnail}>
            <source src={videoUrl} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
          <h2 className="video-title">{cleanTitle}</h2>
        </div>
      ) : (
        <p className="error-text">Vidéo introuvable.</p>
      )}
    </div>
  );
}

export default Watch;
