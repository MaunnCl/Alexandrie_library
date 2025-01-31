import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                navigate('/');
            } else {
                const data = await response.json();
                if (data.message) {
                    setError(data.message);
                } else {
                    setError('Invalid email or password. Please try again.');
                }
            }
        } catch (err) {
            setError('Network error. Please try again.');
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

                <div className="login-divider">or</div>

                <button
                    className="signup-button"
                    onClick={() => navigate('/register')}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default Login;
