'use client';

import React from "react";
import Link from "next/link";

interface EntryProps {
    labelId: string;
    type: string;
    autoComplete: string;
    children: React.ReactNode;
    link?:{
        linkText: string;
        linkUrl: string;
    }
    required?: boolean;
}

export default function FormEntry(props: EntryProps) {


    return (
        <div>
            <div className="flex justify-between items-center">
                <label
                    htmlFor={props.labelId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {props.children}
                </label>
                {props.link && (
                    <div >
                        <Link className="text-sm font-medium text-indigo-600 hover:text-indigo-600"
                              href={props.link.linkUrl}>
                            {props.link.linkText}
                        </Link>
                    </div>
                )
                }

            </div>

        <input
            id={props.labelId}
            name={props.labelId}
            type={props.type}
            autoComplete={props.autoComplete}
            required = {props.required}
            className="mt-1 h-7 resize block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
    </div>)

}
