import React, { useState, useEffect } from 'react';
import './discussions.css';

const Discussions = () => {
  const teacherId = localStorage.getItem('teacherId');
  const userName = localStorage.getItem('name');
  const [discussions, setDiscussions] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [error, setError] = useState(null);

  // Fetch discussions on mount
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/getDiscussions/${teacherId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch discussions');
        }
        const data = await response.json();

        if (Array.isArray(data)) {
          setDiscussions(data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDiscussions();
  }, [teacherId]);

  // Add new discussion
  const addDiscussion = async () => {
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    const newDiscussion = {
      _id: Date.now().toString(), // Temporary ID
      teacherId,
      name: userName,
      message: newMessage,
      replies: [],
    };

    // Optimistically update the UI
    setDiscussions((prev) => [...prev, newDiscussion]);
    setNewMessage('');
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/addDiscussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDiscussion),
      });

      if (!response.ok) {
        throw new Error('Failed to add discussion');
      }

      const data = await response.json();
      if (data.success) {
        // Replace the temporary discussion with the actual one from the server
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === newDiscussion._id ? data.newDiscussion : discussion
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Save edited discussion
  const saveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/editDiscussion/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editedMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit discussion');
      }

      const data = await response.json();
      if (data.success) {
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === id ? data.updatedDiscussion : discussion
          )
        );
        setEditingId(null);
        setEditedMessage('');
        setError(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Add reply to a discussion
  const addReply = async (id) => {
    const replyMessage = replyInputs[id];
    if (!replyMessage.trim()) return;

    const newReply = { name: userName, replyMessage };

    // Optimistically update the UI
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion._id === id
          ? { ...discussion, replies: [...discussion.replies, newReply] }
          : discussion
      )
    );
    setReplyInputs({ ...replyInputs, [id]: '' });

    try {
      const response = await fetch(`http://localhost:5000/addReply/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReply),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const data = await response.json();
      if (data.success) {
        setDiscussions((prev) =>
          prev.map((discussion) =>
            discussion._id === id ? data.updatedDiscussion : discussion
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="discussions-container">
      <h2>Discussions</h2>
      {error && <div className="error-message">{error}</div>}

      <input
        type="text"
        placeholder="Add a message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="discussions-input"
      />
      <button onClick={addDiscussion} className="discussions-add-button">
        Add Discussion
      </button>

      {discussions.map((discussion) =>
        discussion && discussion._id ? (
          <div key={discussion._id} className="discussions-message-container">
            {editingId === discussion._id ? (
              <div>
                <input
                  type="text"
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="discussions-edit-input"
                />
                <button
                  onClick={() => saveEdit(discussion._id)}
                  className="discussions-edit-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="discussions-cancel-button"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p className="discussions-message">{discussion.message}</p>
                <button
                  onClick={() => {
                    setEditingId(discussion._id);
                    setEditedMessage(discussion.message);
                  }}
                  className="discussions-edit-button"
                >
                  Edit
                </button>
              </>
            )}

            <div className="discussions-replies-container">
              {Array.isArray(discussion.replies) &&
                discussion.replies.map((reply, index) => (
                  <p key={index} className="discussions-reply">
                    {reply.name}: {reply.replyMessage}
                  </p>
                ))}

              <input
                type="text"
                placeholder="Reply"
                value={replyInputs[discussion._id] || ''}
                onChange={(e) =>
                  setReplyInputs({
                    ...replyInputs,
                    [discussion._id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addReply(discussion._id);
                }}
                className="discussions-reply-input"
              />
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default Discussions;
