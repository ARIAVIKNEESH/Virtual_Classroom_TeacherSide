import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaGraduationCap, FaUsers, FaChalkboardTeacher, FaUserCheck,FaChartBar,FaComments,FaClipboardList,FaCalendarAlt,FaRegCalendarCheck } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container bg-dark vh-100">
      <ul className="sidebar-menu list-unstyled p-3">
        <li className="sidebar-item mb-3">
          <Link to="/home" className="sidebar-link d-flex align-items-center text-white">
            <FaHome className="sidebar-icon me-2" />
            <span className="sidebar-text">Dashboard</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
          <Link to="/assessmentsdisplay" className="sidebar-link d-flex align-items-center text-white">
            <FaBook className="sidebar-icon me-2" />
            <span className="sidebar-text">Assessments</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
          <Link to="/courses" className="sidebar-link d-flex align-items-center text-white">
            <FaGraduationCap className="sidebar-icon me-2" />
            <span className="sidebar-text">Courses</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
          <Link to="/onlineplatforms" className="sidebar-link d-flex align-items-center text-white">
            <FaChalkboardTeacher className="sidebar-icon me-2" />
            <span className="sidebar-text">Other Platforms</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
         <Link to="/live-sessions" className="sidebar-link d-flex align-items-center text-white">
          <FaCalendarAlt className="sidebar-icon me-2" />
          <span className="sidebar-text">Live Sessions</span>
         </Link>
        </li>
        <li className="sidebar-item mb-3">
          <Link to="/manage-students" className="sidebar-link d-flex align-items-center text-white">
            <FaUsers className="sidebar-icon me-2" />
            <span className="sidebar-text">Manage Students</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
          <Link to="/track-students" className="sidebar-link d-flex align-items-center text-white">
            <FaUserCheck className="sidebar-icon me-2" />
            <span className="sidebar-text">Track Students</span>
          </Link>
        </li>
        <li className="sidebar-item mb-3">
      <Link to="/attendance" className="sidebar-link d-flex align-items-center text-white">
        <FaRegCalendarCheck className="sidebar-icon me-2" />
        <span className="sidebar-text">Attendance</span>
      </Link>
    </li>
        <li className="sidebar-item mb-3">
  <Link to="/student" className="sidebar-link d-flex align-items-center text-white">
    <FaChartBar className="sidebar-icon me-2" />
    <span className="sidebar-text">Reports</span>
  </Link>
</li>
<li className="sidebar-item mb-3">
  <Link to="/discussions" className="sidebar-link d-flex align-items-center text-white">
    <FaComments className="sidebar-icon me-2" />
    <span className="sidebar-text">Discussions</span>
  </Link>
</li>
<li className="sidebar-item mb-3">
  <Link to="/sap" className="sidebar-link d-flex align-items-center text-white">
    <FaClipboardList className="sidebar-icon me-2" />
    <span className="sidebar-text">SAP Points</span>
  </Link>
</li>



      </ul>
    </div>
  );
};

export default Sidebar;
