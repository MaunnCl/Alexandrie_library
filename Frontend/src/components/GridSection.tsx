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

        const mapped: EventData[] = data
          .filter((v: any) => v.title && v.url)
          .map((v: any) => ({
            img: v.thumbnail_url || 'https://via.placeholder.com/800x450',
            title: v.title.replace(/\.mp4$/i, ''),
            description: v.description || 'Aucune description.',
            duration: v.duration ? `${Math.floor(v.duration / 60)} min` : 'Durée inconnue',
            speakers: 'Non renseigné',
          }));

        const unique = Array.from(
          new Map(mapped.map((v) => [v.title, v])).values()
        );

        setEvents(unique.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des vidéos :', error);
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
            <p className="details">
              Durée : {ev.duration} | Intervenants : {ev.speakers}
            </p>
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
