import React from "react";

interface ButtonProps {
    label: string;
}

const LoginRegisterButton: React.FC<ButtonProps> = (props) => {

    return (
        <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {props.label}
        </button>

    )

}


export default LoginRegisterButton;