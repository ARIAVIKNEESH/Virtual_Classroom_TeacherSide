import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setLoggedIn }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('teacherId', data.teacherId);
        localStorage.setItem('email', data.email);
        localStorage.setItem('name', data.name);

        setLoggedIn(true);
        navigate('/home');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred during login');
    }
  };

  const handleShowPasswordChange = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center login-container">
      <div className="row w-75 shadow-lg rounded">
        <div className="col-md-6 login-image-section">
          <img
            src="https://t4.ftcdn.net/jpg/03/49/04/11/360_F_349041172_7p4d3KBfqpM2fg51vuPq4jhLkkwnnrFk.jpg"
            alt="Graduation"
            className="img-fluid rounded-start"
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <h2 className="text-center mb-4">Learn Lab</h2>
          <p className="text-center mb-4">The key to happiness is to sign in.</p>

          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="identifier" className="form-label">Email</label>
              <input
                type="text"
                name="identifier"
                className="form-control"
                placeholder="Teacher ID or Email"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type={showPassword ? 'text' : 'password'} 
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                checked={showPassword}
                onChange={handleShowPasswordChange} 
              />
              <label className="form-check-label" htmlFor="showPassword">Show Password</label>
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>
            <div className="text-center mt-3">
              <p><a href="/forgot-password">Forgot Password?</a></p>
              <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
