import { FormEvent, useState } from 'react';
import '../styles/Navbar.css';

function Navbar() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="navbar">
      <h1>MedStream</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">Live Events</a>
        <a href="#">Categories</a>
        <a href="#">Login</a>
        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            id="searchInput"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </nav>
    </div>
  );
}

export default Navbar;
