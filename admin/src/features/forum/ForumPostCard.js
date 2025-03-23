import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageCircle,
  FiHeart,
  FiEdit,
  FiTrash2,
  FiCornerDownRight,
  FiClock,
} from "react-icons/fi";
import { forumAPI } from "../../utils/api";
import CommentForm from "../../components/common/CommentForm";
import "./ForumPostCard.css";

const ForumPostCard = ({ post, currentUser, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState(post.replies || []);
  const navigate = useNavigate();

  // Toggle inline expansion
  const toggleExpand = async () => {
    if (!expanded) {
      try {
        const res = await forumAPI.getPost(post._id);
        onUpdate(res.data);
        setReplies(res.data.replies || []);
      } catch (error) {
        console.error("Failed to refresh post:", error);
      }
    }
    setExpanded(!expanded);
  };

  // Add a new reply
  const addReply = async (text) => {
    try {
      await forumAPI.addReply(post._id, { text, createdBy: currentUser?._id });
      const res = await forumAPI.getPost(post._id);
      onUpdate(res.data);
      setReplies(res.data.replies || []);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Handle deletion (only if the user is the creator)
  const handleDelete = async () => {
    try {
      await forumAPI.deletePost(post._id);
      onDelete(post._id);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="forum-post-card">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar">
            {post.createdBy?.profilePicture ||
            (currentUser &&
              post.createdBy?._id === currentUser._id &&
              currentUser.profilePicture) ? (
              <img
                src={currentUser.profilePicture}
                alt={`${post.createdBy.username}'s avatar`}
              />
            ) : post.createdBy?.profilePicture ? (
              <img
                src={post.createdBy.profilePicture}
                alt={`${post.createdBy.username}'s avatar`}
              />
            ) : (
              post.createdBy?.username?.[0]?.toUpperCase() || "A"
            )}
          </div>
          <div>
            <h3>{post.title}</h3>
            <div className="post-meta">
              <span>
                <FiClock /> {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span>{post.createdBy?.username || "Anonymous"}</span>
            </div>
          </div>
        </div>
        <div className="post-stats">
          <div className="stat-item">
            <FiMessageCircle /> {post.replies?.length || 0}
          </div>
          <div className="stat-item">
            <FiHeart /> {post.likes || 0}
          </div>
        </div>
      </div>

      <p className="post-content">
        {expanded
          ? post.content
          : post.content.substring(0, 150) +
            (post.content.length > 150 ? "..." : "")}
      </p>

      <div className="post-actions">
        <button onClick={toggleExpand} className="action-btn">
          <FiCornerDownRight /> {expanded ? "Collapse" : "Expand"}
        </button>
        {/* New "View Post" button that always appears */}
        <button
          onClick={() => navigate(`/forum/${post._id}`)}
          className="action-btn view-btn"
        >
          View Post
        </button>
        {expanded && currentUser?.id === post.createdBy && (
          <>
            <button onClick={handleDelete} className="action-btn danger">
              <FiTrash2 /> Delete
            </button>
            <button
              onClick={() => navigate(`/forum/${post._id}/edit`)}
              className="action-btn"
            >
              <FiEdit /> Edit
            </button>
          </>
        )}
      </div>

      {expanded && (
        <div className="replies-section">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <div key={reply._id} className="reply-card">
                <p>{reply.text}</p>
                <p className="reply-meta">
                  <em>By {reply.createdBy?.username || "Anonymous"}</em>
                </p>
              </div>
            ))
          ) : (
            <p className="no-replies">No replies yet.</p>
          )}
          <CommentForm onSubmit={addReply} />
        </div>
      )}
    </div>
  );
};

export default ForumPostCard;
