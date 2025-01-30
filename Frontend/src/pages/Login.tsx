import React from 'react';
import '../styles/Login.css';

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        
        <form className="login-form">
          <label htmlFor="email">Email or Username</label>
          <input 
            type="text" 
            id="email" 
            placeholder="Enter your email or username..."
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password..."
          />

          <button type="submit" className="login-button">Sign In</button>
        </form>

        <div className="login-divider">or</div>

        <button className="signup-button">Create Account</button>
      </div>
    </div>
  );
}

export default Login;
