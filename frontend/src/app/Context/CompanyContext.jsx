'use client';
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

const CompanyContext = createContext()

export const CompanyProvider = ({ children }) => {
    const router = useRouter();
    const [currentCompany, setCurrentCompany] = useState(
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('company')) : null
    );
    const [companyLoggedIn, setCompanyLoggedIn] = useState(
        typeof window !== 'undefined' ? currentCompany !== null : false
    )

    const companyLogout = () => {
        sessionStorage.removeItem('company');
        setCompanyLoggedIn(false)
        setCurrentCompany(null)
        router.push('/login')
    }
    return (
        <CompanyContext.Provider value={{ companyLoggedIn, setCompanyLoggedIn, currentCompany, setCurrentCompany, companyLogout }}>
            {children}
        </CompanyContext.Provider>
    )
}

const useCompanyContext = () => useContext(CompanyContext);
export default useCompanyContext;
