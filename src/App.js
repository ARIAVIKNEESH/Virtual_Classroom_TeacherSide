import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';
import Home from './components/Home/home';
import Sidebar from './components/Sidebar/sidebar';
import Profile from './Pages/Profile/profile';
import ManageStudents from './Pages/ManageStudents/managestudents';
import TrackStudents from './Pages/TrackStudents/trackstudents';
import StudentDetails from './Pages/StudentDetails/studentdetails';
import OnlinePlatforms from './Pages/OnlinePlatforms/onlineplatforms';
import ParticularStudent from './Pages/ParticularStudent/particularstudent';
import Course from './Pages/Course/course';
import AddCourse from './Pages/Addcourse/addcourse';
import Assessments from './Pages/Assessments/assessments';
import AssessmentsDisplay from './Pages/Assessmentsdisplay/assessmentsdisplay';
import AssessmentsDetails from './Pages/Assessmentsdetails/assessmentsdetails';
import './App.css';
import Discussions from './Pages/Discussions/discussions';
import SAP from './Pages/SAP/sap';
import SAPDetails from './Pages/SapDetails/sapdetails';
import Student from './Pages/Mark-Reports/student';
import AddReport from './Pages/AddReport/addreport';
import ViewReport from './Pages/ViewReport/viewreport';
import Attendance from './Pages/Attendance/attendance';
import LiveSession from './Pages/LiveSession/livesessions';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const teacherId = localStorage.getItem('teacherId');
    const email = localStorage.getItem('email');
    if (teacherId || email) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        {loggedIn && <Sidebar />}
        
        <div className={loggedIn ? 'main-content' : 'full-width-content'}>
          <Routes>
            <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/track-students" element={<TrackStudents />} />
            <Route path="/student-wise" element={<StudentDetails />} />
            <Route path="/onlineplatforms" element={<OnlinePlatforms />} />
            <Route path="/particularstudent" element={<ParticularStudent />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/assessmentsdisplay" element={<AssessmentsDisplay />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/assessmentdetails/:assessmentId" element={<AssessmentsDetails />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/sap" element={<SAP />} />
            <Route path="/student" element={<Student />} />
            <Route path="/addreport" element={<AddReport />} />
            <Route path="/viewreport" element={<ViewReport />} />
            <Route path="/sapdetails" element={<SAPDetails />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/live-sessions" element={<LiveSession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
