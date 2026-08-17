'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useUserContext from '@/app/Context/UserContext';

const AppliedJobs = () => {
  const { currentUser } = useUserContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/apply/getbyuser/${currentUser._id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to load applications');
        setLoading(false);
      });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please <Link href="/login" className="text-indigo-500 font-semibold">Login</Link> to view your applied jobs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Applications</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
            <Link href="/vacancy" className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => {
              const job = app.interview;
              return (
                <div key={app._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800">{job?.designation || 'Job'}</h2>
                    <p className="text-gray-600">{job?.company?.compName || 'Company'}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job?.jobType && <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{job.jobType}</span>}
                      {job?.location && <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">{job.location}</span>}
                      {job?.salary && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">{job.salary}</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  {app.resume && (
                    <a
                      href={`http://localhost:5000/${app.resume}`}
                      target="_blank"
                      className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-200"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
