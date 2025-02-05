import React, { useEffect, useState } from 'react';
import './addreport.css';

const AddReport = () => {
  const [studentData, setStudentData] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [reportType, setReportType] = useState(''); // 'CAT' or 'SEM'
  const [catMarks, setCatMarks] = useState({ catNumber: '', marks: [{ subject: '', marks: '' }] });
  const [semMarks, setSemMarks] = useState({ semNumber: '', marks: [{ courseCode: '', courseId: '', credits: '', marksScored: '' }] });

  const rollno = localStorage.getItem('rollno');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/student/${rollno}`);
        if (!response.ok) throw new Error('Failed to fetch student details');
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (rollno) fetchStudentData();
  }, [rollno]);

  const handleAddCatSubject = () => {
    setCatMarks({ ...catMarks, marks: [...catMarks.marks, { subject: '', marks: '' }] });
  };

  const handleAddSemCourse = () => {
    setSemMarks({ ...semMarks, marks: [...semMarks.marks, { courseCode: '', courseId: '', credits: '', marksScored: '' }] });
  };

  const handleCatInputChange = (index, field, value) => {
    const updatedMarks = [...catMarks.marks];
    updatedMarks[index][field] = value;
    setCatMarks({ ...catMarks, marks: updatedMarks });
  };

  const handleSemInputChange = (index, field, value) => {
    const updatedMarks = [...semMarks.marks];
    updatedMarks[index][field] = value;
    setSemMarks({ ...semMarks, marks: updatedMarks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reportType === '') {
      setSubmissionStatus('Please select report type (CAT or SEM).');
      return;
    }

    const reportData = {
      rollno,
      date: new Date().toISOString(),
      reportType,
      ...(reportType === 'CAT'
        ? { catNumber: catMarks.catNumber, marks: catMarks.marks }
        : { semNumber: semMarks.semNumber, marks: semMarks.marks })
    };

    try {
      const response = await fetch('http://localhost:5000/api/reports/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) throw new Error('Failed to submit report');

      setSubmissionStatus('Report added successfully!');
      setCatMarks({ catNumber: '', marks: [{ subject: '', marks: '' }] });
      setSemMarks({ semNumber: '', marks: [{ courseCode: '', courseId: '', credits: '', marksScored: '' }] });
      setReportType('');
    } catch (error) {
      console.error('Error submitting report:', error);
      setSubmissionStatus('Failed to add report. Please try again.');
    }
  };

  if (!studentData) return <p>Loading student details...</p>;

  return (
    <div className="unique-add-report-container">
      <h2>Add Report for {studentData.name}</h2>

      <div className="unique-student-info">
        <p><strong>Name:</strong> {studentData.name}</p>
        <p><strong>Roll Number:</strong> {studentData.rollno}</p>
        <p><strong>Department:</strong> {studentData.department}</p>
      </div>

      <div className="unique-report-type-buttons">
        <button onClick={() => setReportType('CAT')}>Add CAT Marks</button>
        <button onClick={() => setReportType('SEM')}>Add SEM Marks</button>
      </div>

      {reportType === 'CAT' && (
        <form className="unique-report-form" onSubmit={handleSubmit}>
          <h3>CAT Marks</h3>
          <input
            placeholder="CAT Number"
            value={catMarks.catNumber}
            onChange={(e) => setCatMarks({ ...catMarks, catNumber: e.target.value })}
          />
          {catMarks.marks.map((mark, index) => (
            <div key={index} className="unique-cat-mark">
              <input
                placeholder="Subject"
                value={mark.subject}
                onChange={(e) => handleCatInputChange(index, 'subject', e.target.value)}
              />
              <input
                placeholder="Marks"
                type="number"
                value={mark.marks}
                onChange={(e) => handleCatInputChange(index, 'marks', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddCatSubject}>Add Another Subject</button>
          <button type="submit" className="unique-submit-button">Submit CAT Report</button>
        </form>
      )}

      {reportType === 'SEM' && (
        <form className="unique-report-form" onSubmit={handleSubmit}>
          <h3>SEM Marks</h3>
          <input
            placeholder="SEM Number"
            value={semMarks.semNumber}
            onChange={(e) => setSemMarks({ ...semMarks, semNumber: e.target.value })}
          />
          {semMarks.marks.map((mark, index) => (
            <div key={index} className="unique-sem-mark">
              <input
                placeholder="Course Code"
                value={mark.courseCode}
                onChange={(e) => handleSemInputChange(index, 'courseCode', e.target.value)}
              />
              <input
                placeholder="Course ID"
                value={mark.courseId}
                onChange={(e) => handleSemInputChange(index, 'courseId', e.target.value)}
              />
              <input
                placeholder="Credits"
                type="number"
                value={mark.credits}
                onChange={(e) => handleSemInputChange(index, 'credits', e.target.value)}
              />
              <input
                placeholder="Marks Scored"
                type="number"
                value={mark.marksScored}
                onChange={(e) => handleSemInputChange(index, 'marksScored', e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddSemCourse}>Add Another Course</button>
          <button type="submit" className="unique-submit-button">Submit SEM Report</button>
        </form>
      )}

      <div className="unique-submission-status">
        {submissionStatus && <p>{submissionStatus}</p>}
      </div>
    </div>
  );
};

export default AddReport;
