import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Logout from './pages/Logout';
import Checkout from './pages/Checkout';
import ProfileCreation from './pages/ProfileCreation';
import Categories from './pages/Categories';
import Home from './pages/Home';
import CongressDirectory from './pages/CongressDirectory';
import CongressDetail from './pages/CongressDetail';
import VideoWatchPage from './pages/VideoWatchPage';
import Watch from './pages/Watch';
import SpeakerDetail from './pages/SpeakerDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/congress/113" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/watch" element={<VideoWatchPage />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/congress" element={<CongressDirectory />} />
        <Route path="/congress/:id" element={<CongressDetail />} />
        <Route path="/speaker/:id" element={<SpeakerDetail />} />
        <Route path="/watch/:id" element={<Watch />} />
      </Routes>
    </Router>
  );
}

export default App;
