import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AssessmentDetails = () => {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/assessments/details/${assessmentId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAssessment(data);
      } catch (error) {
        console.error("Error fetching assessment details:", error);
      }
    };

    fetchAssessmentDetails();
  }, [assessmentId]);

  if (!assessment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{assessment.name}</h2>
      <p>Start Date: {new Date(assessment.startDate).toLocaleDateString()}</p>
      <p>End Date: {new Date(assessment.endDate).toLocaleDateString()}</p>
      <p>Start Time: {assessment.startTime}</p>
      <p>End Time: {assessment.endTime}</p>
      <p>Marks: {assessment.marks}</p>
      <div>
        {assessment.images.map((image, index) => (
          <img key={index} src={`http://localhost:5000${image}`} alt={`Assessment ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default AssessmentDetails;
