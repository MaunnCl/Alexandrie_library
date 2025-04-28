import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Categories.css';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description: string;
  orator_image_url: string;
}

interface Video {
  title: string;
  url: string;
  thumbnail: string;
  duration: number;
}

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('${import.meta.env.VITE_API_URL}/api/categories').then((res) => {
      setCategories(res.data);
      setSelectedCategory(res.data[0]); // sélectionne la première par défaut
    });
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    axios.get('${import.meta.env.VITE_API_URL}/api/contents').then((res) => {
      const allVideos = res.data;
      const filtered = allVideos.filter((v: Video) =>
        v.title.toLowerCase().includes(selectedCategory.name.toLowerCase())
      );
      setVideos(filtered);
    });
  }, [selectedCategory]);

  const handleClick = (video: Video) => {
    navigate(`/watch?title=${encodeURIComponent(video.title)}`);
  };

  return (
    <div className="categories-page">
      <h1 className="section-title">Browse by Category</h1>
      <hr className="section-divider" />

      <div className="category-selector">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-button ${selectedCategory?.name === cat.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <div className="orator-profile">
            <img
              src={selectedCategory.orator_image_url}
              alt={selectedCategory.name}
            />
            <h3>{selectedCategory.name}</h3>
            <p>{selectedCategory.description}</p>
          </div>

          <h2 className="category-title">{selectedCategory.name}</h2>
          <div className="grid">
            {videos.map((v, i) => (
              <div className="grid-item" key={i} onClick={() => handleClick(v)}>
                <div className="image-container">
                  <img
                    src={v.thumbnail || 'https://via.placeholder.com/800x450'}
                    alt={v.title}
                  />
                </div>
                <h3>{v.title}</h3>
                <p className="details">{Math.floor(v.duration / 60)} min</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Categories;
