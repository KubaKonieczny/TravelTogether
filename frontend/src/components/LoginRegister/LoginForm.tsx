'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormEntry from "@/components/LoginRegister/FormEntry";
import LoginRegisterButton from "@/components/LoginRegister/LoginRegisterButton";
import SocialButton from "@/components/LoginRegister/SocialButton";
import Link from "next/link";

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        try {
            // Here you would typically make an API call to your authentication endpoint
            console.log('Logging in with:', email, password)
            await new Promise(resolve => setTimeout(resolve, 1000))
            router.push('/dashboard')
        } catch (err) {
            setError('Invalid email or password')
        }
    }

    const handleSocialLogin = (provider: 'Facebook' | 'Google') => {
        // Implement social login logic here
        console.log(`Logging in with ${provider}`)
    }

    return (
        <div className="w-full p-4 max-w-md space-y-8 rounded-lg shadow-xl">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormEntry
                        label={"Email"}
                        name={"email"}
                        type={"email"}
                        autoComplete={"email"}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <FormEntry
                        label={"Password"}
                        name={"password"}
                        type={"password"}
                        autoComplete={"current-password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <div className="w-full">
                    <LoginRegisterButton label={"Sign in"}/>
                    </div>
                </form>

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
                        <SocialButton provider="Facebook" onClick={() => handleSocialLogin('Facebook')} />
                        <SocialButton provider="Google" onClick={() => handleSocialLogin('Google')} />
                    </div>
                </div>
                <div className="text-sm text-center">
                    <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-600">
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    )
}