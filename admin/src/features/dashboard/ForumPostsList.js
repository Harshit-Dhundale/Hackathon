// client/src/features/dashboard/ForumPostsList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments,
  faFilePen,
  faMessage,
  faArrowRight,
  faPlus,
  faCircleCheck,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import styles from './ForumPostsList.module.css';

const ForumPostsList = ({ forumPosts }) => {
  const navigate = useNavigate();

  const handleViewPost = (postId) => {
    navigate(`/forum/${postId}`);
  };

  const getPostIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'question':
        return faQuestionCircle;
      case 'resolved':
        return faCircleCheck;
      default:
        return faMessage;
    }
  };

  return (
    <div className={styles.forumPostsCard}>
      <div className={styles.forumCardHeader}>
        <FontAwesomeIcon icon={faComments} className={styles.headerIcon} />
        <h2>Community Discussions</h2>
      </div>

      {forumPosts.length > 0 ? (
        <div className={styles.postsGrid}>
          {forumPosts.map((post) => (
            <div key={post._id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <FontAwesomeIcon 
                  icon={getPostIcon(post.category)} 
                  className={`${styles.categoryIcon} ${post.category?.toLowerCase() === 'question' ? styles.question : ''} ${post.category?.toLowerCase() === 'resolved' ? styles.resolved : ''}`} 
                />
                <div className={styles.postMeta}>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <span className={styles.postCategory}>{post.category || 'Discussion'}</span>
                </div>
              </div>
              <p className={styles.postExcerpt}>{post.content.substring(0, 100)}...</p>
              <div className={styles.postFooter}>
                <div className={styles.postStats}>
                  <span className={styles.postDate}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className={styles.commentCount}>
                    <FontAwesomeIcon icon={faMessage} /> {post.comments?.length || 0}
                  </span>
                </div>
                <button 
                  className={styles.viewPostBtn}
                  onClick={() => handleViewPost(post._id)}
                >
                  Continue Discussion
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FontAwesomeIcon icon={faFilePen} className={styles.emptyIcon} />
          <p>No posts yet. Start a discussion with the community!</p>
          <button 
            className={styles.createPostBtn}
            onClick={() => navigate('/forum')}
          >
            <FontAwesomeIcon icon={faPlus} />
            Create New Post
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumPostsList;
