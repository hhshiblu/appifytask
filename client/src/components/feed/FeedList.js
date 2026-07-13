'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { getFeeds } from '../../actions/feed';
import { PostCard } from './PostCard';
import { filterPostsBySearch } from './useFeedSearch';

export default function FeedList({ user, initialPosts = [], initialHasMore = false, backendOffline = false }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const loaderRef = useRef(null);

  const visiblePosts = useMemo(
    () => filterPostsBySearch(posts, searchQuery),
    [posts, searchQuery]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isPending || searchQuery) return;

    startTransition(async () => {
      const nextPage = page + 1;
      const { posts: newPosts, hasMore: more } = await getFeeds(nextPage, 10);
      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
      setHasMore(more);
    });
  }, [hasMore, isPending, page, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  const refreshPosts = useCallback(async () => {
    const { posts: fresh, hasMore: more } = await getFeeds(1, 10);
    setPosts(fresh);
    setPage(1);
    setHasMore(more);
  }, []);

  useEffect(() => {
    window.refreshFeed = refreshPosts;
    return () => { delete window.refreshFeed; };
  }, [refreshPosts]);

  if (visiblePosts.length === 0) {
    return (
      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 text-center">
        <p className="text-color4 py-8">
          {searchQuery
            ? `No posts found for "${searchQuery}"`
            : backendOffline
              ? 'Could not load posts. Is the backend running?'
              : 'No posts yet. Be the first to post!'}
        </p>
      </div>
    );
  }

  return (
    <>
      {visiblePosts.map((post) => (
        <PostCard key={post.id} post={post} user={user} />
      ))}

      <div ref={loaderRef} className="py-6 text-center">
        {isPending && <p className="text-color4 text-sm">Loading more posts...</p>}
        {!searchQuery && !hasMore && posts.length > 0 && (
          <p className="text-color4 text-sm">No more posts</p>
        )}
      </div>
    </>
  );
}
