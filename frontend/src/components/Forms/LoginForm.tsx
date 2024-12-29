// "use client"

import React, {useState} from 'react'

import SocialButton from "@/components/Forms/SocialButton";
import Link from "next/link";
import Form from "@/components/Forms/Form";

import {signIn} from "@/auth";
import {login, doSocialLogin} from "@/utils/user"



// async function handleSubmit(formData: FormData) {
//     const result = await login(formData);
//
//     if (result?.error) {
//         setError(result.error);
//     }
// }


export default async function LoginForm() {
    // const [error, setError] = useState<string | null>(null);

    const config = [
        {
            labelText: 'Email',
            labelId: 'email',
            autoComplete: 'email',
            type: 'email',
            required: true,
        },
        {
            labelText: 'Password',
            labelId: 'password',
            autoComplete: 'current-password',
            type: 'password',
            required: true,
        }]




    return (
        <div className="w-full p-4 max-w-md space-y-8 rounded-lg shadow-xl">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <Form config={config}
                  buttonText="Sign in"
                  action={login}>
            </Form>

            {/*{error && (*/}
            {/*    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">*/}
            {/*        {error}*/}
            {/*    </div>*/}
            {/*)}*/}

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
                    <form action={doSocialLogin}>
                        <SocialButton provider="Google"/>

                    </form>
                    <form >
                        <SocialButton provider="Facebook"/>
                    {/*    action={async () => {*/}
                    {/*    'use server'*/}
                    {/*    await signIn('facebook')*/}
                    {/*}}*/}
                    </form>



                </div>
            </div>

            <p className='mt-10 text-center text-sm text-gray-500'>
                Don&apos;t have an account?{' '}
                <Link
                    href='/register'
                    className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                >
                    Register here
                </Link>
            </p>
        </div>

    )
}