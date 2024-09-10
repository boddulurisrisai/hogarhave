// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Header from '../components/Header'; // Import Header component
import Footer from '../components/Footer'; // Import Footer component
import './LoginPage.css'; // Import the CSS file for styling
import './CustomerLandingPage'
function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add validation or API calls here for authentication
    if (isLogin) {
      // For demo purposes, we'll assume login is always successful.
      // After successful login, navigate to the homepage.
      console.log('Email:', email);
      console.log('Password:', password);
      navigate('/CustomerLandingPage'); // Redirect to the homepage
    } else {
      // Handle signup logic here
      console.log('Signing up with', email);
      // Redirect to a different page if needed after signup
      navigate('/'); // Redirect to the homepage after signup
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    if (!isLogin) {
      // Navigate to the signup page if user is toggling to sign up
      navigate('/signup');
    }
  };

  return (
    <>
      <div className="login-page">
        <Header />
        <div className="login-box">
          <section id="content">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button onClick={handleToggle}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default LoginPage;
