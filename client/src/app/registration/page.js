'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { register } from '../../actions/auth';
import { useTheme } from '../../context/ThemeContext';

export default function RegistrationPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (!agreed) {
      toast.error('Please agree to terms & conditions');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      if (data.success) {
      toast.success('Registration successful!');
        router.push('/feed');
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
    <section className={`_social_registration_wrapper _layout_main_wrapper min-h-screen overflow-hidden${theme === 'dark' ? ' _dark_wrapper' : ''}`}>
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img !w-auto !h-auto" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape !w-auto !h-auto" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img !w-auto !h-auto" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity !w-auto !h-auto" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img !w-auto !h-auto" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity !w-auto !h-auto" />
      </div>

      <div className="_social_registration_wrap">
        <div className="max-w-[1320px] w-full !px-[15px] !mx-auto">
          <div className="flex flex-wrap items-center !-mx-[15px]">
            <div className="w-full lg:w-8/12 !px-[15px]">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img
                    src="/assets/images/registration.png"
                    alt="Registration"
                    className="_left_img block! w-auto! h-auto! max-w-[633px]!"
                  />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img
                    src="/assets/images/registration1.png"
                    alt="Registration"
                    className="_left_img block! w-auto! h-auto! max-w-[633px]!"
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-4/12 !px-[15px]">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/images/logo.svg" alt="BuddyScript" className="_right_logo !w-auto !h-auto" />
                </div>

                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>

                <button type="button" className="_social_registration_content_btn _mar_b40 !w-full">
                  <img src="/assets/images/google.svg" alt="" className="_google_img !w-auto !h-auto" />
                  <span>Register with google</span>
                </button>

                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>

                <form className="_social_registration_form" onSubmit={handleRegister}>
                  <div className="flex flex-wrap !-mx-[15px]">
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8 block">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="_social_registration_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                        />
                      </div>
                    </div>
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8 block">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="_social_registration_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                        />
                      </div>
                    </div>
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8 block">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="_social_registration_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                        />
                      </div>
                    </div>
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8 block">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="_social_registration_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                        />
                      </div>
                    </div>
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8 block">Repeat Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="_social_registration_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap !-mx-[15px]">
                    <div className="w-full !px-[15px]">
                      <label
                        htmlFor="termsAgree"
                        className="form-check _social_registration_form_check flex items-center !gap-2 cursor-pointer"
                      >
                        <input
                          className="form-check-input _social_registration_form_check_input _terms_checkbox"
                          type="checkbox"
                          id="termsAgree"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                        />
                        <span className="form-check-label _social_registration_form_check_label">
                          I agree to terms &amp; conditions
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-wrap !-mx-[15px]">
                    <div className="w-full !px-[15px]">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button
                          type="submit"
                          disabled={loading}
                          className="_social_registration_form_btn_link _btn1   disabled:!opacity-50"
                        >
                          {loading ? 'Registering...' : 'Register now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="flex flex-wrap !-mx-[15px]">
                  <div className="w-full !px-[15px]">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para !text-[14px]">
                        Already have an account?{' '}
                        <Link href="/login">Login now</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
