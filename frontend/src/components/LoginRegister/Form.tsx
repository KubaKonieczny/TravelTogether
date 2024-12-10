import React, {ChangeEvent, FormEvent} from "react";
import {FormEntry} from "@/components/LoginRegister/index";
import {toast} from "react-toastify";
import Spinner from "@/components/Spinner";

interface Config{
    labelText: string;
    labelId: string;
    autoComplete: string;
    type: string;
    link?:{
        linkText: string;
        linkUrl: string;
    }
    value: string;
    required?: boolean;
}

interface Props {
    config: Config[];
    isLoading: boolean;
    buttonText: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}


export default function Form({config, isLoading, buttonText, onChange, onSubmit}: Props) {

    return (
        <form className={"space-y-4"} onSubmit={onSubmit}>
            {config.map((input) => (
            <FormEntry key={input.labelId}
                       labelId={input.labelId}
                       type={input.type}
                       autoComplete={input.autoComplete}
                       onChange={onChange}
                       link = {input.link}
                       value={input.value}>
                {input.labelText}
            </FormEntry>
                ))}

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
            >

                {isLoading ?  <Spinner /> : `${buttonText}`}
            </button>

        </form>
    )

}