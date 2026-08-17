'use client';
import React from 'react'
import { CompanyProvider } from './Context/CompanyContext';
import { UserProvider } from './Context/UserContext';

const Template = ({ children }) => {
    return (
        <CompanyProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </CompanyProvider>
    )
}

export default Template;
