import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import api from '../lib/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      const response = await api.post('/api/login', {
        email,
        password,
      });

      const data = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('user', JSON.stringify(data));

      navigate('/');
    } catch (err: any) {
      console.error('Error during login:', err);
      console.log('Full error response:', err?.response);

      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        {error && <p className="error-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email or username..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
