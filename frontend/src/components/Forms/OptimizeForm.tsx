'use client'

import React, { useState} from 'react'
import MainButton from "@/components/Buttons/MainButton"

interface OptimizeFormProps {
    action: (formData: FormData) => Promise<any>
    onClose: () => void
    redirectTo?: string
}

export default function OptimizeForm({ action, onClose, redirectTo }: OptimizeFormProps) {

    const [transportMode, setTransportMode] = useState<string>('driving')
    const [preference, setPreference] = useState<number>(50)
    const [sameLocation, setSameLocation] = useState<string>('yes')
    const [state, setState] = useState({
        errors: {},
        success: false,
        message: '',
        data: {}
    })





    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-start md:justify-center items-center p-4 z-50"
        >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Optimize</h2>
        <form action={action} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700">
                    Transportation Mode
                </label>
                <select
                    id="transportMode"
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="driving">Driving</option>
                    <option value="publicTransport">Public Transport</option>
                    <option value="bike">Bike</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="preference" className="block text-sm font-medium text-gray-700">
                    Preference: Cost vs Time
                </label>
                <input
                    type="range"
                    id="preference"
                    min="0"
                    max="100"
                    value={preference}
                    onChange={(e) => setPreference(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Cost</span>
                    <span>Time</span>
                </div>
                <div className="space-y-2">
                    <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700">
                        Return to starting location
                    </label>
                    <select
                        id="sameLocation"
                        value={sameLocation}
                        onChange={(e) => setSameLocation(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>

                    </select>
                </div>
            </div>

            {state.errors && Object.keys(state.errors).length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                    {Object.entries(state.errors).map(([key, errors]) => (
                        <p key={key}>{(errors as string[]).join(', ')}</p>
                    ))}
                </div>
            )}

            <div className="flex justify-between pt-4">
                <MainButton label="Optimize"/>
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
            </div>
        </div>
        </div>
    )
}
