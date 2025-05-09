// client/src/features/forum/CreatePost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../../utils/api';
import HeroHeader from '../../components/common/HeroHeader';  // Import HeroHeader
import './CreatePost.css'; // Ensure your styles are here

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await forumAPI.createPost(post);
      // After creation, redirect to the new post's page
      navigate(`/forum/${response.data._id}`);
    } catch (err) {
      setError('Failed to create post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HeroHeader with background image */}
      <HeroHeader
        title="Create a New Post"
        subtitle="Share your thoughts, ask a question, or spark a conversation."
        backgroundImage="/assets/head/forum.jpg"  // Path to image in public folder
      />

      <div className="create-post-container">
        <h1>Create New Post</h1>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
