import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Logout from './pages/Logout';
import Checkout from './pages/Checkout';
import ProfileCreation from './pages/ProfileCreation';
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
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/checkout" element={<Checkout />} />
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
