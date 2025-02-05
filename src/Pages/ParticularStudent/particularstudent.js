import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './particularstudent.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ParticularStudent = () => {
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState({
    departmentAverage: 70,
    collegeAverage: 60,
    studentAverage: 0,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayDetails, setSelectedDayDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendancePerPage] = useState(5);
  const [catReports, setCatReports] = useState([]);
  const [semReports, setSemReports] = useState([]);
  const [marksType, setMarksType] = useState(null);
  const [selectedMarks, setSelectedMarks] = useState(null);

  const rollno = localStorage.getItem('rollno');

  // Fetch student and attendance data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/student/${rollno}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudentData(data);

        // Calculate marks average for the student
        if (data.subjects && Array.isArray(data.subjects)) {
          const totalMarks = data.subjects.reduce((sum, subject) => sum + (subject.marks || 0), 0);
          const studentAverage = (totalMarks / data.subjects.length) || 0;
          setMarksData((prev) => ({ ...prev, studentAverage }));
        }
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

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

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/attendances/${rollno}`);
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    if (rollno) {
      fetchStudentData();
      fetchAttendanceData();
      fetchCatMarks();
      fetchSemMarks();
    }
  }, [rollno]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dayDetails = attendanceData.find((item) => item.date === date);
    if (dayDetails) {
      setSelectedDayDetails(dayDetails.attendance);
    } else {
      setSelectedDayDetails([]);
    }
  };

  const handleMarksClick = (marks) => {
    setSelectedMarks(marks);
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(attendanceData.length / attendancePerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastAttendance = currentPage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendanceData = attendanceData.slice(indexOfFirstAttendance, indexOfLastAttendance);

  if (!studentData) {
    return <p>Loading student details...</p>;
  }

  const barChartData = {
    labels: attendanceData.map((a) => a.date),
    datasets: [
      {
        label: 'Attendance Percentage (%)',
        data: attendanceData.map((a) => {
          const totalPeriod = a.attendance ? a.attendance.length : 0;
          const attendedPeriod = a.attendance ? a.attendance.filter((item) => item.status === 'Present').length : 0;
          return totalPeriod ? (attendedPeriod / totalPeriod) * 100 : 0;
        }),
        backgroundColor: attendanceData.map((a) => {
          const totalPeriod = a.attendance ? a.attendance.length : 0;
          const attendedPeriod = a.attendance ? a.attendance.filter((item) => item.status === 'Present').length : 0;
          return totalPeriod && (attendedPeriod / totalPeriod) * 100 > 75
            ? 'rgba(75, 192, 192, 0.8)'
            : 'rgba(255, 99, 132, 0.8)';
        }),
        borderColor: attendanceData.map((a) => {
          const totalPeriod = a.attendance ? a.attendance.length : 0;
          const attendedPeriod = a.attendance ? a.attendance.filter((item) => item.status === 'Present').length : 0;
          return totalPeriod && (attendedPeriod / totalPeriod) * 100 > 75
            ? 'rgba(75, 192, 192, 1)'
            : 'rgba(255, 99, 132, 1)';
        }),
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  const renderCircularChart = (percentage, text) => {
    const pathColor = percentage >= 75 ? '#4a90e2' : '#ff6384';
    return (
      <div className="circular-chart">
        <CircularProgressbar
          value={percentage}
          text={`${percentage.toFixed(1)}%`}
          styles={buildStyles({
            pathColor: pathColor,
            textColor: '#333',
            trailColor: '#ddd',
            backgroundColor: '#f8f8f8',
          })}
        />
        <p>{text}</p>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Student Details</h2>
      <table className="table">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{studentData.name}</td>
            <td>Email</td>
            <td>{studentData.email}</td>
          </tr>
          <tr>
            <td>Roll No</td>
            <td>{studentData.rollno}</td>
            <td>Phone</td>
            <td>{studentData.phone}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>{studentData.department}</td>
            <td>Class</td>
            <td>{studentData.className}</td>
          </tr>
          <tr>
            <td>Section</td>
            <td>{studentData.section}</td>
            <td>Year</td>
            <td>{studentData.year}</td>
          </tr>
        </tbody>
      </table>

      <div className="viewreport-marks-buttons">
        <button onClick={() => setMarksType('CAT')}>View CAT Marks</button>
        <button onClick={() => setMarksType('SEM')}>View SEM Marks</button>
      </div>

      {marksType === 'CAT' && (
        <div className="viewreport-marks-list">
          <h3>CAT Marks</h3>
          <table className="viewreport-marks-table">
            <thead>
              <tr>
                <th>CAT Number</th>
                <th>Date</th>
                <th>Subject</th>
                <th>Marks (50)</th>
              </tr>
            </thead>
            <tbody>
              {catReports.map((report, index) => (
                <React.Fragment key={index}>
                  {report.marks.map((mark, idx) => (
                    <tr key={idx} onClick={() => handleMarksClick(mark)}>
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
        </div>
      )}
      {marksType === 'SEM' && (
        <div className="viewreport-marks-list">
          <h3>SEM Marks</h3>
          <table className="viewreport-marks-table">
            <thead>
              <tr>
                <th>SEM Number</th>
                <th>Date</th>
                <th>Course Code</th>
                <th>Marks (100)</th>
              </tr>
            </thead>
            <tbody>
              {semReports.map((report, index) => (
                <React.Fragment key={index}>
                  {report.marks.map((mark, idx) => (
                    <tr key={idx} onClick={() => handleMarksClick(mark)}>
                      <td>{report.semNumber}</td>
                      <td>{new Date(report.date).toLocaleDateString()}</td>
                      <td>{mark.courseCode}</td>
                      <td>{mark.marksScored}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMarks && (
        <div className="viewreport-selected-marks">
          <h4>Selected Marks Details</h4>
          <p><strong>Subject:</strong> {selectedMarks.subject || selectedMarks.courseCode}</p>
          <p><strong>Marks:</strong> {selectedMarks.marks || selectedMarks.marksScored}</p>
        </div>
      )}
      <h2>Performance Overview</h2>
    <div className="performance-overview">
      {renderCircularChart(marksData.studentAverage, 'Your Average')}
      {renderCircularChart(marksData.departmentAverage, 'Department Average')}
      {renderCircularChart(marksData.collegeAverage, 'College Average')}
    </div>

      <h2>Attendance</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Day</th>
            <th>Total Periods</th>
            <th>Attended Periods</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.length === 0 ? (
            <tr>
              <td colSpan="4">No attendance records found</td>
            </tr>
          ) : (
            currentAttendanceData.map((attendance, index) => {
              const attendedPeriod = attendance.attendance ? attendance.attendance.filter((item) => item.status === 'Present').length : 0;
              const totalPeriod = attendance.attendance ? attendance.attendance.length : 0;
              return (
                <
                tr key={index} onClick={() => handleDateClick(attendance.date)}>
                <td>{new Date(attendance.date).toLocaleDateString()}</td>
                <td>{new Date(attendance.date).toLocaleString('en-US', { weekday: 'long' })}</td>
                <td>{totalPeriod}</td>
                <td>{attendedPeriod}</td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>

    {attendanceData.length > attendancePerPage && (
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(attendanceData.length / attendancePerPage)}
        </span>
        <button onClick={nextPage} disabled={currentPage === Math.ceil(attendanceData.length / attendancePerPage)}>
          Next
        </button>
      </div>
    )}

    {selectedDayDetails.length > 0 && (
      <div className="selected-day-details">
        <h4>Attendance Details for {new Date(selectedDate).toLocaleDateString()}</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedDayDetails.map((detail, index) => (
              <tr key={index}>
                <td>{detail.periodNumber}</td>
                <td>{detail.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    <h2>Attendance Overview</h2>
    <div className="attendance-overview">
      <Bar data={barChartData} options={barChartOptions} />
    </div>
  </div>
);
};

export default ParticularStudent;