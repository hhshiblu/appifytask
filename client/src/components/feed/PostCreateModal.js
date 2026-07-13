'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createPost } from '../../actions/feed';
import { getFirstName, getUserInitial } from '../../actions/utils';
import UserAvatar from './UserAvatar';
import { FiSend, FiX, FiGlobe, FiLock, FiImage, FiFilm } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';

export default function PostCreateModal({ isOpen, onClose, user, postType = 'post' }) {
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && postType === 'photo') {
      setTimeout(() => fileRef.current?.click(), 100);
    }
  }, [isOpen, postType]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      toast.error('Please write something or add an image.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('content', content);
    formData.append('visibility', visibility);
    if (image) formData.append('image', image);

    try {
     const data= await createPost(formData);
     if (data.success) {
      toast.success('Post created successfully!');
      setContent('');
      setImage(null);
      setPreview(null);
      setVisibility('public');
      onClose(true);
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message || 'Failed to create post');
  } finally {
    setLoading(false);
  }
};

  const firstName = getFirstName(user);
  const userInitial = getUserInitial(user);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 "
      onClick={() => onClose(false)}
    >
      <div
        className="w-[98%] p-6!  max-w-[700px] md:w-[70%] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center pb-4! justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-[12px] lg:text-[16px] font-semibold text-gray-600">
            Create Post
          </h2>
          <div className="flex items-center gap-3 cursor-pointer!">
            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && !image)}
              className="flex items-center gap-2 px-3! bg-[#0ACF83] text-black  py-[6px]! rounded-md font-medium hover:bg-[#0ACF83] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin text-white" size={16} />
              ) : (
                <FiSend size={16} className="text-black" />
              )}
              Post
            </button>

            <button
              type="button"
              onClick={() => onClose(false)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#0ACF83] text-gray-700 hover:text-black"
            >
              <FiX size={18} strokeWidth={2} />
            </button>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto flex flex-col p-5">

          <div className="flex items-center gap-3 pb-4!">
            <UserAvatar initial={userInitial} size="sm" />
            <div>
              <p className="font-semibold text-gray-900 text-[16px] leading-tight">{firstName}</p>
              <div className="flex items-center gap-1 mt-1">
                {['public', 'private'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`flex items-center gap-1 px-2 py-0.5 p-1! rounded-md text-[11px] text-black font-medium capitalize transition-colors ${visibility === v
                      ? 'bg-[#0ACF83] text-[#0ACF83]'
                      : 'bg-gray-100 text-gray-500 hover:bg-[#0ACF83]'
                      }`}
                  >
                    {v === 'public' ? (
                      <FiGlobe size={10} strokeWidth={2.5} />
                    ) : (
                      <FiLock size={10} strokeWidth={2.5} />
                    )}
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
            className="w-full min-h-[140px] resize-none text-[16px] text-gray-800 placeholder-gray-400 focus:outline-none border-none outline-none"
          />

          {/* Image Preview */}
          {preview && (
            <div className="relative mt-2 mb-2 rounded-lg overflow-hidden border border-gray-200 shadow-sm inline-block max-w-full group">
              <img
                src={preview}
                alt="Preview"
                className="max-h-[300px] w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => { setImage(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <FiX size={16} strokeWidth={2} />
              </button>
            </div>
          )}


        </div>

        {/* Action Footer */}
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4! py-2! rounded-md border border-[#0ACF83] bg-white hover:bg-[#0ACF83] transition-colors text-gray-700 text-sm font-medium"
          >
            <FiImage size={18} strokeWidth={2} />
            Upload image
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

          <button
            type="button"
            className="flex items-center gap-2 px-4! py-2! rounded-md border border-[#0ACF83] bg-white hover:bg-[#0ACF83] transition-colors text-gray-700 text-sm font-medium  cursor-not-allowed"
          >
            <FiFilm size={18} strokeWidth={2} />
            Upload video
          </button>
        </div>
      </div>
    </div>
  );
}
