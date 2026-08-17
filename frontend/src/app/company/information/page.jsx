"use client";

import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompanyInfo = () => {
  const [currentCompany, setCurrentCompany] = useState(
    JSON.parse(sessionStorage.getItem('company'))
  );
  const [logo, setLogo] = useState(null); // To store the uploaded file

  const updateProfile = (data) => {
    const formData = new FormData();

    formData.append('compName', data.compName);
    formData.append('compEmail', data.compEmail);
    formData.append('password', data.password);
    formData.append('about', data.about);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('country', data.country);
    formData.append('streetAddress', data.streetAddress);
    formData.append('city', data.city);
    formData.append('region', data.region);
    formData.append('postalCode', data.postalCode);
    if (logo) formData.append('logo', logo);

    fetch('http://localhost:5000/company/update/' + currentCompany._id, {
      method: 'PUT',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentCompany(data);
        sessionStorage.setItem('company', JSON.stringify(data));
        toast.success('Profile Updated Successfully');
      })
      .catch((err) => {
        toast.error('Some Error Occurred');
      });
  };

  const profileForm = useFormik({
    initialValues: currentCompany,
    onSubmit: (values) => {
      updateProfile(values);
    },
  });

  const uploadFile = (e) => {
    const file = e.target.files[0];
    setLogo(file);  // Set the logo to the uploaded file
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={profileForm.handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="compName" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="compName"
              id="compName"
              value={profileForm.values.compName}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="compEmail" className="block text-sm font-medium text-gray-700">Company Email</label>
            <input
              type="email"
              name="compEmail"
              id="compEmail"
              value={profileForm.values.compEmail}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={profileForm.values.password}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
            <textarea
              name="about"
              id="about"
              value={profileForm.values.about}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
            ></textarea>
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={profileForm.values.firstName}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={profileForm.values.lastName}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value={profileForm.values.country}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
            <input
              type="text"
              name="streetAddress"
              id="streetAddress"
              value={profileForm.values.streetAddress}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              id="city"
              value={profileForm.values.city}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              name="region"
              id="region"
              value={profileForm.values.region}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              value={profileForm.values.postalCode}
              onChange={profileForm.handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
            <input
              type="file"
              name="logo"
              id="logo"
              onChange={uploadFile}
              className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyInfo;
