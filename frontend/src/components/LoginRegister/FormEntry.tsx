import React, {ChangeEvent} from "react";

interface EntryProps {
    label: string;
    type: string;
    name: string;
    autoComplete: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

const FormEntry: React.FC<EntryProps> = (props) => {


    return (
        <div>
        <label className="block text-sm font-medium text-gray-700">
            {props.label}
        </label>
        <input
            id={props.name}
            name={props.name}
            type={props.type}
            autoComplete={props.autoComplete}
            required
            className="mt-1 h-7  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={props.value}
            onChange={props.onChange}
        />
    </div>)

}

export default FormEntry