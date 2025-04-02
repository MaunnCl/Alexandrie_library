import '../styles/EventModal.css';
import { useNavigate } from 'react-router-dom';

interface EventData {
  img: string;
  title: string;
  description: string;
  duration: string;
  speakers: string;
}

interface EventModalProps {
  show: boolean;
  onClose: () => void;
  eventData: EventData | null;
}

function EventModal({ show, onClose, eventData }: EventModalProps) {
  const navigate = useNavigate();

  if (!show || !eventData) return null;

  const handleWatchClick = () => {
    const titleWithExtension = eventData.title.endsWith('.mp4') ? eventData.title : `${eventData.title}.mp4`;
    navigate(`/watch?title=${encodeURIComponent(titleWithExtension)}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-top">
          <img src={eventData.img} alt={eventData.title} className="modal-image" />
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{eventData.title.replace(/\.mp4$/i, '')}</h2>
          <p className="modal-description">{eventData.description}</p>

          <div className="modal-details">
            <p><strong>Duration:</strong> {eventData.duration}</p>
            <p><strong>Speakers:</strong> {eventData.speakers}</p>
          </div>

          <button className="modal-watch-button" onClick={handleWatchClick}>
            Regarder la vidéo
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;
