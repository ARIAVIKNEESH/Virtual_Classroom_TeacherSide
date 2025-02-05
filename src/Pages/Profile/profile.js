import React, { useEffect, useState } from 'react';
import './profile.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const teacherId = localStorage.getItem('teacherId');
  const [teacherData, setTeacherData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teacher/${teacherId}`);
        const data = await response.json();
        if (response.ok) {
          setTeacherData(data);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    if (teacherId) {
      fetchTeacherData();
    }
  }, [teacherId]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    setTeacherData({
      ...teacherData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/teacher/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();
      if (response.ok) {
        setTeacherData(data.teacher);
        setIsEditing(false);
        alert('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); 
  };

  return (
    <div id="profile-container" className="container d-flex justify-content-center mt-5">
      <div className="card profile-card shadow-sm border-0">
        <div className="card-body">
          <h2 id="profile-title" className="card-title text-center mb-4 fade-in-title">Profile</h2>

          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Date of Birth', name: 'dob', type: 'date', format: true },
            { label: 'Experience', name: 'experience', type: 'text' },
            { label: 'Specialization', name: 'specialization', type: 'text' },
            { label: 'Phone', name: 'phone', type: 'text' },
          ].map((field, index) => (
            <div
              className="mb-3 row profile-row fade-in"
              style={{ animationDelay: `${index * 0.3}s` }}
              key={index}
            >
              <label className="col-sm-4 col-form-label text-muted profile-label">{field.label}:</label>
              <div className="col-sm-8">
                {isEditing ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      field.format
                        ? teacherData[field.name]?.slice(0, 10)
                        : teacherData[field.name] || ''
                    }
                    onChange={handleChange}
                    className="form-control profile-input"
                  />
                ) : (
                  <p className="form-control-plaintext profile-value">
                    {field.format ? formatDate(teacherData[field.name]) : teacherData[field.name] || 'N/A'}
                  </p>
                )}
              </div>
            </div>
          ))}

          <div className="mb-3 row profile-row fade-in" style={{ animationDelay: `${5 * 0.3}s` }}>
            <label className="col-sm-4 col-form-label text-muted profile-label">Gender:</label>
            <div className="col-sm-8">
              {isEditing ? (
                <select name="gender" value={teacherData.gender || ''} onChange={handleChange} className="form-control profile-select">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="form-control-plaintext profile-value">{teacherData.gender || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="mb-4 row profile-row fade-in" style={{ animationDelay: `${6 * 0.3}s` }}>
            <label className="col-sm-4 col-form-label text-muted profile-label">Address:</label>
            <div className="col-sm-8">
              {isEditing ? (
                <textarea name="address" value={teacherData.address || ''} onChange={handleChange} className="form-control profile-textarea" />
              ) : (
                <p className="form-control-plaintext profile-value">{teacherData.address || 'N/A'}</p>
              )}
            </div>
          </div>

          <div className="text-center">
            <button onClick={handleEditToggle} id="profile-edit-button" className="btn btn-primary mx-2 fade-in" style={{ animationDelay: `${7 * 0.3}s` }}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button onClick={handleSave} id="profile-save-button" className="btn btn-success mx-2 fade-in" style={{ animationDelay: `${8 * 0.3}s` }}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;