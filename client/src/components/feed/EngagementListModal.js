'use client';

import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { getFirstName, getUserInitial } from '../../actions/utils';
import UserAvatar from './UserAvatar';

export default function EngagementListModal({ isOpen, onClose, title, items = [], loading = false, emptyText = 'No one yet' }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4!"
      onClick={onClose}
    >
      <div
        className="w-[92%] max-w-[440px] bg-white rounded-xl shadow-2xl p-6!"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4! px-0! py-0!">
          <h2 className="text-lg font-semibold text-[#112032] m-0!">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 p-0!"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-0!">
          {loading ? (
            <div className="flex items-center justify-center py-8!">
              <BiLoaderAlt className="animate-spin text-[#0ACF83]" size={24} />
            </div>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6! m-0!">{emptyText}</p>
          ) : (
            <ul className="list-none m-0! p-0!">
              {items.map((item, index) => (
                <li
                  key={item.id || item.user_id || index}
                  className="flex items-center gap-3! py-3! border-b border-gray-100 last:border-b-0"
                >
                  <UserAvatar initial={getUserInitial(item)} size="sm" />
                  <span className="text-[15px] font-medium text-[#112032]">
                    {getFirstName(item)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
