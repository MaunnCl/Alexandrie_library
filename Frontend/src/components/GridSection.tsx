import '../styles/GridSection.css';

function GridSection() {
  return (
    <div className="grid">
      <div className="grid-item">
        <img src="https://via.placeholder.com/300" alt="Congress 1" />
        <h3>Advances in Cardiology</h3>
        <p>Latest research and innovations in cardiovascular medicine.</p>
        <p className="details">Duration: 2h 30m | Speakers: Dr. John Doe, Dr. Jane Smith</p>
      </div>
      <div className="grid-item">
        <img src="https://via.placeholder.com/300" alt="Congress 2" />
        <h3>Neuroscience Innovations</h3>
        <p>Breakthrough discoveries in brain science and neurological treatments.</p>
        <p className="details">Duration: 1h 45m | Speakers: Dr. Alice Brown, Dr. Robert Wilson</p>
      </div>
      <div className="grid-item">
        <img src="https://via.placeholder.com/300" alt="Congress 3" />
        <h3>Breakthroughs in Oncology</h3>
        <p>Exploring the latest advancements in cancer research and therapy.</p>
        <p className="details">Duration: 3h 15m | Speakers: Dr. Emily White, Dr. Michael Green</p>
      </div>
      <div className="grid-item">
        <img src="https://via.placeholder.com/300" alt="Congress 4" />
        <h3>Robotic Surgery Summit</h3>
        <p>How AI and robotics are revolutionizing surgical procedures.</p>
        <p className="details">Duration: 2h | Speakers: Dr. Kevin Lee, Dr. Sarah Johnson</p>
      </div>
    </div>
  );
}

export default GridSection;
