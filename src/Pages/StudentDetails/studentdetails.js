import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './studentdetails.css';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const teacherId = localStorage.getItem('teacherId'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data); 
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    
    if (teacherId) {
      fetchStudents();
    }
  }, [teacherId]);

  const handleViewDetails = (rollno) => {
    localStorage.setItem('rollno', rollno);
    navigate('/particularstudent');
  };

  return (
    <div className="students-container">
      {students.map((student) => (
        <div key={student.rollno} className="student-card">
          <h3 className="student-name">{student.name}</h3>
          <p className="student-roll">Roll Number: {student.rollno}</p>
          <button className="sbutton view-details-button" onClick={() => handleViewDetails(student.rollno)}>
            View Full Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentDetails;