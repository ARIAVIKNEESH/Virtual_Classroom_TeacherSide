import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './trackstudents.css';

const TrackStudents = () => {
  const navigate = useNavigate(); 
  const teacherId = localStorage.getItem('teacherId'); 

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    rollno: '',
    department: '',
    year: '',
    section: '',
    phone: '',
    address: '',
    className: '',
    attendance: false,
    marks: false,
  });

  const [columns, setColumns] = useState({
    email: false,
    phone: false,
    address: false,
    department: false,
    section: false,
    className: false,
    year: false,
    attendance: false,
    marks: false,
  });

  const [expandedRows, setExpandedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 9;
  const [sortOrder, setSortOrder] = useState('asc'); 

  const departments = [
    "IT", "CSE", "AIDS", "AIML", "CIVIL", "MECHANICAL",
    "ECE", "EEE", "EIE", "MECHETRONICS", "CSD", "CHEMICAL", "FT"
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/managestudents/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();

        const studentsWithAverage = data.map((student) => ({
          ...student,
          averageMarks: student.subjects.reduce((sum, sub) => sum + sub.marks, 0) / student.subjects.length,
        }));
        const sortedStudents = studentsWithAverage.sort((a, b) => a.name.localeCompare(b.name));
        
        setStudents(sortedStudents);
        setFilteredStudents(sortedStudents);
      } catch (error) {
        console.error('Error fetching students', error);
      }
    };

    if (teacherId) {
      fetchStudents();
    }
  }, [teacherId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      filterStudents(updatedFilters);
      return updatedFilters;
    });
  };

  const filterStudents = (updatedFilters) => {
    let filtered = [...students];

    if (updatedFilters.name) {
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(updatedFilters.name.toLowerCase())
      );
    }
    if (updatedFilters.email) {
      filtered = filtered.filter((student) =>
        student.email.toLowerCase().includes(updatedFilters.email.toLowerCase())
      );
    }
    if (updatedFilters.rollno) {
      filtered = filtered.filter((student) =>
        student.rollno.toLowerCase().includes(updatedFilters.rollno.toLowerCase())
      );
    }
    if (updatedFilters.department) {
      filtered = filtered.filter((student) =>
        student.department.toLowerCase() === updatedFilters.department.toLowerCase()
      );
    }
    if (updatedFilters.year) {
      filtered = filtered.filter((student) =>
        student.year.toLowerCase().includes(updatedFilters.year.toLowerCase())
      );
    }
    if (updatedFilters.section) {
      filtered = filtered.filter((student) =>
        student.section.toLowerCase().includes(updatedFilters.section.toLowerCase())
      );
    }
    if (updatedFilters.phone) {
      filtered = filtered.filter((student) =>
        student.phone.toLowerCase().includes(updatedFilters.phone.toLowerCase())
      );
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.averageMarks - b.averageMarks);
    } else {
      filtered.sort((a, b) => b.averageMarks - a.averageMarks);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleColumnToggle = (e) => {
    const { name, checked } = e.target;
    setColumns((prevColumns) => ({
      ...prevColumns,
      [name]: checked,
    }));
  };

  const handleSortByAverageMarks = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    filterStudents(filters);
  };

  const toggleRowExpansion = (rollno) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(rollno)
        ? prevExpandedRows.filter((id) => id !== rollno)
        : [...prevExpandedRows, rollno]
    );
  };

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
  const currentData = filteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="track-students-container">
    <h2 className="page-title">Track Students</h2>

    <div className="filter-section">
      <label className="filter-label">
        Department:
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </label>
    </div>

    <div className="sort-section">
      <button onClick={handleSortByAverageMarks} className="sort-button">
        Sort by Average Marks ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
    </div>

    <div className="toggle-columns-section">
      {Object.keys(columns).map((col) => (
        <label key={col} className="toggle-label">
          <input
            type="checkbox"
            name={col}
            onChange={handleColumnToggle}
            className="toggle-checkbox"
          />
          {col.charAt(0).toUpperCase() + col.slice(1)}
        </label>
      ))}
    </div>

    <table className="students-table">
      <thead className="table-header">
        <tr>
          <th>Name</th>
          <th>Roll Number</th>
          {columns.email && <th>Email</th>}
          {columns.phone && <th>Phone</th>}
          {columns.address && <th>Address</th>}
          {columns.department && <th>Department</th>}
          {columns.section && <th>Section</th>}
          {columns.className && <th>Class</th>}
          {columns.year && <th>Year</th>}
          {columns.attendance && <th>Attendance</th>}
          {columns.marks && <th>Marks</th>}
          <th>Average Marks</th>
        </tr>
      </thead>
      <tbody className="table-body">
        {currentData.map((student) => (
          <React.Fragment key={student.rollno}>
            <tr
              className={`table-row ${expandedRows.includes(student.rollno) ? 'expanded' : ''}`}
              onClick={() => toggleRowExpansion(student.rollno)}
            >
              <td>{student.name}</td>
              <td>{student.rollno}</td>
              {columns.email && <td>{student.email}</td>}
              {columns.phone && <td>{student.phone}</td>}
              {columns.address && <td>{student.address}</td>}
              {columns.department && <td>{student.department}</td>}
              {columns.section && <td>{student.section}</td>}
              {columns.className && <td>{student.className}</td>}
              {columns.year && <td>{student.year}</td>}
              {columns.attendance && (
                <td>
                  {student.attendance
                    .map((att) => `${att.date}: ${att.attendedPeriod}/${att.totalPeriod}`)
                    .join(', ')}
                </td>
              )}
              {columns.marks && (
                <td>
                  {student.subjects
                    .map((sub) => `${sub.subjectName}: ${sub.marks}`)
                    .join(', ')}
                </td>
              )}
              <td>{student.averageMarks.toFixed(2)}</td>
            </tr>
            {expandedRows.includes(student.rollno) && (
              <tr className="expanded-row-details">
                <td colSpan="12" className="expanded-details-cell">
                  <div className="detail"><strong>Address:</strong> {student.address}</div>
                  <div className="detail"><strong>Phone:</strong> {student.phone}</div>
                  <div className="detail"><strong>Subjects:</strong> {student.subjects.map((sub) => `${sub.subjectName}: ${sub.marks}`).join(', ')}</div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>

    <div className="pagination-controls">
      <button onClick={goToPreviousPage} disabled={currentPage === 1} className="pagination-button">
        Previous
      </button>
      <span className="pagination-info">
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={goToNextPage} disabled={currentPage === totalPages} className="pagination-button">
        Next
      </button>
    </div>

    <button onClick={() => navigate('/student-wise')} className="details-button">
      View Student-wise Details
    </button>
  </div>
  );
};

export default TrackStudents;
