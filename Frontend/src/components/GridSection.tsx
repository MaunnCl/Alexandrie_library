import { useState } from 'react';
import '../styles/GridSection.css';
import EventModal from './EventModal';

interface EventData {
  img: string;
  title: string;
  description: string;
  duration: string;
  speakers: string;
}

function GridSection() {
  // Données d'exemple
  const events: EventData[] = [
    {
      img: 'https://via.placeholder.com/800x450',
      title: 'Advances in Cardiology',
      description: 'Latest research and innovations in cardiovascular medicine.',
      duration: '2h 30m',
      speakers: 'Dr. John Doe, Dr. Jane Smith'
    },
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
  ];

  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [showModal, setShowModal] = useState(false);

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

      {/* Modale Netflix-like */}
      <EventModal
        show={showModal}
        onClose={handleCloseModal}
        eventData={selectedEvent}
      />
    </>
  );
}

export default GridSection;
