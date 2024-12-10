'use client';
import { useEffect } from 'react';
import {useRouter} from "next/navigation";
import {useAppSelector} from "../../redux/hooks";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector(state => state.auth); // Hook for checking auth

    console.log(isAuthenticated);
    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to login if not authenticated
            router.push('/');
        }
    }, [isAuthenticated, router]);


    // Only render children if authenticated
    return <>{!isAuthenticated ? children : null}</>;
};

export default AuthGuard;
