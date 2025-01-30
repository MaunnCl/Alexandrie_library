import { useState } from 'react';
import '../styles/Carousel.css';

function Carousel() {
  const slidesData = [
    {
      img: 'https://via.placeholder.com/800x400',
      alt: 'Featured Congress 1',
      title: 'Cutting-Edge Cardiac Care',
      description: 'Discover the latest breakthroughs in cardiology.'
    },
    {
      img: 'https://via.placeholder.com/800x400',
      alt: 'Featured Congress 2',
      title: 'Innovation in Neurology',
      description: 'Neurosurgeons reveal next-gen treatment strategies.'
    },
    {
      img: 'https://via.placeholder.com/800x400',
      alt: 'Featured Congress 3',
      title: 'Advanced Oncology Conference',
      description: 'Global leaders share breakthroughs in cancer research.'
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  function updateCarouselPosition(index: number) {
    const newIndex = (index + slidesData.length) % slidesData.length;
    setCurrentSlideIndex(newIndex);
  }

  const prevSlide = () => {
    updateCarouselPosition(currentSlideIndex - 1);
  };

  const nextSlide = () => {
    updateCarouselPosition(currentSlideIndex + 1);
  };

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Featured Events</h2>
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>
          &#10094;
        </button>
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
        >
          {slidesData.map((slide, i) => (
            <div className="carousel-slide" key={i}>
              <img src={slide.img} alt={slide.alt} />
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          ))}
        </div>
        <button className="carousel-button next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Carousel;
