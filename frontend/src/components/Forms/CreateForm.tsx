'use client'

import { useActionState } from 'react'
import { useState, useEffect } from 'react'
import MainButton from "@/components/Buttons/MainButton";
import {useRouter} from "next/navigation";

interface FormField {
    labelText: string;
    labelId: string;
    autoComplete: string;
    type: string;
    required: boolean;
}

interface CreateFormProps {
    config: FormField[];
    buttonText: string;
    action: (prevState: any, formData: FormData) => Promise<any>;
    onClose: () => void;
    initialValues?: Record<string, any>;
    redirectTo?: string;
}

export default function CreateForm({ config, buttonText, action, onClose, initialValues, redirectTo}: CreateFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(action, {
        errors: {},
        success: false,
        message: '',
        data: {}
    })

    const [filePreview, setFilePreview] = useState<string | null>(null)

    useEffect(() => {
        if (initialValues?.profilePicture) {
            setFilePreview(initialValues.profilePicture);
        }
    }, [initialValues]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFilePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (state?.success && state?.data?.id) {
            onClose();
            router.push(`/${redirectTo}/${state.data.id}`);
        }
    }, [state, router, redirectTo, onClose]);


    return (
        <form action={formAction} className="space-y-4">
            {config.map((field) => (
                <div key={field.labelId} className="space-y-2">
                    <label htmlFor={field.labelId} className="block text-sm font-medium text-gray-700">
                        {field.labelText}
                    </label>
                    {field.type === 'textarea' ? (
                        <textarea
                            id={field.labelId}
                            name={field.labelId}
                            autoComplete={field.autoComplete}
                            required={field.required}
                            defaultValue={initialValues?.[field.labelId] || ''}
                            className="mt-1 h-20 resize block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            rows={4}
                        />
                    ) : field.type === 'file' ? (
                        <div>
                            <input
                                type="file"
                                id={field.labelId}
                                name={field.labelId}
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"
                            />
                            {filePreview && (
                                <img src={filePreview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-full" />
                            )}
                        </div>
                    ) : (
                        <input
                            type={field.type}
                            id={field.labelId}
                            name={field.labelId}
                            autoComplete={field.autoComplete}
                            required={field.required}
                            defaultValue={initialValues?.[field.labelId] || ''}
                            className="mt-1 h-7 resize block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    )}
                    {state.errors && state.errors[field.labelId] && (
                        <ul className="mt-2 text-sm text-red-600">
                            {(state.errors[field.labelId] as string[]).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
            <div className="flex justify-between pt-4">

                <MainButton label={buttonText} onclick={() => setFilePreview(null) }  />

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 px-4 py-2 md:px-6 md:py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                )}
            </div>

        </form>
    );
}

