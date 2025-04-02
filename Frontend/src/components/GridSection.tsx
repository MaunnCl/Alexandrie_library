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
    async function fetchVideos() {
      try {
        const res = await axios.get('http://localhost:8080/api/contents');
        const data = res.data;

        if (Array.isArray(data) && data.length > 0) {
          const first = data.find((v: any) => v.title && v.thumbnail_url);
          const realEvent: EventData = {
            img: first?.thumbnail_url || 'https://via.placeholder.com/800x450',
            title: first?.title.replace(/\.mp4$/i, '') || 'Unknown title',
            description: first?.description || 'No description',
            duration: first?.duration
              ? `${Math.floor(first.duration / 60)} min`
              : 'Unknown duration',
            speakers: 'Non renseigné'
          };

          setEvents([
            realEvent,
            {
              img: 'https://via.placeholder.com/800x450',
              title: 'Neuroscience Innovations',
              description: 'Breakthrough discoveries in brain science and neurological treatments.',
              duration: '1h 45m',
              speakers: 'Dr. Alice Brown, Dr. Robert Wilson'
            },
            {
              img: 'https://via.placeholder.com/800x450',
              title: 'Breakthroughs in Oncology',
              description: 'Exploring the latest advancements in cancer research and therapy.',
              duration: '3h 15m',
              speakers: 'Dr. Emily White, Dr. Michael Green'
            },
            {
              img: 'https://via.placeholder.com/800x450',
              title: 'Robotic Surgery Summit',
              description: 'How AI and robotics are revolutionizing surgical procedures.',
              duration: '2h',
              speakers: 'Dr. Kevin Lee, Dr. Sarah Johnson'
            }
          ]);
        }
      } catch (error) {
        console.error('Erreur chargement vidéos dynamiques :', error);
      }
    }

    fetchVideos();
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
    <>
      <div className="grid">
        {events.map((ev, index) => (
          <div
            key={index}
            className="grid-item"
            onClick={() => handleOpenModal(ev)}
          >
            <img src={ev.img} alt={ev.title} />
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>
            <p className="details">Duration: {ev.duration} | Speakers: {ev.speakers}</p>
          </div>
        ))}
      </div>

      <EventModal
        show={showModal}
        onClose={handleCloseModal}
        eventData={selectedEvent}
      />
    </>
  );
}

export default GridSection;
