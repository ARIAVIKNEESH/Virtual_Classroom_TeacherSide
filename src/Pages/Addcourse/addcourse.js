import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addcourse.css';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [notes, setNotes] = useState('');
  const teacherId = localStorage.getItem('teacherId');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      courseName,
      courseId,
      image,
      title,
      contents: contents.split(','),
      notes
    };

    try {
      const response = await fetch(`http://localhost:5000/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...courseData, teacherId })
      });
      const data = await response.json();
      if (response.status === 201) {
        alert('Course added successfully!');
        navigate('/courses');
      } else {
        alert('Error adding course:', data.message);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course');
    }
  };

  return (
    <div className="add-course__wrapper">
      <h2 className="add-course__title">Add New Course</h2>
      <form onSubmit={handleSubmit} className="add-course__form">
        <label className="add-course__label">
          Course Name:
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <label className="add-course__label">
          Course ID:
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <label className="add-course__label">
          Image URL:
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <label className="add-course__label">
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <label className="add-course__label">
          Contents (comma separated):
          <input
            type="text"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <label className="add-course__label">
          Notes (PDF link):
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            required
            className="add-course__input"
          />
        </label>
        <button type="submit" className="add-course__submit-btn">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
