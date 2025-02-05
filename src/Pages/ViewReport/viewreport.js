import React, { useEffect, useState } from 'react';
import './viewreport.css';

const ViewReport = () => {
  const [studentData, setStudentData] = useState(null);
  const [catReports, setCatReports] = useState([]);
  const [semReports, setSemReports] = useState([]);
  const [marksType, setMarksType] = useState('');
  const [filteredCatNumber, setFilteredCatNumber] = useState('');
  const [filteredSemNumber, setFilteredSemNumber] = useState('');

  const rollno = localStorage.getItem('rollno');

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!rollno) return;

      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/student/${rollno}`);
        if (!response.ok) throw new Error('Failed to fetch student details');
        const data = await response.json();
        setStudentData(data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentData();
  }, [rollno]);

  const fetchCatMarks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/CAT/${rollno}`);
      if (!response.ok) throw new Error('Failed to fetch CAT reports');
      const reports = await response.json();
      setCatReports(reports.reports || []);
      setMarksType('CAT');
    } catch (error) {
      console.error('Error fetching CAT reports:', error);
    }
  };

  const fetchSemMarks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/SEM/${rollno}`);
      if (!response.ok) throw new Error('Failed to fetch SEM reports');
      const reports = await response.json();
      setSemReports(reports.reports || []);
      setMarksType('SEM');
    } catch (error) {
      console.error('Error fetching SEM reports:', error);
    }
  };

  const filteredCatReports = catReports.filter((report) =>
    report.catNumber && report.catNumber.toString().includes(filteredCatNumber)
  );

  const filteredSemReports = semReports.filter((report) =>
    report.semNumber && report.semNumber.toString().includes(filteredSemNumber)
  );

  return (
    <div className="viewreport-container">
      {studentData ? (
        <>
          <h2>Student Report</h2>
          <div className="viewreport-student-info">
            <p><strong>Name:</strong> {studentData.name}</p>
            <p><strong>Roll Number:</strong> {studentData.rollno}</p>
            <p><strong>Department:</strong> {studentData.department}</p>
          </div>

          <div className="viewreport-marks-buttons">
            <button onClick={fetchCatMarks}>View CAT Marks</button>
            <button onClick={fetchSemMarks}>View SEM Marks</button>
          </div>

          {marksType === 'CAT' && (
            <div className="viewreport-marks-list">
              <h3>CAT Marks</h3>
              <input
                type="text"
                placeholder="Filter by CAT Number"
                value={filteredCatNumber}
                onChange={(e) => setFilteredCatNumber(e.target.value)}
              />
              {filteredCatReports.length > 0 ? (
                <table className="viewreport-marks-table">
                  <thead>
                    <tr>
                      <th>CAT Number</th>
                      <th>Date</th>
                      <th>Subject</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatReports.map((report, index) => (
                      <React.Fragment key={index}>
                        {report.marks.map((mark, idx) => (
                          <tr key={idx}>
                            <td>{report.catNumber}</td>
                            <td>{new Date(report.date).toLocaleDateString()}</td>
                            <td>{mark.subject}</td>
                            <td>{mark.marks}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No CAT reports available or no matches found.</p>
              )}
            </div>
          )}

          {marksType === 'SEM' && (
            <div className="viewreport-marks-list">
              <h3>SEM Marks</h3>
              <input
                type="text"
                placeholder="Filter by SEM Number"
                value={filteredSemNumber}
                onChange={(e) => setFilteredSemNumber(e.target.value)}
              />
              {filteredSemReports.length > 0 ? (
                <table className="viewreport-marks-table">
                  <thead>
                    <tr>
                      <th>SEM Number</th>
                      <th>Date</th>
                      <th>Course Code</th>
                      <th>Course ID</th>
                      <th>Credits</th>
                      <th>Marks Scored</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSemReports.map((report, index) => (
                      <React.Fragment key={index}>
                        {report.marks.map((mark, idx) => (
                          <tr key={idx}>
                            <td>{report.semNumber}</td>
                            <td>{new Date(report.date).toLocaleDateString()}</td>
                            <td>{mark.courseCode}</td>
                            <td>{mark.courseId}</td>
                            <td>{mark.credits}</td>
                            <td>{mark.marksScored}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No SEM reports available or no matches found.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
};

export default ViewReport;
