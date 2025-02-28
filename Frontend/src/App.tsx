import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Logout from './pages/Logout';
import Checkout from './pages/Checkout';
import ProfileCreation from './pages/ProfileCreation';
import VideoTest from './pages/VideoTest';

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
        <Route path="/video-test" element={<VideoTest />} />
      </Routes>
    </Router>
  );
}

export default App;
