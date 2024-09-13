import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch customers from localStorage or initialize an empty array if none exist
  const getCustomers = () => JSON.parse(localStorage.getItem('customers')) || [];

  const handleSubmit = (event) => {
    event.preventDefault();
    const customers = getCustomers();

    if (isLogin) {
      // Perform login validation
      const customer = customers.find(
        (cust) => cust.email === email && cust.password === password
      );
      if (customer) {
        console.log('Customer logged in:', customer);
        localStorage.setItem('loggedInCustomer', JSON.stringify(customer));
        navigate('/CustomerLandingPage'); // Redirect to the Customer Landing Page
      } else {
        setError('Invalid email or password');
      }
    } else {
      // Handle signup
      if (customers.some((cust) => cust.email === email)) {
        setError('Email already exists');
      } else {
        const newCustomer = { email, password, orders: [] };
        customers.push(newCustomer);
        localStorage.setItem('customers', JSON.stringify(customers));
        console.log('New customer signed up:', newCustomer);
        navigate('/customer/signup'); // Redirect to Signup Page
      }
    }
  };

  const handleToggle = () => {
    // Toggle between login and signup mode
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-box">
          <section id="content">
            <h2>{isLogin ? 'Customer Login' : 'Customer Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}
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
