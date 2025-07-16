import { useEffect, useState } from 'react';
import api from '../lib/api';
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
  const [search, setSearch] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    api.get(`/api/categories`).then((res) => {
      setCategories(res.data);
      setSelectedCategory(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.includes(selectedCategory as Category)) {
      setSelectedCategory(filteredCategories[0]);
    }
  }, [search, categories]);

  useEffect(() => {
    if (!selectedCategory) return;
    api.get(`/api/contents`).then((res) => {
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
      <input
        type="text"
        className="search-input"
        placeholder="Search categories"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="category-selector">
        {filteredCategories.map((cat) => (
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
