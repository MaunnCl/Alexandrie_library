import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import '../styles/SearchBar.css';

interface SearchResult {
  id: number | string;
  name?: string;
  title?: string;
}

function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'general' | 'congress' | 'topic' | 'speaker'>('general');
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSelect = async (r: SearchResult) => {
    setOpen(false);
    setQuery('');
    try {
      if (searchType === 'congress') {
        navigate(`/congress/${r.id}`);
      } else if (searchType === 'topic') {
        navigate(`/categories?search=${encodeURIComponent(r.name || '')}`);
      } else if (searchType === 'speaker') {
        navigate(`/speaker/${r.id}`);
      } else {
        navigate(`/watch/${r.id}`);
      }
    } catch (err) {
      console.error('Navigation error', err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchResults() {
      if (!open || query.trim() === '') {
        setResults([]);
        return;
      }
      try {
        if (searchType === 'congress') {
          const res = await api.get('/api/congress');
          setResults(res.data.filter((c: any) => c.name.toLowerCase().includes(query.toLowerCase())));
        } else if (searchType === 'topic') {
          const res = await api.get('/api/categories');
          setResults(res.data.filter((t: any) => t.name.toLowerCase().includes(query.toLowerCase())));
        } else if (searchType === 'speaker') {
          const res = await api.get('/api/orators');
          setResults(res.data.filter((o: any) => o.name.toLowerCase().includes(query.toLowerCase())));
        } else {
          const res = await api.get('/api/contents');
          setResults(res.data.filter((v: any) => v.title.toLowerCase().includes(query.toLowerCase())));
        }
      } catch (err) {
        console.error('Search error', err);
      }
    }
    fetchResults();
  }, [query, searchType, open]);

  return (
    <div className="search-wrapper" ref={containerRef}>
      <div className="search-bar" onClick={() => setOpen(true)}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {open && (
        <div className="search-popup">
          <div className="search-options">
            <button
              className={searchType === 'general' ? 'active' : ''}
              onClick={() => setSearchType('general')}
            >
              General
            </button>
            <button
              className={searchType === 'congress' ? 'active' : ''}
              onClick={() => setSearchType('congress')}
            >
              Congresses
            </button>
            <button
              className={searchType === 'topic' ? 'active' : ''}
              onClick={() => setSearchType('topic')}
            >
              Topics
            </button>
            <button
              className={searchType === 'speaker' ? 'active' : ''}
              onClick={() => setSearchType('speaker')}
            >
              Speakers
            </button>
          </div>
          <ul className="search-results">
            {results.map((r) => (
              <li key={r.id} onClick={() => handleSelect(r)}>
                {r.name || r.title}
              </li>
            ))}
            {results.length === 0 && query && <li className="no-results">No results</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
