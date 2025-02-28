import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import '../styles/VideoTest.css';
import siteLogo from '/logo.png';

function VideoTest() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/contents?videoKey=Video-Bassez.mp4'
        );
        if (response.data && typeof response.data === 'string') {
          setVideoUrl(response.data);
          setVideoName('Video-Bassez.mp4');
        } else {
          console.error('Invalid video URL response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching video URL:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideoUrl();
  }, []);

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
              title={videoName}
            />
          </div>

          <div className="logo-section">
            <img src={siteLogo} alt="Site Logo" className="site-logo" />
            <p className="video-name">{videoName}</p>
          </div>
        </div>
      ) : (
        <p className="error-text">Failed to load video.</p>
      )}
    </div>
  );
}

export default VideoTest;
