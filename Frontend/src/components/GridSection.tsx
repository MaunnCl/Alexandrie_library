import { useEffect, useState } from 'react';
import '../styles/GridSection.css';
import EventModal from './EventModal';
import axios from 'axios';

interface EventData {
  img: string;
  title: string;
  description: string;
  duration: string;
  speakers: string;
}

function GridSection() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function refreshAndFetchVideos() {
      try {
        await axios.patch('http://localhost:8080/api/contents/refresh');

        const res = await axios.get('http://localhost:8080/api/contents');
        const data = res.data;

        const mapped: EventData[] = data
          .filter((v: any) => v.title && v.url)
          .map((v: any) => ({
            img:
              v.video_thumbnail_url ||
              v.thumbnail_url ||
              'https://via.placeholder.com/800x450',
            title: v.title.replace(/\.mp4$/i, ''),
            description: v.description || 'No description available.',
            duration: v.duration ? `${Math.floor(v.duration / 60)} min` : 'Unknown duration',
            speakers: 'Not specified',
          }));

        const unique = Array.from(new Map(mapped.map((v) => [v.title, v])).values());
        setEvents(unique.slice(0, 10));
      } catch (error) {
        console.error('Error refreshing/fetching videos:', error);
      }
    }

    refreshAndFetchVideos();
  }, []);

  const handleOpenModal = (event: EventData) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  return (
    <div className="grid-section">
      <h2 className="section-title">Videos</h2>
      <hr className="section-divider" />
      <div className="grid">
        {events.map((ev, index) => (
          <div key={index} className="grid-item" onClick={() => handleOpenModal(ev)}>
            <div className="image-container">
              <img src={ev.img} alt={ev.title} />
            </div>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p className="details">
              Duration: {ev.duration} | Speakers: {ev.speakers}
            </p>
          </div>
        ))}
      </div>

      <EventModal show={showModal} onClose={handleCloseModal} eventData={selectedEvent} />
    </div>
  );
}

export default GridSection;
