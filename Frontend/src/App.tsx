import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Topics from './pages/Topics';
import Home from './pages/Home';
import CongressDirectory from './pages/CongressDirectory';
import CongressDetail from './pages/CongressDetail';
import Watch from './pages/Watch';
import SpeakerDetail from './pages/SpeakerDetail';
import SpeakersList from './pages/SpeakersList';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/topics/:id" element={<Topics />} />
        <Route path="/congress" element={<CongressDirectory />} />
        <Route path="/congress/:id" element={<CongressDetail />} />
        <Route path="/speaker/:id" element={<SpeakerDetail />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/speakers" element={<SpeakersList />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
