import React, { useEffect, useState } from 'react';
import './sapdetails.css';

const SAPDetails = () => {
  const [studentData, setStudentData] = useState(null);
  const [sapDetails, setSapDetails] = useState(0);
  const [activity, setActivity] = useState('');
  const [content, setContent] = useState('');
  const [marks, setMarks] = useState(0);

  const rollno = localStorage.getItem('rollno');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/student/${rollno}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudentData(data);
        setSapDetails(data.sap || 0);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (rollno) {
      fetchStudentData();
    }
  }, [rollno]);

  const handleAddSAPActivity = async () => {
    if (!activity || !content || marks <= 0) {
      alert('Please fill all the fields and ensure marks are greater than 0');
      return;
    }

    try {
      const sapData = {
        rollno,
        name: studentData.name,
        department: studentData.department,
        sap: sapDetails + marks,
        activity,
        content,
        marks,
      };

      const response = await fetch('http://localhost:5000/api/sap/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sapData),
      });

      if (!response.ok) {
        throw new Error('Failed to update SAP details');
      }

      setSapDetails((prevSap) => prevSap + marks);
      alert('SAP details added successfully');
      setActivity('');
      setContent('');
      setMarks(0);
    } catch (error) {
      console.error('Error updating SAP details:', error);
    }
  };

  if (!studentData) {
    return <p>Loading student details...</p>;
  }

  return (
    <div className="sapdetails-container">
      <h2 className="sapdetails-heading">SAP Details</h2>

      <table className="sapdetails-table">
        <tbody>
          <tr>
            <td className="sapdetails-cell sapdetails-label">Name</td>
            <td className="sapdetails-cell">{studentData.name}</td>
            <td className="sapdetails-cell sapdetails-label">Department</td>
            <td className="sapdetails-cell">{studentData.department}</td>
          </tr>
          <tr>
            <td className="sapdetails-cell sapdetails-label">Roll No</td>
            <td className="sapdetails-cell">{studentData.rollno}</td>
            <td className="sapdetails-cell sapdetails-label">SAP</td>
            <td className="sapdetails-cell">{sapDetails}</td>
          </tr>
        </tbody>
      </table>

      <div className="sapdetails-form">
        <label className="sapdetails-label">
          Activity:
          <select
            className="sapdetails-input"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="">Select an activity</option>
            <option value="Paper presentation">Paper presentation</option>
            <option value="Project presentation">Project presentation</option>
            <option value="Techno marginal events">Techno marginal events</option>
            <option value="Sports and games">Sports and games</option>
            <option value="Membership">Membership</option>
            <option value="Leadership/organizing events">Leadership/organizing events</option>
            <option value="VAC/Online courses">VAC/Online courses</option>
            <option value="Project to paper/patent/Copyright">Project to paper/patent/Copyright</option>
            <option value="GATE/CAT/Govt.Exams">GATE/CAT/Govt.Exams</option>
            <option value="Entrepreneurship">Entrepreneurship</option>
            <option value="Placement and internship">Placement and internship</option>
            <option value="In-plant training">In-plant training</option>
            <option value="Social activities">Social activities</option>
          </select>
        </label>

        <label className="sapdetails-label">
          Content:
          <input
            className="sapdetails-input"
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <label className="sapdetails-label">
          Marks:
          <input
            className="sapdetails-input"
            type="number"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
        </label>

        <button className="sapdetails-button" onClick={handleAddSAPActivity}>
          Add SAP Activity
        </button>
      </div>
    </div>
  );
};
export default SAPDetails;