import {FaFacebook, FaGoogle} from 'react-icons/fa';
import React from "react";

interface SocialButtonProps {
    provider: 'Facebook' | 'Google',
}


export default function SocialButton(props : SocialButtonProps){
    const icons = {
        Facebook: <FaFacebook className="w-5 h-5 text-blue-600"/>,
        Google: <FaGoogle className="w-5 h-5 text-red-500"/>,
    };

    const icon = icons[props.provider];

    return (

            <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
                {icon}
            </button>


    )
}
