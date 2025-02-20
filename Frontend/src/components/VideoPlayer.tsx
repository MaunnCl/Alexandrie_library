import React, {
    useRef,
    useState,
    useEffect,
    MouseEvent,
    SyntheticEvent
} from 'react';
import '../styles/VideoPlayer.css';
import {
    FiPlay,
    FiPause,
    FiVolume2,
    FiVolumeX,
    FiMaximize,
    FiMinimize
} from 'react-icons/fi';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);

    const [isFullscreen, setIsFullscreen] = useState(false);


    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };


    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (e: SyntheticEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const value = Number(e.currentTarget.value);
        videoRef.current.currentTime = value;
        setProgress(value);
    };

    const handleVolumeChange = (e: SyntheticEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const vol = parseFloat(e.currentTarget.value);
        videoRef.current.volume = vol;
        setVolume(vol);
        setIsMuted(vol === 0);
    };

    const toggleFullscreen = () => {
        if (!videoRef.current) return;
        if (!isFullscreen) {
            if (videoRef.current.parentElement?.requestFullscreen) {
                videoRef.current.parentElement.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };


    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowControls(false);
        }, 3000);
        return () => clearTimeout(timeout);
    }, [showControls]);

    const handleMouseMove = (e: MouseEvent) => {
        setShowControls(true);
    };

    const progressPercent = duration ? (progress / duration) * 100 : 0;

    const volumePercent = volume * 100;

    return (
        <div className="video-container" onMouseMove={handleMouseMove}>
            <video
                ref={videoRef}
                className="video"
                src={src}
                poster={poster}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <div className={`controls-overlay ${showControls ? 'visible' : ''}`}>
                <button className="center-play-btn" onClick={togglePlay}>
                    {isPlaying ? <FiPause /> : <FiPlay />}
                </button>

                <div className="control-bar">
                    <button onClick={togglePlay}>
                        {isPlaying ? <FiPause /> : <FiPlay />}
                    </button>

                    <input
                        className="progress-bar"
                        type="range"
                        min="0"
                        max={duration}
                        step="any"
                        value={progress}
                        onChange={handleSeek}
                        style={{
                            background: `linear-gradient(
                  to right,
                  #00d4ff 0%,
                  #00d4ff ${progressPercent}%,
                  #666 ${progressPercent}%,
                  #666 100%
                )`
                        }}
                    />

                    <button onClick={toggleMute}>
                        {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                    </button>

                    <input
                        className="volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            background: `linear-gradient(
                  to right,
                  #00d4ff 0%,
                  #00d4ff ${volumePercent}%,
                  #666 ${volumePercent}%,
                  #666 100%
                )`
                        }}
                    />

                    <button onClick={toggleFullscreen}>
                        {isFullscreen ? <FiMinimize /> : <FiMaximize />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;
