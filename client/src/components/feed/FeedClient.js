'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import FeedHeader from './FeedHeader';
import FeedLeftSidebar from './FeedLeftSidebar';
import FeedStories from './FeedStories';
import FeedRightSidebar from './FeedRightSidebar';
import PostComposer from './PostComposer';
import PostCreateModal from './PostCreateModal';
import FeedList from './FeedList';


export default function FeedClient({ user, initialPosts = [], initialHasMore = false, backendOffline = false }) {
  const { theme, toggleTheme } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('post');

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = (posted) => {
    setModalOpen(false);
    if (posted && window.refreshFeed) {
      window.refreshFeed();
    }
  };

  return (
    <div className={`_layout _layout_main_wrapper${theme === 'dark' ? ' _dark_wrapper' : ''}`}>
      <ThemeToggle onToggle={toggleTheme} />

      <div className="_main_layout">
        <FeedHeader user={user} onThemeToggle={toggleTheme} />

        <div className="_custom_container">
          <div className="_layout_inner_wrap">
            <div className="_feed_layout_row">
              <div className="_feed_col_side">
                <FeedLeftSidebar />
              </div>

              <div className="_feed_col_main overflow-x-hidden! w-full!">
                <div className="_layout_middle_wrap overflow-x-hidden! overflow-y-auto! w-full!" data-feed-scroll>
                  <div className="_layout_middle_inner">
                    <FeedStories />

                    <PostComposer user={user} onOpenModal={handleOpenModal} />
                    <FeedList user={user} initialPosts={initialPosts} initialHasMore={initialHasMore} backendOffline={backendOffline} />
                  </div>
                </div>
              </div>

              <div className="_feed_col_side">
                <FeedRightSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PostCreateModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        user={user}
        postType={modalType}
      />
    </div>
  );
}
