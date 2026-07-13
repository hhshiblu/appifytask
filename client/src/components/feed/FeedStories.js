'use client';

import React, { useRef } from 'react';

const DESKTOP_STORIES = [
  { id: 1, type: 'yours', image: '/assets/images/card_ppl1.png', name: 'Your Story' },
  { id: 2, type: 'public', image: '/assets/images/card_ppl2.png', name: 'Ryan Roslansky' },
  { id: 3, type: 'public', image: '/assets/images/card_ppl3.png', name: 'Ryan Roslansky' },
  { id: 4, type: 'public', image: '/assets/images/card_ppl4.png', name: 'Ryan Roslansky' },
  { id: 5, type: 'public', image: '/assets/images/card_ppl2.png', name: 'Sarah Connor' },
  { id: 6, type: 'public', image: '/assets/images/card_ppl3.png', name: 'John Smith' },
];

const MOBILE_STORIES = [
  { id: 1, type: 'yours', image: '/assets/images/mobile_story_img.png', name: 'Your Story' },
  { id: 2, type: 'active', image: '/assets/images/mobile_story_img1.png', name: 'Ryan...' },
  { id: 3, type: 'inactive', image: '/assets/images/mobile_story_img2.png', name: 'Ryan...' },
  { id: 4, type: 'active', image: '/assets/images/mobile_story_img1.png', name: 'Ryan...' },
  { id: 5, type: 'inactive', image: '/assets/images/mobile_story_img2.png', name: 'Ryan...' },
  { id: 6, type: 'active', image: '/assets/images/mobile_story_img1.png', name: 'Ryan...' },
  { id: 7, type: 'yours', image: '/assets/images/mobile_story_img.png', name: 'Ryan...' },
  { id: 8, type: 'active', image: '/assets/images/mobile_story_img1.png', name: 'Ryan...' },
];

function DesktopStoryCard({ story }) {
  if (story.type === 'yours') {
    return (
      <div className="_feed_stories_item">
        <div className="_feed_inner_profile_story _b_radious6">
          <div className="_feed_inner_profile_story_image">
            <img src={story.image} alt="" className="_profile_story_img" />
            <div className="_feed_inner_story_txt">
              <div className="_feed_inner_story_btn">
                <button type="button" className="_feed_inner_story_btn_link">
                  <svg className="w-3 h-3 text-white text-center m-auto!" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                    <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                  </svg>
                </button>
              </div>
              <p className="_feed_inner_story_para">{story.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="_feed_stories_item">
      <div className="_feed_inner_public_story _b_radious6">
        <div className="_feed_inner_public_story_image">
          <img src={story.image} alt="" className="_public_story_img" />
          <div className="_feed_inner_pulic_story_txt">
            <p className="_feed_inner_pulic_story_para">{story.name}</p>
          </div>
          <div className="_feed_inner_public_mini">
            <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStoryItem({ story }) {
  let storyClass = '_feed_inner_ppl_card_area_story';
  if (story.type === 'active') storyClass = '_feed_inner_ppl_card_area_story_active';
  if (story.type === 'inactive') storyClass = '_feed_inner_ppl_card_area_story_inactive';

  const imgClass = story.type === 'yours' ? '_card_story_img' : '_card_story_img1';
  const textClass = story.type === 'yours' ? '_feed_inner_ppl_card_area_link_txt' : '_feed_inner_ppl_card_area_txt';

  return (
    <li className="_feed_inner_ppl_card_area_item">
      <a href="#" className="_feed_inner_ppl_card_area_link">
        <div className={storyClass}>
          <img src={story.image} alt="" className={imgClass} />
          {story.type === 'yours' && (
            <div className="_feed_inner_ppl_btn">
              <button className="_feed_inner_ppl_btn_link" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <p className={textClass}>{story.name}</p>
      </a>
    </li>
  );
}

export default function FeedStories() {
  const desktopScrollRef = useRef(null);

  const scrollStories = () => {
    desktopScrollRef.current?.scrollBy({ left: 180, behavior: 'smooth' });
  };

  return (
    <>
      <div className="_feed_inner_ppl_card _mar_b16 max-[991px]:hidden">
        <div className="_feed_inner_story_arrow">
          <button type="button" className="_feed_inner_story_arrow_btn" onClick={scrollStories}>
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
              <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
            </svg>
          </button>
        </div>

        <div ref={desktopScrollRef} className="_feed_stories_track">
          {DESKTOP_STORIES.map((story) => (
            <DesktopStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      <div className="_feed_inner_ppl_card_mobile _mar_b16">
        <div className="_feed_inner_ppl_card_area">
          <ul className="_feed_inner_ppl_card_area_list _feed_stories_scrollable">
            {MOBILE_STORIES.map((story) => (
              <MobileStoryItem key={story.id} story={story} />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
