'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useActivationMutation} from "../../../../../redux/features/authApiSlice";
import {toast} from "react-toastify";


interface Props {
    params: {
        uid: string;
        token: string;
    };
}


export default function Page({params}: Props) {
    const router = useRouter();
    const [activation] = useActivationMutation()

    useEffect(() => {
        const {uid, token} = params;

        activation({uid, token})
            .unwrap()
            .then(() => {
                toast.success('Account activated')
            })
            .catch(() =>{
                toast.error('Account could not be activated')
            })
            .finally(() =>{
                router.push('/login')
                })
    }, []);

    return (
        <div className="flex min-h-full flex-1 ">
            <div className="sm:mx-auto sm:w-full sm:ma"></div>
            <h1>Account Activation</h1>
            <p>Activating user...</p>
        </div>
    );
}