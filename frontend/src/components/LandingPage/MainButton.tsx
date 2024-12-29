import React from "react";
import Link from "next/link";

interface MainButtonProps {
    label: string;
    href?: string;
    onclick?: () => void;

}

const MainButton: React.FC<MainButtonProps> = (props: MainButtonProps) => {

    if (props.href) {
        return (
            <button onClick={props.onclick}
                className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">

                <Link href={props.href}>{props.label}</Link>
            </button>
        )
    }
    return (
        <button onClick={props.onclick}
            className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
            <label>{props.label}</label>
        </button>
    )
}

export default MainButton;