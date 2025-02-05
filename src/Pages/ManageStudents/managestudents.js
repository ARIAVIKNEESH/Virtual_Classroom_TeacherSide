import React, { useState } from "react";
import "./managestudents.css";

const ManageStudents = () => {
  const teacherId = localStorage.getItem("teacherId");

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    rollno: "",
    phone: "",
    address: "",
    department: "",
    className: "",
    section: "",
    year: "",
  });

  const departments = [
    "IT", "CSE", "AIDS", "AIML", "CIVIL", "MECHANICAL", 
    "ECE", "EEE", "EIE", "MECHATRONICS", "CSD", "CHEMICAL", "FT"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/managestudents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, ...studentDetails }),
      });
      if (response.ok) {
        alert("Student added successfully!");
        setStudentDetails({
          name: "",
          email: "",
          rollno: "",
          phone: "",
          address: "",
          department: "",
          className: "",
          section: "",
          year: "",
        });
      } else {
        alert("Failed to add student.");
      }
    } catch (error) {
      console.error("Error adding student", error);
    }
  };

  return (
    <div className="manage-students__container">
      <h2 className="manage-students__title">Manage Students</h2>
      <form className="students-form" onSubmit={handleSubmit}>
        {[
          { label: "Name", name: "name", type: "text", required: true },
          { label: "Email", name: "email", type: "email", required: true },
          { label: "Roll No", name: "rollno", type: "text", required: true },
          { label: "Phone", name: "phone", type: "text" },
          { label: "Address", name: "address", type: "text" },
          { label: "Class", name: "className", type: "text" },
          { label: "Section", name: "section", type: "text" },
          { label: "Year", name: "year", type: "text" },
        ].map(({ label, name, type, required }) => (
          <div className="input-group" key={name}>
            <label className="manage-students__label">{label}</label>
            <input
              type={type}
              name={name}
              value={studentDetails[name]}
              onChange={handleChange}
              className="manage-students__input"
              required={required}
            />
          </div>
        ))}
        <div className="input-group">
          <label className="manage-students__label">Department</label>
          <select
            name="department"
            value={studentDetails.department}
            onChange={handleChange}
            className="manage-students__select"
            required
          >
            <option value="">Select Department</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="manage-students__submit-btn">Add Student</button>
      </form>
    </div>
  );
};

export default ManageStudents;
