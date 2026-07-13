'use client';

import React, { useState } from 'react';
import { FiImage, FiFilm, FiCalendar, FiFileText, FiSend } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { toast } from 'sonner';
import { createPost } from '../../actions/feed';
import { getUserInitial } from '../../actions/utils';
import UserAvatar from './UserAvatar';

export default function PostComposer({ user, onOpenModal }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const open = (type) => () => onOpenModal(type);

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('Please write something');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('content', content);
    formData.append('visibility', 'public');

    try {
     const data= await createPost(formData);
     if (data.success) {
      toast.success(data.message);
      setContent('');
      if (window.refreshFeed) window.refreshFeed();
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message || 'Failed to create post');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <div className="_feed_inner_text_area_box">
        <div className="_feed_inner_text_area_box_image">
          <UserAvatar initial={getUserInitial(user)} size="sm" />
        </div>
        <div className="_feed_inner_text_area_box_form w-full flex items-center justify-between bg-transparent border-none ">
          <textarea
            rows="1"
            placeholder="Write something ..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="_feed_textarea_label w-full text-left bg-transparent border-none outline-none pl-2 resize-none pt-1 pr-8"
          />
          { 
            !content && <div className="absolute top-[4px] left-40">
              <svg className="cursor-pointer shrink-0" xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24">
                <path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" />
              </svg>
            </div>
          }
        </div>
      </div>

      <div className="_feed_inner_text_area_bottom max-[991px]:hidden">
        <div className="_feed_inner_text_area_item">
          <ComposerBtn label="Photo" onClick={open('photo')} icon="photo" />
          <ComposerBtn label="Video" onClick={open('video')} icon="video" />
          <ComposerBtn label="Event" onClick={open('event')} icon="event" />
          <ComposerBtn label="Article" onClick={open('article')} icon="article" />
        </div>
        <div className="_feed_inner_text_area_btn">
          <button type="button" disabled={loading} className="_feed_inner_text_area_btn_link flex items-center gap-2 disabled:opacity-60" onClick={handlePost}>
            {loading ? <BiLoaderAlt className="animate-spin text-white" size={16} /> : <FiSend size={16} color="#fff" />}
            <span>Post</span>
          </button>
        </div>
      </div>

      <div className="_feed_inner_text_area_bottom_mobile hidden max-[991px]:block">
        <div className="flex justify-between items-center">
          <div className="_feed_inner_text_area_item flex gap-4">
            <ComposerBtn label="Photo" onClick={open('photo')} icon="photo" hideLabelOnMobile={true} />
            <ComposerBtn label="Video" onClick={open('video')} icon="video" hideLabelOnMobile={true} />
            <ComposerBtn label="Event" onClick={open('event')} icon="event" hideLabelOnMobile={true} />
            <ComposerBtn label="Article" onClick={open('article')} icon="article" hideLabelOnMobile={true} />
          </div>
          <div className="_feed_inner_text_area_btn">
            <button type="button" disabled={loading} className="_feed_inner_text_area_btn_link flex items-center justify-center p-2 rounded-full disabled:opacity-60" onClick={handlePost}>
              {loading ? <BiLoaderAlt className="animate-spin text-white" size={16} /> : <FiSend size={16} color="#fff" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComposerBtn({ label, onClick, icon, hideLabelOnMobile }) {
  let Icon = FiImage;
  if (icon === 'video') Icon = FiFilm;
  if (icon === 'event') Icon = FiCalendar;
  if (icon === 'article') Icon = FiFileText;

  return (
    <div className={`_feed_inner_text_area_bottom_${icon} _feed_common`}>
      <button type="button" className="_feed_inner_text_area_bottom_photo_link flex items-center gap-2" onClick={onClick}>
        <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img text-gray-500">
          <Icon size={18} />
        </span>
        <span className={hideLabelOnMobile ? "hidden" : ""}>{label}</span>
      </button>
    </div>
  );
}
