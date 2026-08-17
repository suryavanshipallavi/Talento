'use client'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const VacancyDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [resume, setResume] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('user')));

  const fetchJobs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/jobpost/getbyid/${id}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const checkApplicationStatus = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`http://localhost:5000/apply/checkapplication/${id}/${currentUser._id}`);
      const data = await response.json();
      if (data) {
        setHasApplied(true);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    checkApplicationStatus();
  }, [id, currentUser]);

  const handleResumeUpload = (event) => {
    setResume(event.target.files[0]);
  };

  const applyInterview = async () => {
    if (!currentUser) {
      return toast.error('Login to Apply');
    }

    try {
      const formData = new FormData();
      formData.append('interview', id);
      formData.append('user', currentUser._id);
      if (resume) {
        formData.append('resume', resume);
      }

      const applyRes = await fetch('http://localhost:5000/apply/add', {
        method: 'POST',
        body: formData,
      });

      if (applyRes.status === 200) {
        toast.success('Applied Successfully');
        setHasApplied(true); // Update UI instantly after applying
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white">
          More About Job Details
        </h1>

        {Data ? (
          <div className="mt-8 xl:mt-16 lg:flex lg:gap-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">Job Information</h2>
              <div className="space-y-4">
                <p><strong>Job Type:</strong> {Data.jobType}</p>
                <p><strong>Job Title:</strong> {Data.designation}</p>
                <p><strong>Qualification:</strong> {Data.eduQualification}</p>
                <p><strong>Salary:</strong> {Data.salary}</p>
                <p><strong>Experience:</strong> {Data.workExperience}</p>
                <p><strong>Location:</strong> {Data.location}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Job Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{Data.jobDescription}</p>

              <hr className="my-6 border-gray-300 dark:border-gray-700" />

              <div className="flex flex-col items-center space-y-4">
                {hasApplied ? (
                  <p className="text-green-600 font-bold">✅ Already Applied</p>
                ) : (
                  <>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="border rounded-md p-2"
                    />
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={applyInterview}
                    >
                      Apply
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
        )}
      </div>
    </section>
  );
};

export default VacancyDetails;