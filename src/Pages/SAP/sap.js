import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sap.css';

const SAP = () => {
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

  const handleAddSAPDetails = (rollno) => {
    localStorage.setItem('rollno', rollno);
    navigate('/sapdetails');
  };

  return (
    <div className="students-container">
      {students.map((student) => (
        <div key={student.rollno} className="student-card">
          <h3 className="student-name">{student.name}</h3>
          <p className="student-roll">Roll Number: {student.rollno}</p>
          <button className="add-sap-button" onClick={() => handleAddSAPDetails(student.rollno)}>
            Add SAP Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default SAP;
