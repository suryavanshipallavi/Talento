'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { FaFilePdf, FaFileWord } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

const ManageVacancy = () => {
  const router = useRouter();
  const [currentCompany, setCurrentCompany] = useState(null);
  const [interviewList, setInterviewList] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const company = sessionStorage.getItem('company');
    if (company) {
      setCurrentCompany(JSON.parse(company));
    } else {
      // Redirect unauthorized users
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (currentCompany?._id) {
      fetchVacancies();
    }
  }, [currentCompany]);

  const fetchVacancies = async () => {
    try {
      const response = await fetch(`http://localhost:5000/jobpost/getbycompany/${currentCompany?._id}`);
      if (!response.ok) throw new Error('Failed to fetch vacancies');
      const data = await response.json();
      setInterviewList(data);
    } catch (err) {
      console.error(err);
      setError('Error loading job posts. Please try again.');
    }
  };

  const fetchApplications = async (interviewId) => {
    try {
      const response = await fetch(`http://localhost:5000/apply/getbyinterview/${interviewId}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplicationList(data);
      setIsOpen(true);
    } catch (err) {
      console.error(err);
      setError('Error loading applications. Please try again.');
    }
  };

  const getFileExtension = (filename) => filename?.split('.').pop().toLowerCase();

  const renderFileIcon = (ext) => {
    switch (ext) {
      case 'pdf':
        return <FaFilePdf className="text-red-600 inline-block mr-1" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-600 inline-block mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14 max-w-[85rem] mx-auto">
      {/* Modal */}
      <Transition show={isOpen}>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <DialogPanel className="max-w-4xl w-full space-y-4 border bg-white p-8 rounded-lg shadow-lg">
              <DialogTitle className="font-bold text-xl">Job Applicants</DialogTitle>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-700">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicationList.map((application, index) => {
                    const resume = application?.resume;
                    const ext = getFileExtension(resume);
                    const resumeUrl = `http://localhost:5000/${resume}`;

                    return (
                      <tr key={index}>
                        <td className="px-6 py-3 text-sm font-medium text-gray-800">
                          {application.user?.firstName} {application.user?.lastName}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{application.user?.email}</td>
                        <td className="px-6 py-3 text-sm text-gray-700">
                          {new Date(application?.createdAt).toDateString()}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {resume ? (
                            <div className="flex items-center space-x-3">
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline text-blue-600 font-medium flex items-center"
                              >
                                {renderFileIcon(ext)}
                                View
                              </a>
                              <a
                                href={resumeUrl}
                                download
                                className="text-gray-500 hover:text-gray-800"
                                title="Download Resume"
                              >
                                <FiDownload />
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not Uploaded</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </DialogPanel>
          </div>
        </Dialog>
      </Transition>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      {/* Vacancy Table */}
      {currentCompany && (
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Manage Vacancies</h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Designation</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Job Type</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Qualification</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Experience</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Salary</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {interviewList.map((interview, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{interview.designation}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{interview.jobType}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{interview.eduQualification}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{interview.workExperience}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{interview.salary}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => fetchApplications(interview._id)} className="text-blue-600 hover:underline font-medium text-sm">
                            View List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVacancy;