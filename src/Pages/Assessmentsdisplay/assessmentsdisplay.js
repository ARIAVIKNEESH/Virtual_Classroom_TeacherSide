import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assessmentsdisplay.css';

const AssessmentsDisplay = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAssessments = async () => {
      const teacherId = localStorage.getItem('teacherId'); 
      if (!teacherId) {
        console.error("Teacher ID not found in local storage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/assessments/${teacherId}`);
        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      }
    };

    fetchAssessments();
  }, []);
  const goToAssessmentDetails = (assessmentId) => {
    navigate(`/assessmentdetails/${assessmentId}`);
  };
  const goToNewAssessmentPage = () => {
    navigate('/assessments');
  };

  return (
    <div className="assessments-display-page">
      <button className="assessments-display-page__post-btn" onClick={goToNewAssessmentPage}>
        Post New Assessment
      </button>

      <div className="assessments-display-page__list">
        {assessments.map((assessment) => (
          <div
            key={assessment._id}
            className="assessments-display-page__box"
            onClick={() => goToAssessmentDetails(assessment._id)}
          >
            <h3 className="assessments-display-page__name">{assessment.name}</h3>
            <p className="assessments-display-page__date">Start Date: {new Date(assessment.startDate).toLocaleDateString()}</p>
            <p className="assessments-display-page__date">End Date: {new Date(assessment.endDate).toLocaleDateString()}</p>
            <p className="assessments-display-page__time">Start Time: {assessment.startTime}</p>
            <p className="assessments-display-page__time">End Time: {assessment.endTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentsDisplay;
