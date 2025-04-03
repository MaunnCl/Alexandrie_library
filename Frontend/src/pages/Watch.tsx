import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import '../styles/Watch.css';
import siteLogo from '/logo.png';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VideoTest() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const videoTitle = searchParams.get('title');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await axios.post(
          'http://localhost:8080/api/contents',
          { title: videoTitle },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (Array.isArray(response.data) && response.data.length > 0) {
          const video = response.data[0];
          setVideoUrl(video.url);
          setVideoName(video.title);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching video from backend:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
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
              poster="https://via.placeholder.com/800x450?text=Video+Loading"
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
