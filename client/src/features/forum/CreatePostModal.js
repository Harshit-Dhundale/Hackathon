import React, { useState } from 'react';
import { forumAPI } from '../../utils/api';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [post, setPost] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // ✅ Form Validation Function
  const isFormValid = () => {
    if (post.title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return false;
    }
    if (post.content.trim().length < 10) {
      setError("Content must be at least 10 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // ✅ Prevent form submission if validation fails
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const response = await forumAPI.createPost(post);
      onPostCreated(response.data); // Notify parent component
      onClose(); // Close modal
    } catch (err) {
      // ✅ Handle API validation errors if present
      if (err.errors) {
        setError(err.errors.join(' '));
      } else {
        setError('Failed to create post.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Content:</label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
