import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './student.css';

const Student = () => {
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

  const handleViewReport = (rollno) => {
    localStorage.setItem('rollno', rollno);
    navigate('/viewreport');
  };

  const handleAddReport = (rollno) => {
    localStorage.setItem('rollno', rollno);
    navigate('/addreport');
  };

  return (
    <div className="unique-students-container">
      {students.map((student) => (
        <div key={student.rollno} className="unique-student-card">
          <h3 className="unique-student-name"><b>{student.name}</b></h3>
          <p className="unique-student-roll">Roll Number: {student.rollno}</p>
          <button className="button" onClick={() => handleViewReport(student.rollno)}>
            <span className="icon">📄</span>
            View Report
          </button>
          <button className="button" onClick={() => handleAddReport(student.rollno)} style={{ backgroundColor: '#28a745' }}>
            <span className="icon">➕</span> 
            Add Report
          </button>
        </div>
      ))}
    </div>
  );
};

export default Student;
