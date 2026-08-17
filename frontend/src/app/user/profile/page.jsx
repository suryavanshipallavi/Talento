'use client';
import React from 'react';
import Link from 'next/link';
import useUserContext from '@/app/Context/UserContext';

const UserProfile = () => {
  const { currentUser, userLogout } = useUserContext();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please <Link href="/login" className="text-indigo-500 font-semibold">Login</Link> to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-500 px-6 py-12 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-indigo-500">
                  {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{currentUser.firstName} {currentUser.lastName}</h1>
                <p className="text-indigo-100">{currentUser.email}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/vacancy" className="bg-indigo-50 p-4 rounded-lg hover:bg-indigo-100 transition">
                <h3 className="font-semibold text-indigo-700">Browse Jobs</h3>
                <p className="text-sm text-gray-600">Find your dream job</p>
              </Link>
              <Link href="/user/applied" className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition">
                <h3 className="font-semibold text-green-700">My Applications</h3>
                <p className="text-sm text-gray-600">Track your job applications</p>
              </Link>
              <Link href="/user/feedback" className="bg-yellow-50 p-4 rounded-lg hover:bg-yellow-100 transition">
                <h3 className="font-semibold text-yellow-700">Give Feedback</h3>
                <p className="text-sm text-gray-600">Share your experience</p>
              </Link>
              <Link href="/about" className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition">
                <h3 className="font-semibold text-purple-700">About Us</h3>
                <p className="text-sm text-gray-600">Learn more about Talento</p>
              </Link>
            </div>
            <div className="mt-8 pt-6 border-t">
              <button onClick={userLogout} className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
