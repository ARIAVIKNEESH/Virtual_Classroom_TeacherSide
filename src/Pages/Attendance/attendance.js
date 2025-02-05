import React, { useState, useEffect } from 'react';
import './attendance.css';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [newAttendance, setNewAttendance] = useState({
    date: '',
    day: '',
    totalPeriods: 0,
    attendance: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const teacherId = localStorage.getItem('teacherId');
        const response = await fetch(`http://localhost:5000/api/managestudents/${teacherId}`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError('Failed to fetch student list');
      }
    };
    fetchStudents();
  }, []);

  const handleStudentSelection = (student) => {
    if (!selectedStudents.some((s) => s.rollno === student.rollno)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const removeSelectedStudent = (rollno) => {
    setSelectedStudents(selectedStudents.filter((s) => s.rollno !== rollno));
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      alert('No students selected.');
      return;
    }

    const payloads = selectedStudents.map((student) => ({
      rollNo: student.rollno,
      date: newAttendance.date,
      day: newAttendance.day,
      attendance: newAttendance.attendance.map((period) => ({
        periodNumber: period.periodNumber,
        status: period.status,
      })),
    }));

    try {
      for (const payload of payloads) {
        const response = await fetch('http://localhost:5000/addAttendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add attendance');
        }
      }

      alert('Attendance marked successfully.');
      setNewAttendance({ date: '', day: '', totalPeriods: 0, attendance: [] });
      setSelectedStudents([]);
      setSearchTerm('');
    } catch (err) {
      console.error(err.message);
      setError(err.message || 'Failed to add attendance');
    }
  };

  const generatePeriods = (totalPeriods) => {
    const attendanceArray = Array.from({ length: totalPeriods }, (_, index) => ({
      periodNumber: index + 1,
      status: 'Present', // Default to Present
    }));
    setNewAttendance((prev) => ({ ...prev, attendance: attendanceArray }));
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance Management</h1>
      {error && <div className="attendance-error">{error}</div>}

      <div className="attendance-left">
        {/* Search Bar */}
        <div className="attendance-search">
          <input
            type="text"
            placeholder="Search by Roll Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="attendance-input"
          />
          <div className="attendance-results">
            {students
              .filter((student) => student.rollno.includes(searchTerm))
              .map((student) => (
                <div
                  key={student.rollno}
                  onClick={() => handleStudentSelection(student)}
                  className="attendance-search-result"
                >
                  {student.rollno} - {student.name}
                </div>
              ))}
          </div>
        </div>

        {/* Selected Students */}
        <div className="attendance-selected">
          <h3>Selected Students</h3>
          {selectedStudents.map((student) => (
            <div key={student.rollno} className="attendance-selected-student">
              {student.rollno} - {student.name}
              <button
                onClick={() => removeSelectedStudent(student.rollno)}
                className="attendance-remove-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Attendance Form */}
      <div className="attendance-right">
        <div className="attendance-form">
          <h2 className="attendance-form-title">Mark Attendance</h2>
          <label>
            Date:
            <input
              type="date"
              value={newAttendance.date}
              onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
              className="attendance-input"
            />
          </label>
          <label>
            Day:
            <input
              type="text"
              placeholder="Day (e.g., Monday)"
              value={newAttendance.day}
              onChange={(e) => setNewAttendance({ ...newAttendance, day: e.target.value })}
              className="attendance-input"
            />
          </label>
          <label>
            Total Periods:
            <input
              type="number"
              min="1"
              value={newAttendance.totalPeriods}
              onChange={(e) => {
                const total = parseInt(e.target.value, 10) || 0;
                setNewAttendance({ ...newAttendance, totalPeriods: total });
                generatePeriods(total);
              }}
              className="attendance-input"
            />
          </label>
          {newAttendance.attendance.map((period, index) => (
            <div key={index} className="attendance-period">
              <label>
                Period {period.periodNumber}:
                <select
                  value={period.status}
                  onChange={(e) =>
                    setNewAttendance((prev) => ({
                      ...prev,
                      attendance: prev.attendance.map((p, i) =>
                        i === index ? { ...p, status: e.target.value } : p
                      ),
                    }))
                  }
                  className="attendance-select"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </label>
            </div>
          ))}
          <button onClick={handleSubmit} className="attendance-submit-button">
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
