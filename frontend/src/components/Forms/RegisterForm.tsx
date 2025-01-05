'use client'

import React from 'react'

import SocialButton from "@/components/Buttons/SocialButton";

import Form from "@/components/Forms/Form";
import Link from "next/link";
import {register} from "@/utils/user";


export default function RegisterForm() {

    const config = [
        {
            labelText: 'First name',
            labelId: 'first_name',
            autoComplete: 'given-name',
            type: 'text',
            required: true,
        },
        {
            labelText: 'Last name',
            labelId: 'last_name',
            autoComplete: 'family-name',
            type: 'text',
            required: true,
        },
        {
            labelText: 'Email',
            labelId: 'email',
            autoComplete: 'email',
            type: 'email',
            required: true,
        },
        {
            labelText: 'Password',
            labelId: 'password1',
            autoComplete: 'current-password',
            type: 'password',
            required: true,
        },
        {
            labelText: 'Confirm password',
            labelId: 'password2',
            autoComplete: 'current-password',
            type: 'password',
            required: true,
        }
    ];

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg p-4 shadow-xl">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign up to your account

                </h2>
            </div>
            <Form config={config}
                  buttonText="Sign up"
                   action={register}
            />

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <SocialButton provider="Facebook"/>
                    <SocialButton provider="Google" />
                </div>
            </div>
            <p className='mt-10 text-center text-sm text-gray-500'>
                Already have an account?{' '}
                <Link
                    href={'/login'}
                    className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                >
                    Login here
                </Link>
            </p>
        </div>

    )
}