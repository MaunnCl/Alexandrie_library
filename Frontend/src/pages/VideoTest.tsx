import React, { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';

function VideoTest() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideoUrl() {
      try {
        const response = await axios.get('http://localhost:8080/api/contents?videoKey=Video-Bassez.mp4');
        
        if (response.data && typeof response.data === 'string') {
          setVideoUrl(response.data);
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
    <div style={{ maxWidth: '800px', margin: 'auto', paddingTop: '50px' }}>
      <h2 style={{ textAlign: 'center', color: '#fff' }}>Test Video Player</h2>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#fff' }}>Loading video...</p>
      ) : videoUrl ? (
        <VideoPlayer src={videoUrl} poster="https://via.placeholder.com/800x450?text=Video+Loading" />
      ) : (
        <p style={{ textAlign: 'center', color: 'red' }}>Failed to load video.</p>
      )}
    </div>
  );
}

export default VideoTest;
