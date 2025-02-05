import React, { useState } from 'react';
import './Assessments.css';

const Assessments = () => {
    const [name, setName] = useState('');
    const [marks, setMarks] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [images, setImages] = useState([]);

    const teacherId = localStorage.getItem('teacherId'); // Retrieve teacherId from localStorage

    const handleFileChange = (e) => {
        const selectedImages = Array.from(e.target.files).slice(0, 5);
        setImages(selectedImages);
    };

    const handlePostNewAssessment = async () => {
        const formData = new FormData();
        formData.append('teacherId', teacherId);
        formData.append('name', name);
        formData.append('marks', marks);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('startTime', startTime);
        formData.append('endTime', endTime);
        images.forEach((image) => formData.append('images', image));

        try {
            await fetch('http://localhost:5000/api/assessments', {
                method: 'POST',
                body: formData,
            });
            alert('Assessment posted successfully');
        } catch (error) {
            console.error('Error posting assessment:', error);
            alert('Error posting assessment');
        }
    };

    return (
        <div className="assessment__container">
            <h2 className="assessment__title">Post New Assessment</h2>
            <input
                type="text"
                placeholder="Assessment Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="assessment__input"
            />
            <input
                type="number"
                placeholder="Marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="assessment__input"
            />
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="assessment__input"
            />
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="assessment__input"
            />
            <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="assessment__input"
            />
            <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="assessment__input"
            />
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="assessment__file-input"
            />
            <button onClick={handlePostNewAssessment} className="assessment__post-btn">
                Post New Assessment
            </button>
        </div>
    );
};

export default Assessments;
