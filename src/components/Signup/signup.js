import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teacherId: '',
    dob: '',
    gender: '',
    yearsOfExperience: '',
    specialization: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
        setErrorMessage(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred during signup');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-8 col-lg-6">
        <div className="card p-4 shadow-lg">
          <h2 className="text-center mb-4">Sign Up</h2>

          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}

          <form onSubmit={handleSignup}>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="teacherId"
                  className="form-control"
                  placeholder="Teacher ID"
                  value={formData.teacherId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  placeholder="Date of Birth"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="gender"
                  className="form-control"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  name="yearsOfExperience"
                  className="form-control"
                  placeholder="Years of Experience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  placeholder="Area of Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Signup
            </button>
            <div className="text-center mt-3">
              <p>Already a User? <a href="/">Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;