import React from "react";
import Link from "next/link";

interface MainButtonProps {
    label: string;
    href?: string;
    onclick?: () => void;

}

export default function MainButton(props: MainButtonProps){
    const buttonClasses= "min-w-24 mt-6 px-4 py-2 m-1.5 md:px-6 md:py-3 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800"
    if (props.href) {
        return (
            <button onClick={props.onclick}
                className={buttonClasses}>

                <Link href={props.href}>{props.label}</Link>
            </button>
        )
    }
    return (
        <button onClick={props.onclick}
            className={buttonClasses}>
            <label>{props.label}</label>
        </button>
    )
}

