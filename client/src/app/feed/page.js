import { Suspense } from 'react';
import FeedClient from '../../components/feed/FeedClient';
import { getCurrentUser } from '../../actions/user';
import { getFeeds } from '../../actions/feed';

export default async function FeedPage() {
  const user = (await getCurrentUser()) || {
    first_name: 'User',
    last_name: '',
    email: '',
  };

  const { posts, hasMore, offline } = await getFeeds(1, 10);

  return (
    <Suspense fallback={null}>
      <FeedClient
        user={user}
        initialPosts={posts}
        initialHasMore={hasMore}
        backendOffline={offline}
      />
    </Suspense>
  );
}
