import { useEffect, useRef, useState } from 'react';
import '../styles/Carousel.css';
import axios from 'axios';
import EventModal from './EventModal';

interface EventData {
  img: string;
  title: string;
  description: string;
  duration: string;
  speakers: string;
}

function Carousel() {
  const [slidesData, setSlidesData] = useState<EventData[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getHourlyKey = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
  };

  useEffect(() => {
    const key = getHourlyKey();
    const cached = localStorage.getItem(`carousel-${key}`);
    if (cached) {
      setSlidesData(JSON.parse(cached));
      return;
    }

    async function fetchVideos() {
      try {
        const res = await axios.get('http://localhost:8080/api/contents');
        const data = res.data;

        const mapped: EventData[] = data
          .filter((v: any) => v.title && v.url)
          .map((v: any) => ({
            img: v.video_thumbnail_url || v.orator_image_url || v.thumbnail_url || 'https://via.placeholder.com/800x400',
            title: v.title.replace(/\.mp4$/i, ''),
            description: v.description || 'Aucune description.',
            duration: v.duration ? `${Math.floor(v.duration / 60)} min` : 'Durée inconnue',
            speakers: 'Non renseigné',
          }));

        const unique = Array.from(new Map(mapped.map((v) => [v.title, v])).values());
        const shuffled = unique.sort(() => 0.5 - Math.random()).slice(0, 3);

        localStorage.setItem(`carousel-${key}`, JSON.stringify(shuffled));
        setSlidesData(shuffled);
      } catch (err) {
        console.error('Erreur de récupération des vidéos pour le carousel', err);
      }
    }

    fetchVideos();
  }, []);

  function updateCarouselPosition(index: number) {
    const newIndex = (index + slidesData.length) % slidesData.length;
    setCurrentSlideIndex(newIndex);
  }

  const prevSlide = () => updateCarouselPosition(currentSlideIndex - 1);
  const nextSlide = () => updateCarouselPosition(currentSlideIndex + 1);

  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        updateCarouselPosition(currentSlideIndex + 1);
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSlideIndex, isHovered]);

  const handleOpenModal = (event: EventData) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  return (
    <div
      className="carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="carousel-title">Featured Events</h2>
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>
          &#10094;
        </button>

        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentSlideIndex * 100}%)`,
            transition: 'transform 0.6s ease-in-out'
          }}
        >
          {slidesData.map((slide, i) => (
            <div className="carousel-slide" key={i} onClick={() => handleOpenModal(slide)}>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          ))}
        </div>

        <button className="carousel-button next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      <div className="carousel-dots">
        {slidesData.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentSlideIndex ? 'active' : ''}`}
            onClick={() => setCurrentSlideIndex(i)}
          ></span>
        ))}
      </div>

      <EventModal show={showModal} onClose={handleCloseModal} eventData={selectedEvent} />
    </div>
  );
}

export default Carousel;
