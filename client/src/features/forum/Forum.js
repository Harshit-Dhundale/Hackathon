import React, { useEffect, useState } from 'react';
import { forumAPI } from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
import ForumPostCard from './ForumPostCard';
import HeroHeader from '../../components/common/HeroHeader';
import CreatePostModal from './CreatePostModal'; // New modal component
import './Forum.css';

const Forum = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  const loadPosts = async (page = 1) => {
    try {
      const { data } = await forumAPI.getPosts(page);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  return (
    <>
      <HeroHeader
        title="Community Forum"
        subtitle="Share your experiences, ask questions, and learn from companions."
        backgroundImage="/assets/head/forum.jpg"
      />

      <div className="forum-container">
        <div className="forum-header">
          <h1>Browse Latest Discussions</h1>
          <button onClick={() => setIsModalOpen(true)} className="create-post-button">
            Create New Post
          </button>
        </div>

        <div className="post-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ForumPostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onDelete={handleDeletePost}
                onUpdate={updatePost}
              />
            ))
          ) : (
            // Here's the new loader
            <div className="skeleton-loader">
              {[1, 2, 3].map((i) => (
                <div key={i} className="post-skeleton">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={(newPost) => {
            setPosts([newPost, ...posts]);
            setIsModalOpen(false);
          }}
        />
      </div>
    </>
  );
};

export default Forum;
