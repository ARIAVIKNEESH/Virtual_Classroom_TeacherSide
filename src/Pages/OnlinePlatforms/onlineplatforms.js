import React, { useEffect, useState, useCallback } from 'react';
import './onlineplatforms.css';

const OnlinePlatforms = () => {
    const [platforms, setPlatforms] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        link: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        image: '',
        status: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editing, setEditing] = useState(false);
    const [currentPlatformId, setCurrentPlatformId] = useState(null);

    const teacherid = localStorage.getItem('teacherId');

    const fetchPlatforms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/platforms?teacherid=${teacherid}`);
            const data = await response.json();
            setPlatforms(data);
        } catch (err) {
            setError('Error fetching platforms');
        } finally {
            setLoading(false);
        }
    }, [teacherid]);

    useEffect(() => {
        if (teacherid) {
            fetchPlatforms();
        } else {
            setError('Teacher ID not found in local storage.');
        }
    }, [teacherid, fetchPlatforms]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        try {
            const platformData = { ...formData, teacherid };
            const endpoint = editing 
                ? `http://localhost:5000/api/platforms/${currentPlatformId}`
                : 'http://localhost:5000/api/platforms';
            const method = editing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(platformData),
            });

            if (response.ok) {
                fetchPlatforms();
                setSuccessMessage(editing ? 'Platform updated successfully!' : 'Platform added successfully!');
                setFormData({
                    name: '',
                    link: '',
                    startDate: '',
                    endDate: '',
                    startTime: '',
                    endTime: '',
                    image: '',
                    status: '',
                });
                setEditing(false);
                setCurrentPlatformId(null);
            } else {
                setError(editing ? 'Error updating platform' : 'Error adding platform');
            }
        } catch (err) {
            setError(editing ? 'Error updating platform' : 'Error adding platform');
        }
    };

    const handleEdit = (platform) => {
        setEditing(true);
        setCurrentPlatformId(platform._id);
        setFormData({
            name: platform.name,
            link: platform.link,
            startDate: platform.startDate,
            endDate: platform.endDate,
            startTime: platform.startTime,
            endTime: platform.endTime,
            image: platform.image,
            status: platform.status,
        });
    };

    return (
        <div className="platforms-page">
            <div className="assessment__container">
                <h2 className="assessment__title">{editing ? 'Edit Platform' : 'Add Platform'}</h2>
                
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <label className="assessment__label">Platform Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">Platform Link</label>
                    <input type="text" name="link" value={formData.link} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">Start Time</label>
                    <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">End Time</label>
                    <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="assessment__input" required />

                    <label className="assessment__label">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="assessment__input" required>
                        <option value="">Select Status</option>
                        <option value="live">Live</option>
                        <option value="false">False</option>
                    </select>

                    <button type="submit" className="assessment__post-btn">{editing ? 'Update Platform' : 'Add Platform'}</button>
                </form>
            </div>

            <div className="platforms-list">
                {loading ? (
                    <div>Loading platforms...</div>
                ) : (
                    platforms.map((platform) => (
                        <div className="platform-box" key={platform._id}>
                            <img src={platform.image} alt={platform.name} className="platform-image" />
                            <div className="platform-details">
                                <h3>{platform.name}</h3>
                                <p><strong>Link:</strong> <a href={platform.link} target="_blank" rel="noopener noreferrer">{platform.link}</a></p>
                                <p><strong>Start Date:</strong> {new Date(platform.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(platform.endDate).toLocaleDateString()}</p>
                                <p><strong>Start Time:</strong> {platform.startTime}</p>
                                <p><strong>End Time:</strong> {platform.endTime}</p>
                                <p><strong>Status:</strong> <span className={platform.status === 'live' ? 'status-live' : 'status-false'}>{platform.status}</span></p>
                                <button onClick={() => handleEdit(platform)} className="edit-button">Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OnlinePlatforms;
