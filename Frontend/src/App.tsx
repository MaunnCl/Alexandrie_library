import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import Logout from './pages/Logout';
import Checkout from './pages/Checkout';
import ProfileCreation from './pages/ProfileCreation';
import VideoTest from './pages/Watch';
import Categories from './pages/Categories';
import CongressDirectory from './pages/CongressDirectory';
import CongressDetail from './pages/CongressDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CongressDirectory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/watch" element={<VideoTest />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/congress" element={<CongressDirectory />} />
        <Route path="/congress/:id" element={<CongressDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
