import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Watch.css';

function VideoWatchPage() {
  const [searchParams] = useSearchParams();
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const title = searchParams.get('title');

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await axios.get(`/api/contents/title/${title}`);
        const video = res.data[0];
        setVideoUrl(video.url);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (title) {
      fetchVideo();
    }
  }, [title]);

  return (
    <>
      <Navbar />
      <div className="video-test-page">
        {loading ? (
          <p className="loading-text">Chargement de la vidéo...</p>
        ) : error || !videoUrl ? (
          <p className="error-text">Erreur lors du chargement de la vidéo.</p>
        ) : (
          <div className="video-wrapper">
            <VideoPlayer src={videoUrl} title={title ?? 'Vidéo'} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default VideoWatchPage;
