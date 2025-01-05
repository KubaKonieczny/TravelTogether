import React from 'react';
import Link from 'next/link';

interface DeleteButtonProps {
    label: string;
    onClick?: () => void;
    href?: string;
}

export default function DeleteButton({ label, onClick, href }:DeleteButtonProps) {
    const buttonClasses = " mt-6 m-1.5 px-4 py-2 md:px-6 md:py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-200";

    if (href) {
        return (
            <Link href={href}>
                <button className={buttonClasses}>
                    {label}
                </button>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses}>
            {label}
        </button>
    );
};



