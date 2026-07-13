'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '../../actions/auth';
import { toast } from 'sonner';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password, rememberMe);
      if (data.success) {
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
    <>
      <section className="_social_login_wrapper _layout_main_wrapper min-h-screen overflow-hidden">
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

        <div className="_social_login_wrap">
          <div className="max-w-[1320px] w-full !px-[15px] !mx-auto">
            <div className="flex flex-wrap items-center !-mx-[15px]">
              <div className="w-full lg:w-8/12 !px-[15px]">
                <div className="_social_login_left">
                  <div className="_social_login_left_image">
                    <img src="/assets/images/login.png" alt="Login" className="_left_img !w-auto !h-auto !max-w-[633px]" />
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-4/12 !px-[15px]">
                <div className="_social_login_content">
                  <div className="_social_login_left_logo _mar_b28">
                    <img src="/assets/images/logo.svg" alt="BuddyScript" className="_left_logo !w-auto !h-auto" />
                  </div>

                  <p className="_social_login_content_para _mar_b8">Welcome back</p>
                  <h4 className="_social_login_content_title _titl4 _mar_b50">Login to your account</h4>

                  <button type="button" className="_social_login_content_btn _mar_b40 !w-full">
                    <img src="/assets/images/google.svg" alt="" className="_google_img !w-auto !h-auto" />
                    <span>Or sign-in with google</span>
                  </button>

                  <div className="_social_login_content_bottom_txt _mar_b40">
                    <span>Or</span>
                  </div>

                  <form className="_social_login_form" onSubmit={handleLogin}>
                    <div className="flex flex-wrap !-mx-[15px]">
                      <div className="w-full !px-[15px]">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8 block">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="_social_login_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                          />
                        </div>
                      </div>
                      <div className="w-full !px-[15px]">
                        <div className="_social_login_form_input _mar_b14">
                          <label className="_social_login_label _mar_b8 block">Password</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="_social_login_input !w-full !px-3 focus:!border-[#0ACF83] focus:!shadow-[0_0_0_1px_#0ACF83]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap !-mx-[15px]">
                      <div className="w-full sm:w-1/2 !px-[15px]">
                        <div className="form-check _social_login_form_check flex items-center !gap-2">
                          <input
                            className="w-[14px]! h-[14px]! min-w-[14px] shrink-0 cursor-pointer appearance-none rounded border border-gray-300 relative checked:bg-[#0ACF83] checked:border-[#0ACF83] checked:before:content-[''] checked:before:absolute checked:before:top-[1px] checked:before:left-[4px] checked:before:w-[4px] checked:before:h-[8px] checked:before:border-solid checked:before:border-white checked:before:border-r-2 checked:before:border-b-2 checked:before:rotate-45"
                            type="checkbox"
                            name="remember"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <label className="form-check-label _social_login_form_check_label" htmlFor="rememberMe">
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2 !px-[15px]">
                        <div className="_social_login_form_left flex justify-center sm:justify-end">
                          <button
                            type="button"
                            onClick={() => setForgotOpen(true)}
                            className="_social_login_form_left_para !m-0! bg-transparent border-none cursor-pointer hover:underline p-0"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap !-mx-[15px]">
                      <div className="w-full !px-[15px]">
                        <div className="_social_login_form_btn _mar_t40 _mar_b60">
                          <button
                            type="submit"
                            disabled={loading}
                            className="_social_login_form_btn_link _btn1 w-fit! max-w-fit! inline-block! disabled:!opacity-50"
                          >
                            {loading ? 'Logging in...' : 'Login now'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="flex flex-wrap !-mx-[15px]">
                    <div className="w-full !px-[15px]">
                      <div className="_social_login_bottom_txt">
                        <p className="_social_login_bottom_txt_para !text-[14px]">
                          Dont have an account?{' '}
                          <Link href="/registration">Create New Account</Link>
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

      <ForgotPasswordModal
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
        onSuccess={() => router.push('/login')}
      />
    </>
  );
}
