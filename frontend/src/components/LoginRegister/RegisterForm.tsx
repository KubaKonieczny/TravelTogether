'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginRegisterButton from "@/components/LoginRegister/LoginRegisterButton";
import FormEntry from "@/components/LoginRegister/FormEntry";
import SocialButton from "@/components/LoginRegister/SocialButton";

export default function RegisterForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
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

    const handleSocialRegister = (provider: 'Facebook' | 'Google') => {
        // Implement social login logic here
        console.log(`Logging in with ${provider}`)
    }

    return (
        <div className="w-full max-w-md space-y-8 rounded-lg p-4 shadow-xl">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign up to your account
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
                    label={"Username"}
                    name={"username"}
                    type={"username"}
                    autoComplete={"username"}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />

                <FormEntry
                    label={"Password"}
                    name={"password"}
                    type={"password"}
                    autoComplete={"current-password"}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <FormEntry
                    label={"Repeat Password"}
                    type={"password"}
                    name={"confirm_password"}
                    autoComplete={"current-password"}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    value={repeatPassword}
                />

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <div>
                    <LoginRegisterButton label={"Sign up"}/>
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
                    <SocialButton provider="Facebook" onClick={() => handleSocialRegister('Facebook')} />
                    <SocialButton provider="Google" onClick={() => handleSocialRegister('Google')} />
                </div>
            </div>
        </div>
        </div>
    )
}