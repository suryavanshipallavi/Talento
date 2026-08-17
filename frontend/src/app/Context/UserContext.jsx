'use client';
import { useRouter } from "next/navigation";
import { createContext, useContext, useState } from "react";

const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(
        typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null
    );
    const [userLoggedIn, setUserLoggedIn] = useState(
        typeof window !== 'undefined' ? currentUser !== null : false
    )

    const userLogout = () => {
        sessionStorage.removeItem('user');
        setUserLoggedIn(false)
        setCurrentUser(null)
        router.push('/login')
    }
    return (
        <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn, currentUser, setCurrentUser, userLogout }}>
            {children}
        </UserContext.Provider>
    )
}

const useUserContext = () => useContext(UserContext);
export default useUserContext;
