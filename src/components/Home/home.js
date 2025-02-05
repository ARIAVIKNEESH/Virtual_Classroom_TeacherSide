import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [teacherName, setTeacherName] = useState('');
  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher/${teacherId}`);
        const data = await response.json();

        if (response.ok) {
          setTeacherName(data.name);
        } else {
          console.error('Failed to fetch teacher name');
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    if (teacherId) {
      fetchTeacherName();
    }
  }, [teacherId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <Container id="home-container" className="text-center p-4">
      <h1 id="home-welcome-message" className="mb-4">Welcome, {teacherName}!</h1>
      <Button id="home-logout-button" variant="primary" className="me-2" onClick={handleLogout}>
        Logout
      </Button>
      <Link to="/profile">
        <Button id="home-profile-button" variant="secondary">Profile</Button>
      </Link>
    </Container>
  );
};

export default Home;
