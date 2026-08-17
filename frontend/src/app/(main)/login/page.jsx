'use client'
import React, { useState } from 'react';
import { useFormik } from 'formik';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import useCompanyContext from '@/app/Context/CompanyContext';
import useUserContext from '@/app/Context/UserContext';

const Login = () => {
  const [role, setRole] = useState('user');
  const router = useRouter();
  const { setCompanyLoggedIn, setCurrentCompany } = useCompanyContext();
  const { setUserLoggedIn, setCurrentUser } = useUserContext();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      compEmail: "",
      password: ""
    },
    onSubmit: (values) => {
      if (role === 'company') {
        const payload = { compEmail: values.compEmail, password: values.password };
        fetch('http://localhost:5000/company/authenticate', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {
            if (response.status === 200) {
              toast.success('Login Successful');
              response.json().then((data) => {
                sessionStorage.setItem('company', JSON.stringify(data));
                setCompanyLoggedIn(true);
                setCurrentCompany(data);
                router.push('/company/jobpost');
              });
            } else {
              toast.error('Invalid Credentials');
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error('Something went wrong');
          });
      } else {
        const payload = { email: values.email, password: values.password };
        fetch('http://localhost:5000/user/authenticate', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {
            if (response.status === 200) {
              toast.success('Login Successful');
              response.json().then((data) => {
                sessionStorage.setItem('user', JSON.stringify(data));
                setUserLoggedIn(true);
                setCurrentUser(data);
                router.push('/user/profile');
              });
            } else {
              toast.error('Invalid Credentials');
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error('Something went wrong');
          });
      }
    }
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{
        __html:
          "@import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css')"
      }} />
      <div className="min-w-screen min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-5 py-5">
        <div className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden" style={{ maxWidth: 1000 }}>
          <div className="md:flex w-full">
            <div className="hidden md:block w-1/2 bg-white py-32 px-10">
              <img src="/p1.png" alt="" />
            </div>
            <div className="w-full md:w-1/2 py-10 px-5 bg-blue-250 md:px-10">
              <div className="text-center mb-10">
                <h1 className="font-bold text-3xl text-black">Login</h1>
                <p>Enter your information to Login</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setRole('user')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${role === 'user' ? 'bg-indigo-500 text-white' : 'text-gray-600'}`}
                  >
                    Job Seeker
                  </button>
                  <button
                    onClick={() => setRole('company')}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${role === 'company' ? 'bg-indigo-500 text-white' : 'text-gray-600'}`}
                  >
                    Company
                  </button>
                </div>
              </div>

              <form onSubmit={loginForm.handleSubmit}>
                {role === 'company' ? (
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                      <label className="text-xs font-semibold px-1">Company Email</label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <i className="mdi mdi-email-outline text-gray-400 text-lg" />
                        </div>
                        <input
                          type="email"
                          id="compEmail"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.compEmail}
                          className="bg-white w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo"
                          placeholder="company@example.com"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                      <label className="text-xs font-semibold px-1">Email</label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <i className="mdi mdi-email-outline text-gray-400 text-lg" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          onChange={loginForm.handleChange}
                          value={loginForm.values.email}
                          className="bg-white w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo"
                          placeholder="johnsmith@example.com"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-5">
                    <label className="text-xs font-semibold px-1">Password</label>
                    <div className="flex">
                      <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                        <i className="mdi mdi-lock-outline text-gray-400 text-lg" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        onChange={loginForm.handleChange}
                        value={loginForm.values.password}
                        className="bg-white w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo"
                        placeholder="************"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex -mx-3">
                  <div className="w-full px-3 mb-5">
                    <button type="submit" className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                      LOGIN
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-sm">Don't have an account? </span>
                  <Link href="/signup" className="text-sm text-indigo-500 font-semibold hover:underline">Sign up</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
