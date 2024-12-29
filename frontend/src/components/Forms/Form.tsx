import React from "react";
import {FormEntry} from "@/components/Forms/index";



interface Config {
    labelText: string;
    labelId: string;
    autoComplete: string;
    type: string;
    required?: boolean;
}

interface Props {
    config: Config[],
    buttonText: string,
    action?: (formData: FormData) => Promise<void>
}


export default function Form({config,  buttonText, action}: Props) {

    return (
        <form className={"space-y-4"} action={action}  >
            {config.map((input) => (
                <FormEntry key={input.labelId}
                           labelId={input.labelId}
                           type={input.type}
                           autoComplete={input.autoComplete}
                >
                    {input.labelText}
                </FormEntry>
            ))}

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {buttonText}
            </button>

        </form>
    )

}