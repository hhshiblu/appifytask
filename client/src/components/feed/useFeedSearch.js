'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function filterPostsBySearch(posts, searchQuery) {
  const q = (searchQuery || '').trim().toLowerCase();
  if (!q) return posts;

  return posts.filter((post) => {
    const content = (post.content || '').toLowerCase();
    const firstName = (post.first_name || '').toLowerCase();
    const lastName = (post.last_name || '').toLowerCase();
    const fullName = `${firstName} ${lastName}`.trim();
    return (
      content.includes(q) ||
      firstName.includes(q) ||
      lastName.includes(q) ||
      fullName.includes(q)
    );
  });
}

export function useFeedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const applySearch = useCallback(
    (value) => {
      const trimmed = (value ?? inputValue).trim();
      if (trimmed) {
        router.push(`/feed?search=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/feed');
      }
    },
    [inputValue, router]
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    router.push('/feed');
  }, [router]);

  return { searchQuery, inputValue, setInputValue, applySearch, clearSearch };
}
