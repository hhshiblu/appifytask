'use client';

import React from 'react';
import { useFeedSearch } from './useFeedSearch';

export default function FeedSearchBar() {
  const { searchQuery, inputValue, setInputValue, applySearch, clearSearch } = useFeedSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    applySearch();
  };

  return (
    <>
      <div className="_feed_search_bar _b_radious6 _mar_b16 max-[991px]:hidden">
        <form className="_header_form_grp _feed_search_form" onSubmit={handleSubmit}>
          <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
            <circle cx="7" cy="7" r="6" stroke="#666" />
            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
          </svg>
          <input
            className="_inpt1"
            type="search"
            placeholder="Search posts..."
            aria-label="Search posts"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="_feed_search_clear"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </form>
      </div>
    </>
  );
}
