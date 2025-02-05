import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './course.css';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const teacherId = localStorage.getItem('teacherId');
  const navigate = useNavigate();  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${teacherId}`);
        const data = await response.json();
        if (response.status === 200) {
          setCourses(data);
        } else {
          console.error('Error fetching courses:', data.message);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [teacherId]);

  const handleAddCourse = () => {
    navigate('/add-course');
  };

  return (
    <div className="course__wrapper">
      <button onClick={handleAddCourse} className="course__add-btn">
        Add New Course
      </button>

      <div className="course__list">
        {courses.length === 0 ? (
          <p className="course__empty-message">No courses available.</p>
        ) : (
          courses.map((course) => (
            <div className="course__card" key={course._id}>
              <h3 className="course__name">{course.courseName}</h3>
              <img src={course.image} alt={course.courseName} className="course__image" />
              <p className="course__detail"><strong>Course ID:</strong> {course.courseId}</p>
              <p className="course__detail"><strong>Title:</strong> {course.title}</p>
              <p className="course__detail"><strong>Contents:</strong> {course.contents.join(', ')}</p>
              <p className="course__detail"><strong>Notes:</strong> {course.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Course;
