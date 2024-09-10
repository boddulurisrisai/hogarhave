import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Header from '../components/Header'; // Import Header component

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLogin) {
      console.log('Email:', email);
      console.log('Password:', password);
      navigate('/CustomerLandingPage'); // Redirect to the homepage
    } else {
      console.log('Signing up with', email);
      navigate('/'); // Redirect to the homepage after signup
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    if (!isLogin) {
      navigate('/signup');
    }
  };

  return (
    <>
      <Header /> {/* Use Header component */}
      <div className="login-page">
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
      </div>
    </>
  );
}

export default LoginPage;
