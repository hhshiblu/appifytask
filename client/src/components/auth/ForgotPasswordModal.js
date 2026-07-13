'use client';

import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';
import { toast } from 'sonner';
import { changePassword, forgotPassword } from '../../actions/auth';

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      if (data.success) {
      setStep('password');
      toast.success('Email verified. Set your new password.');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };  

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await changePassword(email, newPassword);
      if (data.success) {
      toast.success('Password updated successfully!');
      onClose();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };  

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
        <div className="flex items-center justify-between mb-5! px-0! py-0!">
          <h2 className="text-lg font-semibold text-[#112032] m-0!">
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 p-0!"
          >
            <FiX size={18} />
          </button>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="p-0!">
            <p className="text-sm text-gray-600 mb-4! px-0! py-0!">
              Enter your email address and we will help you reset your password.
            </p>
            <label className="_social_login_label _mar_b8 block px-0! py-0!">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="_social_login_input !w-full px-3! py-0! focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83] mb-5!"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={loading}
              className="_social_login_form_btn_link _btn1 !w-full disabled:!opacity-50 flex items-center justify-center gap-2 py-3! px-4!"
            >
              {loading && <BiLoaderAlt className="animate-spin" size={16} />}
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="p-0!">
            <p className="text-sm text-gray-600 mb-4! px-0! py-0!">
              Create a new password for <strong>{email}</strong>
            </p>
            <label className="_social_login_label _mar_b8 block px-0! py-0!">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="_social_login_input !w-full px-3! py-0! focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83] mb-4!"
            />
            <label className="_social_login_label _mar_b8 block px-0! py-0!">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="_social_login_input !w-full px-3! py-0! focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83] mb-5!"
            />
            <button
              type="submit"
              disabled={loading}
              className="_social_login_form_btn_link _btn1 !w-full disabled:!opacity-50 flex items-center justify-center gap-2 py-3! px-4!"
            >
              {loading && <BiLoaderAlt className="animate-spin" size={16} />}
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
